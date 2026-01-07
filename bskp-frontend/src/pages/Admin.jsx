import { useEffect, useState } from "react";

export default function Admin() {
  const [complaints, setComplaints] = useState([]);

  // Load complaints on mount
  useEffect(() => {
    const stored =
      JSON.parse(localStorage.getItem("complaints")) || [];
    setComplaints(stored);
  }, []);

  // Update complaint status
  const updateStatus = (id, newStatus) => {
    const updated = complaints.map((c) =>
      c.id === id ? { ...c, status: newStatus } : c
    );

    setComplaints(updated);
    localStorage.setItem("complaints", JSON.stringify(updated));
  };

  // Metrics
  const total = complaints.length;
  const resolved = complaints.filter(
    (c) => c.status === "Resolved"
  ).length;
  const pending = complaints.filter(
    (c) => c.status !== "Resolved"
  ).length;

  return (
    <div className="min-h-screen pb-24 bg-gray-100 px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">
        Admin Dashboard
      </h1>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="font-semibold">Total Complaints</h2>
          <p className="text-3xl mt-2">{total}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="font-semibold">Pending</h2>
          <p className="text-3xl mt-2 text-yellow-600">
            {pending}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="font-semibold">Resolved</h2>
          <p className="text-3xl mt-2 text-green-600">
            {resolved}
          </p>
        </div>
      </div>

      {/* Complaint List */}
      <div className="mt-10 bg-white p-6 rounded-xl shadow">
        <h2 className="font-semibold mb-4">
          Complaint Management
        </h2>

        {complaints.length === 0 ? (
          <p className="text-gray-500">
            No complaints registered yet.
          </p>
        ) : (
          <ul className="space-y-4">
            {complaints.map((c) => (
              <li
                key={c.id}
                className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
              >
                <div>
                  <p className="font-semibold">
                    {c.problem}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(
                      c.timestamp
                    ).toLocaleString()}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium
                      ${
                        c.status === "Resolved"
                          ? "bg-green-100 text-green-700"
                          : c.status === "In Progress"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-yellow-100 text-yellow-700"
                      }
                    `}
                  >
                    {c.status}
                  </span>

                  <select
                    value={c.status}
                    onChange={(e) =>
                      updateStatus(c.id, e.target.value)
                    }
                    className="border px-2 py-1 rounded-md"
                  >
                    <option>Pending</option>
                    <option>In Progress</option>
                    <option>Resolved</option>
                  </select>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}