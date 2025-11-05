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
  distance: number;
  rate: number;
  vehicleType?: string;
  driverName?: string;
  tollCharge?: number;
  extraCharge?: number;
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
  vehicleType,
  driverName,
  tollCharge = 0,
  extraCharge = 0,
}: InvoiceData) {
  // ✅ Ensure values are safe
  const km = parseFloat(String(distance)) || 0;
  const perKmRate = parseFloat(String(rate)) || 0;
  const toll = parseFloat(String(tollCharge)) || 0;
  const extra = parseFloat(String(extraCharge)) || 0;

  const minKm = tripType === "One Way" ? 130 : 250;
  const chargeableKm = Math.max(km, minKm);
  const driverBata = 400;
  const baseFare = chargeableKm * perKmRate;
  const total = baseFare + driverBata + toll + extra;

  const doc = new jsPDF({ unit: "mm", format: "a4" });

  // ✅ Use standard font to avoid encoding issues
  doc.setFont("helvetica", "normal");

  // --- HEADER ---
  doc.addImage(logo, "PNG", 10, 8, 35, 25);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("FASTRIDE DROP TAXI", 55, 20);

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text(`INVOICE`, 190, 15, { align: "right" });
  doc.text(`Invoice #: ${invoiceNo}`, 190, 22, { align: "right" });
  doc.text(`Date: ${date}`, 190, 28, { align: "right" });

  doc.line(10, 35, 200, 35);

  // --- ADDRESS ---
  doc.setFont("helvetica", "bold");
  doc.text("Billing From", 10, 42);
  doc.text("Billing To", 110, 42);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);

  doc.text("FASTRIDE DROP TAXI", 10, 48);
  doc.text("3/8 VOC Nagar, Devamangalam", 10, 53);
  doc.text("Ariyalur - 612902", 10, 58);
  doc.text("Phone: 6382980204", 10, 63);
  doc.text("www.fastridedroptaxi.com", 10, 68);

  doc.text(customer || "Customer Name", 110, 48);
  doc.text(`${pickup || ""} ➝ ${drop || ""}`, 110, 53);

  // --- TRIP DETAILS ---
  autoTable(doc, {
    startY: 78,
    head: [["Trip Details", "Information"]],
    body: [
      ["Trip Type", tripType],
      ["Pickup Location", pickup],
      ["Drop Location", drop],
      ["Distance (km)", `${km} km`],
      ["Rate per km", `₹${perKmRate.toFixed(2)}`],
      ["Vehicle Type", vehicleType || "-"],
      ["Driver Name", driverName || "-"],
    ],
    theme: "grid",
    headStyles: { fillColor: [245, 245, 245], textColor: 0 },
    styles: { fontSize: 10, cellPadding: 4 },
    columnStyles: {
      0: { cellWidth: 90 },
      1: { cellWidth: 90, halign: "right" },
    },
  });

  // --- BILLING DETAILS ---
  const startY = (doc as any).lastAutoTable.finalY + 10;
  autoTable(doc, {
    startY,
    head: [["Billing Details", "Amount (₹)"]],
    body: [
      [`Base Fare (${chargeableKm} km x ₹${perKmRate.toFixed(2)})`, baseFare.toFixed(2)],
      ["Driver Allowance", driverBata.toFixed(2)],
      ["Toll Charges", toll.toFixed(2)],
      ["Extra Charges", extra.toFixed(2)],
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

  // --- FOOTER ---
  const finalY = (doc as any).lastAutoTable.finalY + 15;
  doc.setFontSize(9);
  doc.text("This is a computer-generated invoice and does not require a signature.", 10, finalY);
  doc.text("Thank you for choosing Fastride Drop Taxi!", 10, finalY + 7);
  doc.text("For queries: fastridedroptaxi.booking@gmail.com", 10, finalY + 12);

  doc.save(`invoice_${invoiceNo}.pdf`);
}
