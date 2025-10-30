import { Link, Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md p-4">
        <h2 className="text-xl font-bold mb-6 text-blue-600">Fastride Admin</h2>
        <nav className="flex flex-col space-y-3">
          <Link to="/dashboard" className="hover:text-blue-500">Dashboard</Link>
          <Link to="/invoices" className="hover:text-blue-500">Invoices</Link>
          <Link to="/users" className="hover:text-blue-500">Users</Link>
          <Link to="/logout" className="text-red-500 hover:text-red-600">Logout</Link>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 p-6">
        <Outlet /> {/* Renders the page (Dashboard, Invoice, etc.) */}
      </div>
    </div>
  );
}
