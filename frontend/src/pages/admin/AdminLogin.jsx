import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import indianEmblem from "../../assets/images/IndianEmblem.svg";
import indianEmblemWhite from "../../assets/images/IndiaEmblemWhite.svg";
import { useTheme } from "../../context/ThemeContext";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const {dark} = useTheme();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/admin/login`, {
        email,
        password,
      });

      localStorage.setItem("adminToken", res.data.token);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.log(err);
      setError("Invalid admin credentials");
    }
  };

  return (
    <div className={`${dark ? "bg-gray-900 text-gray-100" : "bg-[#F7F9FC] text-teal-700"} dark:bg-gray-900 dark:text-gray-100 min-h-screen flex flex-col items-center justify-center px-6 transition-colors duration-500`}>

      {/* Hero / Emblem */}
      <div className="flex flex-col items-center text-center mb-6">
        <img src={dark ? indianEmblemWhite : indianEmblem} alt="Emblem" className="w-16 mb-4" />
        <h1 className={`${dark ? "text-teal-300" : "text-teal-900"} dark:text-teal-300 text-3xl font-bold mb-2`}>
          Admin Login
        </h1>
        <p className={`${dark ? "text-teal-200" : "text-teal-700"} dark:text-teal-200 text-sm max-w-md`}>
          केवल अधिकृत प्रशासक लॉगिन कर सकते हैं
        </p>
      </div>

      {/* Login Form */}
      <form
        onSubmit={handleLogin}
        className={`${dark ? "bg-gray-800" : "bg-white"} dark:bg-gray-800 p-6 rounded-xl shadow-md w-full max-w-md transition-colors duration-500`}
      >
        {error && <p className="text-red-500 mb-3">{error}</p>}

        <input
          type="email"
          placeholder="Admin Email"
          className="w-full mb-4 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-teal-700"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-teal-700"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className={`${dark ? "bg-teal-600 hover:bg-teal-500 text-gray-900" : "bg-teal-700 hover:bg-teal-800 text-white"} dark:bg-teal-600 dark:hover:bg-teal-500 dark:text-gray-900 w-full py-3 rounded-2xl font-semibold shadow-md transition`}
        >
          Login
        </button>
      </form>

    
    </div>
  );
}
