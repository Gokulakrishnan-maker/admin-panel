import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "../assets/Fastridedroptaxi.png"; // adjust path if needed

export default function generateInvoice({
  customer,
  pickup,
  drop,
  tripType,
  distance,
  rate,
  date,
}: any) {
  const doc = new jsPDF();

  // ---- HEADER ----
  doc.addImage(logo, "PNG", 150, 10, 40, 25); // top-right logo
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("FASTRIDE DROP TAXI", 14, 20);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text("3/8, Voc Nagar, Devamangalam, Ariyalur - 612902", 14, 28);
  doc.text("Phone: 6382980204 | Email: fastridedroptaxi.booking@gmail.com", 14, 34);
  doc.line(14, 38, 196, 38); // divider

  // ---- INVOICE HEADER ----
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("TAXI SERVICE INVOICE", 80, 48);

  // ---- CUSTOMER DETAILS ----
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.text(`Customer Name: ${customer}`, 14, 60);
  doc.text(`Date: ${date}`, 14, 68);
  doc.text(`Invoice No: INV-${Math.floor(Math.random() * 10000)}`, 14, 76);

  // ---- TABLE ----
  const totalAmount = distance * rate;
  const gst = totalAmount * 0.05;
  const grandTotal = totalAmount + gst;

  autoTable(doc, {
    startY: 85,
    head: [["Description", "Details"]],
    body: [
      ["Trip Type", tripType],
      ["Pickup Location", pickup],
      ["Drop Location", drop],
      ["Distance (km)", `${distance} km`],
      ["Rate per km", `₹${rate}`],
      ["Subtotal", `₹${totalAmount.toFixed(2)}`],
      ["GST (5%)", `₹${gst.toFixed(2)}`],
      ["Total Amount", `₹${grandTotal.toFixed(2)}`],
    ],
    theme: "grid",
    styles: { fontSize: 11, cellPadding: 4 },
    headStyles: { fillColor: [255, 204, 0], textColor: 0, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [250, 250, 250] },
    columnStyles: {
      0: { halign: "left", fontStyle: "bold" },
      1: { halign: "right" },
    },
  });

  // ---- FOOTER ----
  const finalY = (doc as any).lastAutoTable.finalY + 15;
  doc.line(14, finalY, 196, finalY);
  doc.setFontSize(10);
  doc.text("Thank you for riding with FASTRIDE DROP TAXI!", 14, finalY + 8);
  doc.text("Safe • Reliable • Affordable", 14, finalY + 14);
  doc.text("This is a system-generated invoice.", 14, finalY + 20);

  // ---- SAVE ----
  doc.save(`Invoice_${customer}_${date}.pdf`);
}
