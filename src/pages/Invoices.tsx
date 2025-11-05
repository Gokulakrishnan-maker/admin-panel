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
    generateInvoice({
      invoiceNo,
      ...form,
      totalAmount:
        parseFloat(form.totalKM || "0") * parseFloat(form.ratePerKM || "0") +
        parseFloat(form.driverAllowance || "0") +
        parseFloat(form.tollCost || "0") +
        parseFloat(form.extraCharges || "0"),
      date: new Date().toLocaleDateString(),
    });
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">Generate Invoice</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input name="invoiceType" value={form.invoiceType} onChange={handleChange} className="border p-2 rounded" placeholder="Invoice Type" />
        <select name="journeyType" value={form.journeyType} onChange={handleChange} className="border p-2 rounded">
          <option>One Way</option>
          <option>Round Trip</option>
        </select>

        <input name="customerName" placeholder="Customer Name" className="border p-2 rounded" onChange={handleChange} />
        <input name="mobileNumber" placeholder="Mobile Number" className="border p-2 rounded" onChange={handleChange} />
        <input name="email" placeholder="Email" className="border p-2 rounded" onChange={handleChange} />
        <input name="address" placeholder="Address" className="border p-2 rounded" onChange={handleChange} />
        <input name="customerGST" placeholder="Customer GST (If Any)" className="border p-2 rounded" onChange={handleChange} />

        <input name="origin" placeholder="Origin" className="border p-2 rounded" onChange={handleChange} />
        <input name="destination" placeholder="Destination" className="border p-2 rounded" onChange={handleChange} />

        <input name="pickupDate" type="date" className="border p-2 rounded" onChange={handleChange} />
        <input name="pickupTime" type="time" className="border p-2 rounded" onChange={handleChange} />

        <select name="vehicleType" value={form.vehicleType} onChange={handleChange} className="border p-2 rounded">
          <option>SEDAN</option>
          <option>ETIOS</option>
          <option>SUV</option>
          <option>INNOVA</option>
          <option>INNOVA CRYSTA</option>
        </select>

        <input name="ratePerKM" type="number" placeholder="Rate per KM" className="border p-2 rounded" onChange={handleChange} />
        <input name="driverAllowance" type="number" placeholder="Driver Allowance" className="border p-2 rounded" value={form.driverAllowance} onChange={handleChange} />
        <input name="tollCost" type="number" placeholder="Toll Cost" className="border p-2 rounded" onChange={handleChange} />
        <input name="totalKM" type="number" placeholder="Total KM" className="border p-2 rounded" onChange={handleChange} />
        <input name="extraCharges" type="number" placeholder="Extra Charges" className="border p-2 rounded" onChange={handleChange} />

        <input name="driverName" placeholder="Driver Name" className="border p-2 rounded" onChange={handleChange} />
        <input name="cabNumber" placeholder="Cab Number" className="border p-2 rounded" onChange={handleChange} />
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
