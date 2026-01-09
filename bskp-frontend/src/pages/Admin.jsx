import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const token = localStorage.getItem("adminToken");

const API = "http://localhost:5001/admin";

export default function Admin() {
  const [complaints, setComplaints] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/admin-login");
    }
  }, []);

  // Fetch complaints
  const fetchComplaints = async () => {
    try {
      setLoading(true);

      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (categoryFilter) params.category = categoryFilter;

      const token = localStorage.getItem("adminToken");

      const res = await axios.get(`${API}/complaints`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params,
      });

      console.log("Complaints API response:", res.data);

      // setComplaints(res.data);
      setComplaints(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to fetch complaints", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [statusFilter, categoryFilter]);

  // Update status
  const updateStatus = async (id, status) => {
    try {
      await axios.patch(`${API}/complaints/${id}/status`, { status });
      fetchComplaints(); // refresh
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10 pb-24">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <select
          className="px-4 py-2 rounded-lg border"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="registered">Registered</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>

        <select
          className="px-4 py-2 rounded-lg border"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="Sadak Ki Samasya">Road</option>
          <option value="Bijli Ki Samasya">Electricity</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-200 text-sm">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center py-6">
                  Loading...
                </td>
              </tr>
            ) : complaints.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">
                  No complaints found
                </td>
              </tr>
            ) : (
              complaints.map((c) => (
                <tr key={c._id} className="border-t">
                  <td className="px-4 py-3 font-mono text-sm">
                    {c._id.slice(-6)}
                  </td>
                  <td className="px-4 py-3">{c.category}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={c.status} />
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {new Date(c.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      className="border rounded px-2 py-1"
                      value={c.status}
                      onChange={(e) =>
                        updateStatus(c._id, e.target.value)
                      }
                    >
                      <option value="registered">Registered</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* UI helpers */
const StatusBadge = ({ status }) => {
  const map = {
    registered: "bg-yellow-100 text-yellow-800",
    in_progress: "bg-blue-100 text-blue-800",
    resolved: "bg-green-100 text-green-800",
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm ${map[status]}`}>
      {status.replace("_", " ")}
    </span>
  );
};