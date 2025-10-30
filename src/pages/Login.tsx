import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../utils/firebase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: any) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.location.href = "/dashboard";
    } catch (err) {
      alert("Invalid login credentials");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl shadow-md w-80">
        <h2 className="text-xl font-semibold mb-4 text-center">Admin Login</h2>
        <input type="email" placeholder="Email" className="w-full border p-2 mb-3" value={email} onChange={(e)=>setEmail(e.target.value)} />
        <input type="password" placeholder="Password" className="w-full border p-2 mb-3" value={password} onChange={(e)=>setPassword(e.target.value)} />
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">Login</button>
      </form>
    </div>
  );
}