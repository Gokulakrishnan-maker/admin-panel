import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "../assets/Fastridedroptaxi.png";

interface InvoiceData {
  customer: string;
  tripType: string;
  pickup: string;
  drop: string;
  distance: number;
  rate: number;
  date: string;
  invoiceNo: string;
}

export default function generateInvoice({
  customer,
  tripType,
  pickup,
  drop,
  distance,
  rate,
  date,
  invoiceNo,
}: InvoiceData) {
  console.log("Invoice data:", { customer, tripType, pickup, drop, distance, rate });

  const doc = new jsPDF("p", "mm", "a4");

  // ✅ Minimum distance logic
  const minDistance = tripType === "One Way" ? 130 : 250;
  const finalDistance = distance < minDistance ? minDistance : distance;

  // ✅ Charges
  const subtotal = finalDistance * rate;
  const driverBata = 400;
  const total = subtotal + driverBata;

  // ✅ Header with logo
  doc.addImage(logo, "PNG", 150, 10, 40, 30);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("FASTRIDE DROP TAXI", 10, 20);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text("3/8, VOC Nagar, Devamangalam, Ariyalur - 612902", 10, 30);
  doc.text("Phone: 6382980204 | Email: fastridedroptaxi.booking@gmail.com", 10, 38);
  doc.line(10, 42, 200, 42);

  // ✅ Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("TAXI SERVICE INVOICE", 70, 55);

  // ✅ Customer Info
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.text(`Customer Name: ${customer}`, 10, 70);
  doc.text(`Date: ${date}`, 10, 78);
  doc.text(`Invoice No: ${invoiceNo}`, 10, 86);

  // ✅ Table
  const body = [
    ["Trip Type", tripType],
    ["Pickup Location", pickup],
    ["Drop Location", drop],
    ["Distance (km)", `${finalDistance.toFixed(0)} km`],
    ["Rate per km", `₹${rate.toFixed(2)}`],
    ["Driver Bata", `₹${driverBata.toFixed(2)}`],
    ["Total Fare", `₹${total.toFixed(2)}`],
  ];

  autoTable(doc, {
    startY: 100,
    head: [["Description", "Details"]],
    body,
    theme: "grid",
    headStyles: { fillColor: [255, 204, 0], textColor: 0, halign: "center" },
    styles: { fontSize: 11, cellPadding: 5 },
    columnStyles: {
      0: { cellWidth: 100, halign: "left" },
      1: { cellWidth: 80, halign: "right" },
    },
  });

  // ✅ Minimum distance note
  const minText =
    finalDistance === minDistance
      ? `(Minimum distance fare applied — ${minDistance} km)`
      : "";

  let finalY = (doc as any).lastAutoTable.finalY + 10;
  if (minText) {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    doc.text(minText, 10, finalY);
    finalY += 10;
  }

  // ✅ Footer
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text("Thank you for choosing Fastride Drop Taxi!", 10, finalY + 10);
  doc.text("For queries, contact fastridedroptaxi.booking@gmail.com", 10, finalY + 18);

  // ✅ Save File
  doc.save(`invoice_${invoiceNo}.pdf`);
}
