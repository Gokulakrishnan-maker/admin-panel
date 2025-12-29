import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Invoices from "./pages/Invoices";
import Rides from "./pages/Rides";
import Layout from "./components/Layout";
import { AuthProvider } from "./context/AuthContext";
import Rates from "./pages/Rates";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/invoices" element={<Invoices />} />
            <Route path="/rides" element={<Rides />} />
            <Route path="/rates" element={<Rates />} />
            </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
