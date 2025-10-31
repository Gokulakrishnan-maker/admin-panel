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
  total: number;
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
  total,
  date,
  invoiceNo,
}: InvoiceData) {
  console.log("Invoice data received:", {
    customer,
    tripType,
    pickup,
    drop,
    distance,
    rate,
    total,
    date,
    invoiceNo,
  });

  const doc = new jsPDF();

  // ✅ Company Info
  doc.addImage(logo, "PNG", 150, 10, 40, 30); // top-right logo
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
  autoTable(doc, {
    startY: 100,
    head: [["Description", "Details"]],
    body: [
      ["Trip Type", tripType],
      ["Pickup Location", pickup],
      ["Drop Location", drop],
      ["Distance (km)", `${distance.toFixed(0)} km`],
      ["Rate per km", `₹${rate.toFixed(2)}`],
      ["Total Fare", `₹${total.toFixed(2)}`],
    ],
    theme: "grid",
    headStyles: { fillColor: [255, 204, 0], textColor: 0, halign: "center" },
    styles: { fontSize: 11, cellPadding: 5 },
    columnStyles: {
      0: { cellWidth: 80 },
      1: { cellWidth: 80, halign: "right" },
    },
  });

  // ✅ Footer
  const finalY = (doc as any).lastAutoTable.finalY + 20;
  doc.setFontSize(11);
  doc.text("Thank you for choosing Fastride Drop Taxi!", 10, finalY);
  doc.text("For queries, contact fastridedroptaxi.booking@gmail.com", 10, finalY + 8);

  // ✅ Save
  doc.save(`invoice_${invoiceNo}.pdf`);
}



