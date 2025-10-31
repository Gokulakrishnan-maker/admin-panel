import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "../assets/Fastridedroptaxi.png";

interface InvoiceData {
  customer: string;
  tripType: "One Way" | "Round Trip";
  pickupLocation: string;
  dropLocation: string;
  distance: number;
  ratePerKm: number;
  date: string;
  invoiceNo: string;
}

export default function generateInvoice({
  customer,
  tripType,
  pickupLocation,
  dropLocation,
  distance,
  ratePerKm,
  date,
  invoiceNo,
}: InvoiceData) {
  const doc = new jsPDF();

  // ✅ Minimum km rule
  const minKm = tripType === "One Way" ? 130 : 250;
  const billableDistance = Math.max(distance, minKm);

  // ✅ Total calculation
  const total = billableDistance * ratePerKm;

  // ✅ Header & Logo
  doc.addImage(logo, "PNG", 150, 10, 40, 30);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("FASTRIDE DROP TAXI", 10, 20);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text("3/8, Voc Nagar, Devamangalam, Ariyalur - 612902", 10, 30);
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
  const note =
    billableDistance > distance
      ? `Minimum ${minKm} km billing applied`
      : "As per actual distance";

  autoTable(doc, {
    startY: 100,
    head: [["Description", "Details"]],
    body: [
      ["Trip Type", tripType],
      ["Pickup Location", pickupLocation],
      ["Drop Location", dropLocation],
      ["Entered Distance", `${distance.toFixed(0)} km`],
      ["Billable Distance", `${billableDistance.toFixed(0)} km`],
      ["Rate per km", `₹${ratePerKm.toFixed(2)}`],
      ["Total Fare", `₹${total.toFixed(2)}`],
      ["Note", note],
    ],
    theme: "grid",
    headStyles: { fillColor: [255, 204, 0], textColor: 0, halign: "center" },
    styles: { fontSize: 11, cellPadding: 5 },
    columnStyles: {
      0: { cellWidth: 80 },
      1: { cellWidth: 80, halign: "right" },
    },
  });

  // ✅ Highlight Total
  const finalY = (doc as any).lastAutoTable.finalY + 15;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text(`Grand Total: ₹${total.toFixed(2)}`, 10, finalY);

  // ✅ Footer
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text("Thank you for choosing Fastride Drop Taxi!", 10, finalY + 10);
  doc.text("For queries, contact fastridedroptaxi.booking@gmail.com", 10, finalY + 18);

  // ✅ Save PDF
  doc.save(`invoice_${invoiceNo}.pdf`);
}
