import generateInvoice from "../utils/generateInvoice";

export default function Invoices() {
  const handleGenerate = () => {
    generateInvoice({
      customer: "John Doe",
      amount: 1200,
      date: new Date().toLocaleDateString(),
    });
  };

  return (
    <div className='p-6'>
      <h1 className='text-2xl font-bold mb-4'>Invoices</h1>
      <button onClick={handleGenerate} className='bg-green-500 text-white px-4 py-2 rounded'>
        Generate Sample Invoice
      </button>
    </div>
  );
}