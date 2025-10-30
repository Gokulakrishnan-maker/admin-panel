import jsPDF from "jspdf";

export default function generateInvoice({ customer, amount, date }: any) {
  const doc = new jsPDF();
  doc.text("Fastride Drop Taxi", 10, 10);
  doc.text("Address: 3/8, Voc Nagar, Devamangalam, Ariyalur 612902", 10, 20);
  doc.text("Phone: 6382980204 | Email: fastridedroptaxi.booking@gmail.com", 10, 30);
  doc.text(`Customer: ${customer}`, 10, 50);
  doc.text(`Amount: ₹${amount}`, 10, 60);
  doc.text(`Date: ${date}`, 10, 70);
  doc.save("invoice.pdf");
}