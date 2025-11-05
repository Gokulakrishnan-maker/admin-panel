import { useState } from "react";
import generateInvoice from "../utils/generateInvoice";

export default function Invoices() {
  const [form, setForm] = useState({
    invoiceType: "NO GST",
    journeyType: "One Way",
    customerName: "",
    mobileNumber: "",
    email: "",
    address: "",
    customerGST: "",
    origin: "",
    destination: "",
    pickupDate: "",
    pickupTime: "",
    vehicleType: "SEDAN",
    ratePerKM: "",
    driverAllowance: "400",
    tollCost: "0",
    totalKM: "",
    extraCharges: "0",
    driverName: "",
    cabNumber: "",
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleGenerate = () => {
    const invoiceNo = "INV" + Date.now();
    const totalAmount =
      parseFloat(form.totalKM || "0") * parseFloat(form.ratePerKM || "0") +
      parseFloat(form.driverAllowance || "0") +
      parseFloat(form.tollCost || "0") +
      parseFloat(form.extraCharges || "0");

    generateInvoice({
      invoiceNo,
      ...form,
      totalAmount,
      date: new Date().toLocaleDateString(),
    });
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">Generate Invoice</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[
          ["invoiceType", "Invoice Type"],
          ["customerName", "Customer Name"],
          ["mobileNumber", "Mobile Number"],
          ["email", "Email"],
          ["address", "Address"],
          ["customerGST", "Customer GST (If Any)"],
          ["origin", "Origin"],
          ["destination", "Destination"],
          ["ratePerKM", "Rate per KM"],
          ["driverAllowance", "Driver Allowance"],
          ["tollCost", "Toll Cost"],
          ["totalKM", "Total KM"],
          ["extraCharges", "Extra Charges"],
          ["driverName", "Driver Name"],
          ["cabNumber", "Cab Number"],
        ].map(([name, placeholder]) => (
          <input
            key={name}
            name={name}
            value={form[name]}
            placeholder={placeholder}
            className="border p-2 rounded"
            onChange={handleChange}
          />
        ))}

        <select name="journeyType" value={form.journeyType} onChange={handleChange} className="border p-2 rounded">
          <option>One Way</option>
          <option>Round Trip</option>
        </select>

        <select name="vehicleType" value={form.vehicleType} onChange={handleChange} className="border p-2 rounded">
          <option>SEDAN</option>
          <option>ETIOS</option>
          <option>SUV</option>
          <option>INNOVA</option>
          <option>INNOVA CRYSTA</option>
        </select>

        <input name="pickupDate" type="date" className="border p-2 rounded" value={form.pickupDate} onChange={handleChange} />
        <input name="pickupTime" type="time" className="border p-2 rounded" value={form.pickupTime} onChange={handleChange} />
      </div>

      <button
        onClick={handleGenerate}
        className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold"
      >
        Generate Invoice
      </button>
    </div>
  );
}
