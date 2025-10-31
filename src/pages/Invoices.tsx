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
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleGenerate = () => {
    if (!form.customer || !form.pickup || !form.drop || !form.distance || !form.rate) {
      alert("Please fill all fields!");
      return;
    }
    generateInvoice({
      ...form,
      distance: parseFloat(form.distance),
      rate: parseFloat(form.rate),
      date: new Date().toLocaleDateString(),
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Generate Invoice</h1>

      <div className="grid grid-cols-2 gap-4 max-w-xl">
        <input name="customer" placeholder="Customer Name" className="border p-2 rounded" onChange={handleChange} />
        <input name="pickup" placeholder="Pickup Location" className="border p-2 rounded" onChange={handleChange} />
        <input name="drop" placeholder="Drop Location" className="border p-2 rounded" onChange={handleChange} />
        <select name="tripType" className="border p-2 rounded" onChange={handleChange}>
          <option>One Way</option>
          <option>Round Trip</option>
        </select>
        <input name="distance" type="number" placeholder="Distance (km)" className="border p-2 rounded" onChange={handleChange} />
        <input name="rate" type="number" placeholder="Rate per km" className="border p-2 rounded" onChange={handleChange} />
      </div>

      <button onClick={handleGenerate} className="mt-6 bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-2 rounded font-semibold">
        Download Invoice
      </button>
    </div>
  );
}

