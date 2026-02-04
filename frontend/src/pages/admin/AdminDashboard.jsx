import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import indianEmblem from "../../assets/images/IndianEmblem.svg";
import indianEmblemWhite from "../../assets/images/IndiaEmblemWhite.svg";
import { useTheme } from "../../context/ThemeContext";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
  });
  const [loading, setLoading] = useState(false);
  const { dark } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) navigate("/admin-login");
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/admin/complaints`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const complaints = res.data;

      setStats({
        total: complaints.length,
        pending: complaints.filter(c => c.status === "Pending").length,
        inProgress: complaints.filter(c => c.status === "In Progress").length,
        resolved: complaints.filter(c => c.status === "Resolved").length,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const cardData = [
    { label: "Total Complaints", value: stats.total, color: "bg-teal-700" },
    { label: "Pending", value: stats.pending, color: "bg-teal-700" },
    { label: "In Progress", value: stats.inProgress, color: "bg-teal-800" },
    { label: "Resolved", value: stats.resolved, color: "bg-teal-900" },
  ];

  return (
    <div className={`${dark ? "bg-gray-900 text-gray-100" : "bg-[#F7F9FC] text-teal-700"} min-h-screen flex flex-col items-center px-6 py-10 transition-colors duration-500`}>      {/* Hero / Emblem */}
      <div className="flex flex-col items-center text-center mb-6">
        <img src={dark ? indianEmblemWhite : indianEmblem} alt="Emblem" className="w-16 mb-4" />
        <h1 className={`${dark ? "text-teal-300" : "text-teal-900"} text-3xl font-bold mb-2`}>
          Admin Dashboard
        </h1>
        <p className={`${dark ? "text-teal-200" : "text-teal-700"} text-sm max-w-md`}>
          सभी शिकायतों का अवलोकन और प्रबंधन
        </p>
      </div>

      {/* Stats Cards */}
      <div className="w-full max-w-md grid grid-cols-2 gap-4 mb-6">
        {cardData.map((card, idx) => (
          <div key={idx} className={`${dark ? "bg-gray-800" : "bg-white"} border border-gray-200 p-4 rounded-xl flex flex-col items-center`}>
            <p className="text-xl font-bold">{card.value}</p>
            <p className="mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Horizontal Bars */}
      <div className="w-full max-w-md space-y-4 mb-6">
        {cardData.slice(1).map((bar, idx) => (
          <div key={idx}>
            <div className={`${dark ? "text-teal-400" : "text-teal-900"} flex justify-between mb-1 text-sm font-medium`}>
              <span>{bar.label}</span>
              <span>{bar.value}</span>
            </div>
            <div className={`${dark ? "bg-gray-300" : "bg-gray-200"}  w-full h-4 rounded`}>
              <div
                className={`${bar.color} h-4 rounded`}
                style={{ width: `${(bar.value / Math.max(stats.total, 1)) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigate Button */}
      <button
        onClick={() => navigate("/complaintlist")}
        className={`${dark ? "bg-teal-600 hover:bg-teal-500 text-gray-900" : "bg-teal-700 hover:bg-teal-800 text-white"} w-full max-w-md py-3 rounded-2xl font-semibold transition`}
      >
        View Complaint List
      </button>

      <p className="text-xs text-center mt-6 text-gray-500">
        नागरिक सेवा के लिए 🇮🇳
      </p>
    </div>
  );
}
