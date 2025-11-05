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

  doc.text(`${customer}`, 110, 54);
  doc.text(`${pickup} ➝ ${drop}`, 110, 60);

  // ✅ Trip Details Table
  autoTable(doc, {
    startY: 82,
    head: [["Trip Details", "Information"]],
    body: [
      ["Trip Type", tripType],
      ["Pickup Location", pickup],
      ["Drop Location", drop],
      ["Distance (km)", `${distance.toFixed(0)} km`],
      ["Rate per km", `₹${rate.toFixed(2)}`],
      ["Vehicle Type", vehicleType],
      ["Driver Name", driverName],
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
  const driverBata = 400;
  const baseFare = chargeableKm * rate;
  const total = baseFare + driverBata + tollCharge + extraCharge;

  autoTable(doc, {
    startY,
    head: [["Billing Details", "Amount (₹)"]],
    body: [
      [`Base Fare (${chargeableKm} km x ₹${rate})`, baseFare.toFixed(2)],
      ["Driver Allowance", driverBata.toFixed(2)],
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
