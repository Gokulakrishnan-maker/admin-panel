import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "../assets/Fastridedroptaxi.png";

interface InvoiceData {
  invoiceNo: string;
  customerName: string;
  mobileNumber?: string;
  email?: string;
  address?: string;
  customerGST?: string;
  pickup: string;
  drop: string;
  tripType: string;
  date: string;
  distance: number;
  rate: number;
  vehicleType?: string;
  driverName?: string;
  cabNumber?: string;
  tollCharge?: number;
  extraCharge?: number;
  driverAllowance?: number;
}

export default function generateInvoice({
  invoiceNo,
  customerName,
  mobileNumber,
  email,
  address,
  customerGST,
  pickup,
  drop,
  tripType,
  date,
  distance,
  rate,
  vehicleType,
  driverName,
  cabNumber,
  tollCharge = 0,
  extraCharge = 0,
  driverAllowance = 400,
}: InvoiceData) {
  const doc = new jsPDF();

  // ✅ Header with logo and title
  doc.addImage(logo, "PNG", 10, 8, 40, 30);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("FASTRIDE DROP TAXI", 60, 20);

  doc.setFontSize(11);
  doc.text("INVOICE", 170, 20);
  doc.setFont("helvetica", "normal");
  doc.text(`Invoice #: ${invoiceNo}`, 150, 28);
  doc.text(`Date: ${date}`, 150, 34);

  doc.line(10, 40, 200, 40);

  // ✅ Billing sections
  doc.setFont("helvetica", "bold");
  doc.text("Billing From", 10, 48);
  doc.text("Billing To", 110, 48);

  doc.setFont("helvetica", "normal");
  doc.text("FASTRIDE DROP TAXI", 10, 54);
  doc.text("3/8 VOC Nagar, Devamangalam", 10, 60);
  doc.text("Ariyalur - 612902", 10, 66);
  doc.text("Phone: 6382980204", 10, 72);

  doc.text(`${customerName}`, 110, 54);
  if (mobileNumber) doc.text(`Phone: ${mobileNumber}`, 110, 60);
  if (email) doc.text(`${email}`, 110, 66);
  if (address) doc.text(`${address}`, 110, 72);
  if (customerGST) doc.text(`GSTIN: ${customerGST}`, 110, 78);

  // ✅ Trip Details Table
  autoTable(doc, {
    startY: 90,
    head: [["Trip Details", "Information"]],
    body: [
      ["Trip Type", tripType],
      ["Pickup Location", pickup],
      ["Drop Location", drop],
      ["Distance (km)", `${distance.toFixed(0)} km`],
      ["Rate per km", `₹${rate.toFixed(2)}`],
      ["Vehicle Type", vehicleType || "-"],
      ["Driver Name", driverName || "-"],
      ["Cab Number", cabNumber || "-"],
    ],
    theme: "grid",
    headStyles: { fillColor: [240, 240, 240], textColor: 0 },
    styles: { fontSize: 11, cellPadding: 4 },
    columnStyles: {
      0: { cellWidth: 90 },
      1: { cellWidth: 90 },
    },
  });

  // ✅ Billing Details Table
  const startY = (doc as any).lastAutoTable.finalY + 10;
  const minKm = tripType === "One Way" ? 130 : 250;
  const chargeableKm = Math.max(distance, minKm);
  const baseFare = chargeableKm * rate;
  const total = baseFare + driverAllowance + tollCharge + extraCharge;

  autoTable(doc, {
    startY,
    head: [["Billing Details", "Amount (₹)"]],
    body: [
      [`Base Fare (${chargeableKm} km × ₹${rate})`, baseFare.toFixed(2)],
      ["Driver Allowance", driverAllowance.toFixed(2)],
      ["Toll Charges", tollCharge.toFixed(2)],
      ["Extra Charges", extraCharge.toFixed(2)],
      ["", ""],
      ["Total Fare", total.toFixed(2)],
    ],
    theme: "grid",
    headStyles: { fillColor: [255, 204, 0], textColor: 0 },
    styles: { fontSize: 11, cellPadding: 4 },
    columnStyles: {
      0: { cellWidth: 100 },
      1: { cellWidth: 80, halign: "right" },
    },
  });

  // ✅ Footer
  const finalY = (doc as any).lastAutoTable.finalY + 20;
  doc.setFontSize(10);
  doc.text("This is a computer-generated invoice and does not require a signature.", 10, finalY);
  doc.text("Thank you for choosing Fastride Drop Taxi!", 10, finalY + 10);
  doc.text("For queries: fastridedroptaxi.booking@gmail.com", 10, finalY + 16);

  // ✅ Save the PDF
  doc.save(`invoice_${invoiceNo}.pdf`);
}
