import React, { useState } from "react";
import generateInvoice from "../utils/generateInvoice";

const Invoices: React.FC = () => {
  const [form, setForm] = useState({
    customer: "",
    tripType: "One Way",
    pickup: "",
    drop: "",
    distance: "",
    rate: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleGenerate = (preview: boolean) => {
    const { customer, tripType, pickup, drop, distance, rate } = form;

    if (!customer || !pickup || !drop || !distance || !rate) {
      alert("Please fill all fields");
      return;
    }

    generateInvoice({
      ...form,
      distance: parseFloat(distance),
      rate: parseFloat(rate),
      date: new Date().toLocaleDateString(),
      invoiceNo: `INV${Date.now()}`,
      preview,
    });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 text-center text-gray-800">
          Generate Taxi Invoice
        </h2>

        <div className="space-y-3">
          <input
            name="customer"
            placeholder="Customer Name"
            value={form.customer}
            onChange={handleChange}
            className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none"
          />

          <select
            name="tripType"
            value={form.tripType}
            onChange={handleChange}
            className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none"
          >
            <option>One Way</option>
            <option>Round Trip</option>
          </select>

          <input
            name="pickup"
            placeholder="Pickup Location"
            value={form.pickup}
            onChange={handleChange}
            className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none"
          />

          <input
            name="drop"
            placeholder="Drop Location"
            value={form.drop}
            onChange={handleChange}
            className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none"
          />

          <input
            name="distance"
            placeholder="Distance (km)"
            value={form.distance}
            onChange={handleChange}
            className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none"
          />

          <input
            name="rate"
            placeholder="Rate per km (₹)"
            value={form.rate}
            onChange={handleChange}
            className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none"
          />
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-3 mt-6">
          <button
            onClick={() => handleGenerate(true)}
            className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-4 rounded-lg transition"
          >
            🔍 Preview
          </button>
          <button
            onClick={() => handleGenerate(false)}
            className="flex-1 bg-black hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            💾 Download
          </button>
        </div>
      </div>
    </div>
  );
};

export default Invoices;
