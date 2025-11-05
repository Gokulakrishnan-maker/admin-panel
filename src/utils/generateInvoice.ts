import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "../assets/Fastridedroptaxi.png";

interface InvoiceData {
  invoiceNo: string;
  customer: string;
  pickup: string;
  drop: string;
  tripType: string;
  date: string;
  distance: number | string;
  rate: number | string;
  vehicleType?: string;
  driverName?: string;
  tollCharge?: number | string;
  extraCharge?: number | string;
  customerMobile?: string;
  customerAddress?: string;
}

export default function generateInvoice({
  invoiceNo,
  customer,
  pickup,
  drop,
  tripType,
  date,
  distance,
  rate,
  vehicleType = "-",
  driverName = "-",
  tollCharge = 0,
  extraCharge = 0,
  customerMobile = "-",
  customerAddress = "-",
}: InvoiceData) {
  // ✅ Safe parsing
  const km = Number(distance) || 0;
  const perKmRate = Number(rate) || 0;
  const toll = Number(tollCharge) || 0;
  const extra = Number(extraCharge) || 0;

  // ✅ Taxi logic
  const minKm = tripType === "One Way" ? 130 : 250;
  const chargeableKm = Math.max(km, minKm);
  const driverBata = 400;
  const baseFare = chargeableKm * perKmRate;
  const total = baseFare + driverBata + toll + extra;

  // ✅ PDF Setup
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  doc.setFont("helvetica", "normal");

  // ---------- HEADER ----------
  try {
    doc.addImage(logo, "PNG", 10, 8, 35, 25);
  } catch {
    // Ignore if missing
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("FASTRIDE DROP TAXI", 55, 20);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text("INVOICE", 190, 15, { align: "right" });
  doc.text(`Invoice #: ${invoiceNo}`, 190, 22, { align: "right" });
  doc.text(`Date: ${date}`, 190, 28, { align: "right" });
  doc.line(10, 35, 200, 35);

  // ---------- ADDRESSES ----------
  doc.setFont("helvetica", "bold");
  doc.text("Billing From", 10, 42);
  doc.text("Billing To", 110, 42);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);

  const fromAddress = [
    "FASTRIDE DROP TAXI",
    "3/8 VOC Nagar, Devamangalam",
    "Ariyalur - 612902",
    "Phone: 6382980204",
    "www.fastridedroptaxi.com",
  ];
  let y = 48;
  fromAddress.forEach(line => {
    doc.text(line, 10, y);
    y += 5;
  });

  // ✅ Proper customer section — shows name, address, mobile
  const toAddress = [
    customer || "Customer Name",
    customerAddress || "",
    `Mobile: ${customerMobile}`,
    `${pickup || "-"} → ${drop || "-"}`,
  ];
  let cy = 48;
  toAddress.forEach(line => {
    if (line) doc.text(line, 110, cy);
    cy += 5;
  });

  // ---------- TRIP DETAILS ----------
  autoTable(doc, {
    startY: 78,
    head: [["Trip Details", "Information"]],
    body: [
      ["Trip Type", sanitize(tripType)],
      ["Pickup Location", sanitize(pickup)],
      ["Drop Location", sanitize(drop)],
      ["Distance (km)", `${km.toFixed(1)} km`],
      ["Rate per km", `₹${perKmRate.toFixed(2)}`],
      ["Vehicle Type", sanitize(vehicleType)],
      ["Driver Name", sanitize(driverName)],
    ],
    theme: "grid",
    headStyles: { fillColor: [245, 245, 245], textColor: 0 },
    styles: { fontSize: 10, cellPadding: 4 },
    columnStyles: {
      0: { cellWidth: 90 },
      1: { cellWidth: 90, halign: "right" },
    },
  });

  // ---------- BILLING DETAILS ----------
  const startY = (doc as any).lastAutoTable.finalY + 10;
  autoTable(doc, {
    startY,
    head: [["Billing Details", "Amount (₹)"]],
    body: [
      [`Base Fare (${chargeableKm} km × ₹${perKmRate.toFixed(2)})`, baseFare.toFixed(2)],
      ["Driver Allowance", driverBata.toFixed(2)],
      ["Toll Charge", toll.toFixed(2)],
      ["Extra Charge", extra.toFixed(2)],
      ["", ""],
      ["Total Fare", total.toFixed(2)],
    ],
    theme: "grid",
    headStyles: { fillColor: [255, 204, 0], textColor: 0 },
    styles: { fontSize: 10, cellPadding: 4 },
    columnStyles: {
      0: { cellWidth: 100 },
      1: { cellWidth: 80, halign: "right" },
    },
  });

  // ---------- FOOTER ----------
  const finalY = (doc as any).lastAutoTable.finalY + 15;
  doc.setFontSize(9);
  doc.text("This is a computer-generated invoice and does not require a signature.", 10, finalY);
  doc.text("Thank you for choosing Fastride Drop Taxi!", 10, finalY + 7);
  doc.text("For queries: fastridedroptaxi.booking@gmail.com", 10, finalY + 12);

  // ✅ Save PDF
  doc.save(`invoice_${invoiceNo}.pdf`);
}

// ✅ Utility: sanitize & remove unwanted symbols
function sanitize(text: any): string {
  if (!text) return "-";
  return String(text).replace(/&/g, "and").replace(/\s+/g, " ").trim();
}
