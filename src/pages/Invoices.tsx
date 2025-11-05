import { useState } from "react";
import generateInvoice from "../utils/generateInvoice";

export default function Invoices() {
  const [form, setForm] = useState({
    customer: "",
    pickup: "",
    drop: "",
    tripType: "One Way",
    distance: "",
    rate: "",
    vehicleType: "",
    driverName: "",
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleGenerate = () => {
    if (!form.customer || !form.pickup || !form.drop) {
      alert("Please fill all required fields");
      return;
    }

    const invoiceNo = "INV" + Date.now();

    generateInvoice({
      invoiceNo,
      customer: form.customer,
      pickup: form.pickup,
      drop: form.drop,
      tripType: form.tripType,
      date: new Date().toLocaleDateString(),
      distance: parseFloat(form.distance) || 0,
      rate: parseFloat(form.rate) || 0,
      vehicleType: form.vehicleType,
      driverName: form.driverName,
      tollCharge: 0,
      extraCharge: 0,
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Generate Invoice</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
        <input name="customer" placeholder="Customer Name" className="border p-2 rounded" onChange={handleChange} />
        <input name="pickup" placeholder="Pickup Location" className="border p-2 rounded" onChange={handleChange} />
        <input name="drop" placeholder="Drop Location" className="border p-2 rounded" onChange={handleChange} />
        <select name="tripType" className="border p-2 rounded" onChange={handleChange}>
          <option>One Way</option>
          <option>Round Trip</option>
        </select>
        <input name="distance" type="number" placeholder="Distance (km)" className="border p-2 rounded" onChange={handleChange} />
        <input name="rate" type="number" placeholder="Rate per km" className="border p-2 rounded" onChange={handleChange} />
        <input name="vehicleType" placeholder="Vehicle Type" className="border p-2 rounded" onChange={handleChange} />
        <input name="driverName" placeholder="Driver Name" className="border p-2 rounded" onChange={handleChange} />
      </div>

      <button
        onClick={handleGenerate}
        className="mt-6 bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-2 rounded font-semibold"
      >
        Download Invoice
      </button>
    </div>
  );
}
