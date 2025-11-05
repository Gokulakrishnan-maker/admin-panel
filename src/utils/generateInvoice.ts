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

// Keep only printable ASCII and normalize spaces
const ascii = (v: any) =>
  String(v ?? "-")
    .replace(/[^\x20-\x7E]/g, "") // drop non-ASCII (₹, ×, smart quotes, etc.)
    .replace(/\s+/g, " ")
    .trim();

const fmtMoney = (n: number) =>
  "Rs " + n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

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
  // Numbers (safe)
  const km = Number(distance) || 0;
  const perKmRate = Number(rate) || 0;
  const toll = Number(tollCharge) || 0;
  const extra = Number(extraCharge) || 0;

  // Billing logic
  const minKm = tripType === "One Way" ? 130 : 250;
  const chargeableKm = Math.max(km, minKm);
  const driverBata = 400;
  const baseFare = chargeableKm * perKmRate;
  const total = baseFare + driverBata + toll + extra;

  const doc = new jsPDF({ unit: "mm", format: "a4" });
  doc.setFont("helvetica", "normal");

  // Header
  try {
    doc.addImage(logo, "PNG", 10, 8, 35, 25);
  } catch {}
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("FASTRIDE DROP TAXI", 55, 20);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text("INVOICE", 190, 15, { align: "right" });
  doc.text(`Invoice #: ${ascii(invoiceNo)}`, 190, 22, { align: "right" });
  doc.text(`Date: ${ascii(date)}`, 190, 28, { align: "right" });
  doc.line(10, 35, 200, 35);

  // Addresses
  doc.setFont("helvetica", "bold");
  doc.text("Billing From", 10, 42);
  doc.text("Billing To", 110, 42);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);

  [
    "FASTRIDE DROP TAXI",
    "3/8 VOC Nagar, Devamangalam",
    "Ariyalur - 612902",
    "Phone: 6382980204",
    "www.fastridedroptaxi.com",
  ].forEach((line, i) => doc.text(line, 10, 48 + i * 5));

  const toLines = [
    ascii(customer) || "Customer",
    ascii(customerAddress),
    `Mobile: ${ascii(customerMobile)}`,
    `${ascii(pickup)} -> ${ascii(drop)}`,
  ].filter(Boolean);
  toLines.forEach((line, i) => doc.text(line, 110, 48 + i * 5));

  // Trip details (ASCII only)
  autoTable(doc, {
    startY: 78,
    head: [["Trip Details", "Information"]],
    body: [
      ["Trip Type", ascii(tripType)],
      ["Pickup Location", ascii(pickup)],
      ["Drop Location", ascii(drop)],
      ["Distance (km)", `${km.toFixed(1)} km`],
      ["Rate per km", `Rs ${perKmRate.toFixed(2)}`], // <- no ₹
      ["Vehicle Type", ascii(vehicleType)],
      ["Driver Name", ascii(driverName)],
    ],
    theme: "grid",
    headStyles: { fillColor: [245, 245, 245], textColor: 0 },
    styles: { fontSize: 10, cellPadding: 4 },
    columnStyles: { 0: { cellWidth: 90 }, 1: { cellWidth: 90, halign: "right" } },
  });

  // Billing details
  const startY = (doc as any).lastAutoTable.finalY + 10;
  autoTable(doc, {
    startY,
    head: [["Billing Details", "Amount (Rs)"]], // <- ASCII header
    body: [
      [`Base Fare (${chargeableKm} km x Rs ${perKmRate.toFixed(2)})`, fmtMoney(baseFare)],
      ["Driver Allowance", fmtMoney(driverBata)],
      ["Toll Charge", fmtMoney(toll)],
      ["Extra Charge", fmtMoney(extra)],
      ["", ""],
      ["Total Fare", fmtMoney(total)],
    ],
    theme: "grid",
    headStyles: { fillColor: [255, 204, 0], textColor: 0 },
    styles: { fontSize: 10, cellPadding: 4 },
    columnStyles: { 0: { cellWidth: 100 }, 1: { cellWidth: 80, halign: "right" } },
  });

  // Footer
  const finalY = (doc as any).lastAutoTable.finalY + 15;
  doc.setFontSize(9);
  doc.text("This is a computer-generated invoice and does not require a signature.", 10, finalY);
  doc.text("Thank you for choosing Fastride Drop Taxi!", 10, finalY + 7);
  doc.text("For queries: fastridedroptaxi.booking@gmail.com", 10, finalY + 12);

  doc.save(`invoice_${ascii(invoiceNo)}.pdf`);
}
