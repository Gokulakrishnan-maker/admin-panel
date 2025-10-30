import { Link, Outlet, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../utils/firebase";
import { useEffect, useState } from "react";

export default function Layout() {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUserEmail(user?.email || "Admin");
    });

    const updateClock = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleString());
    };

    updateClock();
    const timer = setInterval(updateClock, 1000);

    return () => {
      unsubscribe();
      clearInterval(timer);
    };
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-black text-white flex flex-col justify-between shadow-lg">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-yellow-400 mb-6">
            Fastride Admin
          </h2>

          <nav className="flex flex-col space-y-4">
            <Link
              to="/dashboard"
              className="hover:text-yellow-400 transition-colors"
            >
              Dashboard
            </Link>

            <Link
              to="/invoices"
              className="hover:text-yellow-400 transition-colors"
            >
              Invoices
            </Link>

            <Link
              to="/rides"
              className="hover:text-yellow-400 transition-colors"
            >
              Rides
            </Link>

            <Link
              to="/users"
              className="hover:text-yellow-400 transition-colors"
            >
              Users
            </Link>
          </nav>
        </div>

        {/* Logout */}
        <div className="p-6 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full bg-yellow-400 text-black py-2 rounded font-semibold hover:bg-yellow-500 transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Section */}
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <div className="flex justify-between items-center bg-yellow-400 text-black px-6 py-3 shadow-md">
          <h1 className="text-lg font-bold">🚖 Fastride Drop Taxi</h1>
          <div className="text-sm font-semibold">
            {userEmail} | {currentTime}
          </div>
        </div>

        {/* Page Content */}
        <div className="p-8 flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
