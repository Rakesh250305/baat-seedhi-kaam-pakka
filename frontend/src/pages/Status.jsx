import { useState } from "react";
import axios from "axios";

export default function Status() {
  const [complaintId, setComplaintId] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchStatus = async () => {
    if (!complaintId.trim()) return;

    try {
      setLoading(true);
      setError("");
      setData(null);

      const res = await axios.get(`${import.meta.env.VITE_API_URL}/public/${complaintId}`);
      setData(res.data.data);
    } catch (err) {
      setError("Complaint not found");
    } finally {
      setLoading(false);
    }
  };

  const statusColors = {
    Pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
    "In Progress": "bg-blue-100 text-blue-800 border-blue-300",
    Resolved: "bg-green-100 text-green-800 border-green-300"
  };

  const statusSteps = ["Pending", "In Progress", "Resolved"];

  return (
    <div className="min-h-screen h-[105vh] bg-gray-100 p-6 pt-10">
      <h1 className="text-2xl font-bold mb-5">Track Complaint Status</h1>

      <div className="flex gap-3 mb-4">
        <input
          type="text"
          placeholder="Enter Complaint ID (ELEC-000009)"
          value={complaintId}
          onChange={(e) => setComplaintId(e.target.value)}
          className="border px-4 py-2 rounded w-full"
        />

        <button
          onClick={fetchStatus}
          className="bg-blue-600 text-white px-5 py-2 rounded"
        >
          Check
        </button>
      </div>

      {loading && <p>Checking...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {data && (
        <div className="bg-white rounded-xl p-5 shadow space-y-4">
          <p><b>ID:</b> {data.complaintId}</p>
          <p><b>Category:</b> {data.category}</p>

          {/* Status Badge */}
          <p>
            <b>Status:</b>{" "}
            <span className={`px-3 py-1 rounded border ${statusColors[data.status]}`}>
              {data.status}
            </span>
          </p>

          <p><b>Registered:</b> {new Date(data.timestamp).toLocaleString()}</p>

          {/* Address */}
          {data.address && (
            <p><b>Address:</b> {data.address}</p>
          )}

          {/* Timeline */}
          <div className="mt-4">
            <b>Progress:</b>
            <div className="flex items-center mt-2">
              {statusSteps.map((step, i) => {
                const active = statusSteps.indexOf(data.status) >= i;
                return (
                  <div key={i} className="flex items-center">
                    <div
                      className={`w-4 h-4 rounded-full border ${
                        active ? "bg-blue-600 border-blue-600" : "bg-gray-300 border-gray-400"
                      }`}
                    ></div>
                    <span className="ml-2 mr-4 text-sm">{step}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* QA */}
          {data.qa?.length > 0 && (
            <div className="mt-4">
              <b>User Provided Details:</b>
              <ul className="list-disc ml-5">
                {data.qa.map((item, i) => (
                  <li key={i}>
                    <b>{item.question}</b>: {item.answer}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
