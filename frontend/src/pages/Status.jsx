import { useState } from "react";
import axios from "axios";

export default function Status() {
  const [complaintId, setComplaintId] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const statusSteps = ["pending", "in progress", "resolved"];

  const fetchStatus = async () => {
    if (!complaintId.trim()) return;

    try {
      setLoading(true);
      setError("");
      setData(null);

      const res = await axios.get(`${import.meta.env.VITE_API_URL}/public/${complaintId}`);
      setData(res.data.data);
      console.log(res.data.data);
    } catch (err) {
      setError("Complaint not found");
    } finally {
      setLoading(false);
    }
  };

  let activeIndex = -1;
  if (data?.status) {
    const normalized = data.status.trim().toLowerCase();
    activeIndex = statusSteps.indexOf(normalized);
  }
  

  return (
    <div className="min-h-screen bg-gray-100 p-6 pt-10 pb-20">
      <h1 className="text-2xl font-bold mb-5">अपनी शिकायत जाने</h1>

      <div className="flex gap-3 mb-4">
        <input
          type="text"
          placeholder="Complaint ID (ELEC-000009)"
          value={complaintId}
          onChange={(e) => setComplaintId(e.target.value)}
          className="border px-4 py-2 rounded w-full"
        />

        <button
          onClick={fetchStatus}
          className="bg-teal-700 text-white px-5 py-2 rounded"
        >
          चेक करें
        </button>
      </div>

      {loading && <p>चेक कर रहे है...</p>}
      {error && <p className="text-red-600">{error}</p>}

     {data && (
  <div className="min-h-screen bg-[#F3FAF7] py-5 space-y-5">

    {/* Header */}
    <h2 className="text-lg font-semibold text-[#145A32]">
      शिकायत की स्थिति
    </h2>

    {/* Info Card */}
    <div className="bg-white rounded-xl p-4 shadow border border-gray-100 space-y-2">
      <p className="text-xs text-gray-500">टिकट आईडी</p>
      <p className="font-semibold text-[#145A32]">#{data.complaintId}</p>

      <p className="text-sm flex items-center gap-1 text-gray-700">
        {data.category === "Electricity" ? "⚡ बिजली से जुड़ी समस्या" : "🛣️ सड़क से जुड़ी समस्या"}
      </p>

      <p className="text-xs text-gray-600">
        तारीख: {new Date(data.timestamp).toLocaleDateString("hi-IN", { day: "numeric", month: "long", year: "numeric" })}
      </p>

      {data.address && (
        <p className="text-sm text-gray-700">
          <b>पता:</b> {data.address}
        </p>
      )}
    </div>

    {/* Status Progress */}
    <div className="bg-white rounded-xl p-4 shadow border border-gray-100">
      <p className="font-semibold text-[#145A32] mb-3">स्थिति प्रगति</p>

      <div className="flex flex-col gap-3">
        {statusSteps.map((step, idx) => {
          const active = activeIndex >= idx;
          return (
            <div key={idx} className="flex items-start gap-3">
              <div className={`w-4 h-4 rounded-full border flex-shrink-0
                ${active ? "bg-teal-600 border-teal-600" : "bg-white border-gray-300"}`}
              ></div>
              <p className={`text-sm ${active ? "text-[#145A32] font-medium" : "text-gray-500"}`}>
                {step}
              </p>
            </div>
          );
        })}
      </div>
    </div>

    {/* Officer Notes */}
    {data.officerNote && (
      <div className="bg-white rounded-xl p-4 shadow border border-gray-100">
        <p className="font-semibold text-[#145A32] mb-1">अधिकारी टिप्पणी</p>
        <p className="text-sm text-gray-700">
          {data.officerNote}
        </p>
      </div>
    )}

    {/* QA Responses */}
    {data.qa?.length > 0 && (
      <div className="bg-white rounded-xl p-4 shadow border border-gray-100 space-y-2">
        <p className="font-semibold text-[#145A32]">यूजर जानकारी</p>
        <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
          {data.qa.map((item, i) => (
            <li key={i}>
              <b>{item.question}</b>: {item.answer}
            </li>
          ))}
        </ul>
      </div>
    )}

    {/* Footer */}
    <p className="text-center text-xs text-gray-500 mt-8">
      नागरिक सेवा के लिए 🇮🇳
    </p>
  </div>
)}

    </div>
  );
}
