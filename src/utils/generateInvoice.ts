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
  preview?: boolean;
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
  preview = false,
}: InvoiceData) {
  const doc = new jsPDF("p", "mm", "a4");

  // Mobile-friendly content width and scaling
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 10;
  const contentWidth = pageWidth - margin * 2;

  const minDistance = tripType === "One Way" ? 130 : 250;
  const finalDistance = distance < minDistance ? minDistance : distance;

  const driverBata = 400;
  const subtotal = finalDistance * rate;
  const total = subtotal + driverBata;

  // === HEADER ===
  doc.addImage(logo, "PNG", pageWidth - 55, 10, 45, 25);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("FASTRIDE DROP TAXI", margin, 20);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("3/8, VOC Nagar, Devamangalam, Ariyalur - 612902", margin, 28);
  doc.text("Phone: 6382980204 | Email: fastridedroptaxi.booking@gmail.com", margin, 34);
  doc.line(margin, 38, pageWidth - margin, 38);

  // === TITLE ===
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("TAXI SERVICE INVOICE", pageWidth / 2, 50, { align: "center" });

  // === INFO ===
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(`Customer Name: ${customer}`, margin, 65);
  doc.text(`Date: ${date}`, margin, 72);
  doc.text(`Invoice No: ${invoiceNo}`, margin, 79);

  // === TABLE ===
  const body = [
    ["Trip Type", tripType],
    ["Pickup Location", pickup],
    ["Drop Location", drop],
    ["Distance (km)", `${finalDistance} km`],
    ["Rate per km", `₹ ${rate.toFixed(2)}`],
    ["Driver Bata", `₹ ${driverBata.toFixed(2)}`],
    ["Total Fare", `₹ ${total.toFixed(2)}`],
  ];

  autoTable(doc, {
    startY: 90,
    head: [["Description", "Details"]],
    body,
    theme: "grid",
    styles: { fontSize: 10, cellPadding: 4 },
    headStyles: { fillColor: [255, 204, 0], textColor: 0 },
    columnStyles: {
      0: { cellWidth: contentWidth * 0.55 },
      1: { cellWidth: contentWidth * 0.4, halign: "right" },
    },
  });

  // === FOOTER ===
  const finalY = (doc as any).lastAutoTable.finalY + 15;
  doc.setFontSize(10);
  doc.setFont("helvetica", "italic");
  doc.text(
    "Thank you for choosing Fastride Drop Taxi!",
    margin,
    finalY
  );
  doc.text(
    "For queries: fastridedroptaxi.booking@gmail.com",
    margin,
    finalY + 8
  );

  // === ACTION ===
  if (preview) {
    const blob = doc.output("blob");
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  } else {
    doc.save(`invoice_${invoiceNo}.pdf`);
  }
}
