import { useState } from "react";
import generateInvoice from "../utils/generateInvoice";

export default function Invoices() {
  const [form, setForm] = useState({
    customer: "",
    from: "",
    to: "",
    distance: "",
    amount: "",
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleGenerate = () => {
    if (!form.customer || !form.amount) {
      alert("Please fill all required fields");
      return;
    }

    const today = new Date().toLocaleDateString();

    generateInvoice({
      customer: form.customer,
      amount: form.amount,
      date: today,
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow-md w-96">
        <h2 className="text-xl font-bold mb-4 text-center">Create Invoice</h2>

        <input
          name="customer"
          placeholder="Customer Name"
          value={form.customer}
          onChange={handleChange}
          className="border p-2 w-full mb-2"
        />
        <input
          name="from"
          placeholder="From"
          value={form.from}
          onChange={handleChange}
          className="border p-2 w-full mb-2"
        />
        <input
          name="to"
          placeholder="To"
          value={form.to}
          onChange={handleChange}
          className="border p-2 w-full mb-2"
        />
        <input
          name="distance"
          placeholder="Distance (km)"
          value={form.distance}
          onChange={handleChange}
          className="border p-2 w-full mb-2"
        />
        <input
          name="amount"
          placeholder="Amount (₹)"
          value={form.amount}
          onChange={handleChange}
          className="border p-2 w-full mb-4"
        />

        <button
          onClick={handleGenerate}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Generate Invoice
        </button>
      </div>
    </div>
  );
}
