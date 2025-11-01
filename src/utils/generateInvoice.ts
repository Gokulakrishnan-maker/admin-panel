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
  const doc = new jsPDF("p", "mm", "a4");

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 10;

  // ✅ Apply minimum km rule
  const minDistance = tripType === "One Way" ? 130 : 250;
  const finalDistance = Math.max(distance, minDistance);

  // ✅ Calculation
  const driverBata = 400;
  const subtotal = finalDistance * rate;
  const total = subtotal + driverBata;

  // ✅ Header
  doc.addImage(logo, "PNG", pageWidth - 55, 10, 45, 25);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("FASTRIDE DROP TAXI", margin, 20);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("3/8, Voc Nagar, Devamangalam, Ariyalur - 612902", margin, 28);
  doc.text("Phone: 6382980204 | Email: fastridedroptaxi.booking@gmail.com", margin, 34);
  doc.line(margin, 38, pageWidth - margin, 38);

  // ✅ Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("TAXI SERVICE INVOICE", pageWidth / 2, 50, { align: "center" });

  // ✅ Customer Info
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(`Customer Name: ${customer}`, margin, 65);
  doc.text(`Date: ${date}`, margin, 72);
  doc.text(`Invoice No: ${invoiceNo}`, margin, 79);

  // ✅ Table content
  const body = [
    ["Trip Type", tripType],
    ["Pickup Location", pickup],
    ["Drop Location", drop],
    ["Distance (km)", `${finalDistance} km`],
    ["Rate per km", `₹ ${rate.toFixed(2)}`],
    ["Driver Bata", `₹ ${driverBata.toFixed(2)}`],
    ["Total Fare", `₹ ${total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`],
  ];

  autoTable(doc, {
    startY: 90,
    head: [["Description", "Details"]],
    body,
    theme: "grid",
    styles: {
      fontSize: 11,
      cellPadding: 5,
      overflow: "linebreak",
    },
    headStyles: {
      fillColor: [255, 204, 0],
      textColor: 0,
      halign: "center",
    },
    columnStyles: {
      0: { cellWidth: 90 },
      1: { cellWidth: 90, halign: "right" },
    },
  });

  // ✅ Footer
  const finalY = (doc as any).lastAutoTable.finalY + 15;
  doc.setFont("helvetica", "italic");
  doc.setFontSize(10);
  doc.text("Thank you for choosing Fastride Drop Taxi!", margin, finalY);
  doc.text("For queries, contact fastridedroptaxi.booking@gmail.com", margin, finalY + 7);

  // ✅ Save as file
  doc.save(`invoice_${invoiceNo}.pdf`);
}
