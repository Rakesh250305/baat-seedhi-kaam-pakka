import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useTheme } from "../../context/ThemeContext";

export default function ComplaintList() {
  const [complaints, setComplaints] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [selected, setSelected] = useState(null);
  const [statusModal, setStatusModal] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { dark } = useTheme();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) navigate("/admin-login");
    fetchComplaints();
  }, [statusFilter, categoryFilter]);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/admin/complaints`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { status: statusFilter, category: categoryFilter },
      });

      const normalized = res.data.map((c) => ({
        ...c,
        status: c.status || "Pending",
        createdAt: c.timestamp || c.createdAt || new Date(),
      }));

      setComplaints(normalized);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status, reason) => {
    try {
      const token = localStorage.getItem("adminToken");
      await axios.put(
        `${import.meta.env.VITE_API_URL}/admin/complaints/${id}/status`,
        { status, reason, },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchComplaints();
      setStatusModal(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={`${dark ? "bg-gray-900 text-teal-500" : "bg-gray-100 text-teal-700"} min-h-screen flex flex-col items-center px-6 py-10`}>

      {/* Hero */}
      <div className="flex flex-col items-center text-center mb-6">
        <h1 className="text-3xl font-bold mb-2">Complaint List</h1>
        <p className={`${dark ? "text-teal-200" : "text-teal-700"} text-sm max-w-md`}>
          सभी शिकायतों की सूची और उनके विवरण
        </p>
      </div>

      {/* Filters */}
      <div className="w-full max-w-4xl flex gap-4 mb-6">
        <select
          className="px-4 py-2 text-sm w-[50%] rounded-lg border focus:outline-none focus:ring-2 focus:ring-teal-500"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option className="bg-teal-500 text-gray-100" value="">All Status</option>
          <option className="bg-teal-500 text-gray-100" value="Pending">Pending</option>
          <option className="bg-teal-500 text-gray-100" value="In Progress">In Progress</option>
          <option className="bg-teal-500 text-gray-100" value="Resolved">Resolved</option>
        </select>

        <select
          className="px-4 py-2 rounded-lg border focus:outline-none text-sm w-[50%] focus:ring-2 focus:ring-teal-500"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option className="bg-teal-500 text-gray-100" value="">All Categories</option>
          <option className="bg-teal-500 text-gray-100" value="Electricity">Electricity</option>
          <option className="bg-teal-500 text-gray-100" value="Road">Road</option>
        </select>
      </div>

      {/* Table */}
      <div className={`${dark ? "bg-gray-900 text-gray-100 border-teal-500" : "bg-gray-100 text-teal-700"} border-2 w-full max-w-4xl  rounded-xl shadow overflow-x-auto`}>
        <table className="w-full text-left">
          <thead className="bg-teal-100 text-teal-900">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Complaint ID</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Address</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center py-6 text-teal-700">
                  Loading complaints...
                </td>
              </tr>
            ) : complaints.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">
                  No complaints found
                </td>
              </tr>
            ) : (
              complaints.map((c,i) => (
                <tr key={c._id} className="border-t">
                  <td className="px-4 py-3">{i + 1}</td>
                  <td className="px-4 py-3 font-mono text-sm">{c.complaintId}</td>
                  <td className="px-4 py-3">{c.category}</td>
                  <td className="px-4 py-3">{c.location?.address || "—"}</td>
                  <td className="px-4 py-3">
                    <StatusPill status={c.status} />
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    <button
                      className="px-3 py-1 bg-teal-700 text-white rounded hover:bg-teal-800"
                      onClick={() => setSelected(c)}
                    >
                      View
                    </button>

                    <button
                      className={`${dark ? "text-white" : "text-teal-700"} px-3 py-1 border border-teal-700 rounded hover:bg-teal-100`}
                      onClick={() => setStatusModal(c)}
                    >
                      Update Status
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selected && <DetailsModal selected={selected} onClose={() => setSelected(null)} theme={dark} />}
      {statusModal && <StatusModal data={statusModal} onClose={() => setStatusModal(null)} updateStatus={updateStatus} theme={dark} />}
    </div>
  );
}

// Status pill
const StatusPill = ({ status }) => {
  const normalized = status.toLowerCase();
  const colors = {
    pending: "bg-yellow-100 text-yellow-800",
    "in progress": "bg-blue-100 text-blue-800",
    resolved: "bg-green-100 text-green-800",
  };
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-sm capitalize ${colors[normalized]}`}>
      {status}
    </span>
  );
};

// Complaint Details Modal
const DetailsModal = ({ selected, onClose, theme }) => {
  const statusSteps = ["pending", "in progress", "resolved"];
  const currentIndex = statusSteps.indexOf(selected.status.toLowerCase());

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-2">
      <div className={`${theme ? "bg-gray-800 text-gray-300" : "bg-white"} rounded-xl p-6 shadow-lg w-xl max-h-[85vh] overflow-auto`}>
        <h2 className={`${theme ? "text-teal-400" : "text-teal-700"} text-2xl font-bold mb-4`}>Complaint Details</h2>

        <p><b className={`${theme ? "text-teal-400" : "text-teal-700"}`}>ID:</b> {selected.complaintId}</p>
        <p><b className={`${theme ? "text-teal-400" : "text-teal-700"}`}>Category:</b> {selected.category}</p>

        {/* Status timeline */}
        <div className="mt-4">
          <p className={`${theme ? "text-teal-300":"text-teal-900"} font-semibold mb-2 `}>Status Progress</p>
          <div className="space-y-4">
            {statusSteps.map((step, idx) => {
              const active = idx <= currentIndex;
              return (
                <div key={idx} className="flex items-start gap-3">
                  <div
                    className={`w-4 h-4 rounded-full border flex-shrink-0 ${
                      active ? "bg-teal-600 border-teal-600" : "bg-white border-gray-300"
                    }`}
                  ></div>
                  {theme ? (
                    <p className={`text-sm ${active ? "text-teal-500 font-medium" : "text-gray-400"}`}>
                    {step === "pending" && "शिकायत दर्ज हुई"}
                    {step === "in progress" && "काम जारी है"}
                    {step === "resolved" && "समस्या हल हो गई"}
                  </p>
                  ):(
                    <p className={`text-sm ${active ? "text-teal-800 font-medium" : "text-gray-500"}`}>
                    {step === "pending" && "शिकायत दर्ज हुई"}
                    {step === "in progress" && "काम जारी है"}
                    {step === "resolved" && "समस्या हल हो गई"}
                  </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {selected.location && (
          <p className="mt-3">
            <b className={`${theme ? "text-teal-400" : "text-teal-700"}`}>Address:</b> {selected.location.address || "—"}{" "} <br />  
            <a
              href={`https://maps.google.com/?q=${selected.location.lat},${selected.location.lng}`}
              target="_blank"
              className="text-blue-600 underline"
            >
              View on Map
            </a>
          </p>
        )}

        {selected.photoPath && (
          <div className="mt-4">
            <b>Photo:</b>
            <div className="mt-2">
              <img src={selected.photoPath} alt="Complaint" className="w-full h-auto max-h-64 object-cover rounded border" />
            </div>
          </div>
        )}

        <button
          className="bg-teal-700 text-white mt-5 w-full py-2 rounded-2xl font-semibold hover:bg-teal-800 transition"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

// Status Update Modal
const StatusModal = ({ data, onClose, updateStatus, theme }) => {
  const [newStatus, setNewStatus] = useState(data.status);
  const [reason, setReason] = useState("");
  const [otherReason, setOtherReason] = useState("");

   const reasonOptions = {
    "Pending": ["Complaint Registered"],
    "In Progress": ["Assigned to department", "Under Review", "Investigation started", "other"],
    "Resolved": ["Fixed/Solved", "Issue Closed", "Action Taken", "other"],
  };

  const handleUpdate = () => {
    if (!reason) return alert("Please select a reason");

    // Send status + reason to backend
    updateStatus(
      data._id,
      newStatus, 
      reason === "other" ? otherReason : reason
    );
  };

  return (
    <div className="fixed inset-0 bg-black/40 px-5 flex items-center justify-center z-50">
      <div className={`${theme ? "bg-gray-800" : "bg-white" } rounded-xl p-6 shadow-lg `}>
        <h2 className={`${theme ? "text-teal-500": "text-teal-700"} text-xl font-bold mb-4`}>Update Status</h2>
        <p className={`${theme ? "text-teal-500" : "text-teal-700"} mb-3`}><b>Complaint ID:</b> {data.complaintId}</p>

        <select
          value={newStatus}
          onChange={(e) =>{ 
            setNewStatus(e.target.value)
            setReason("");
            setOtherReason("");
        }}
          className={`${theme ? "text-teal-500":"text-teal-700"} w-[85vw] border px-4 py-2 rounded mb-4`}
          disabled={data.status === "Resolved"}
        >
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
        </select>

        
        {/* Reason dropdown */}
        <select
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-full border px-4 py-2 rounded mb-4"
        >
          <option value="">Select Reason</option>
          {reasonOptions[newStatus].map((r, i) => (
            <option key={i} value={r}>{r}</option>
          ))}
        </select>

        {/* Other reason input */}
        {reason === "Other" && (
          <input
            type="text"
            value={otherReason}
            onChange={(e) => setOtherReason(e.target.value)}
            placeholder="Enter reason"
            className="w-full border px-4 py-2 rounded mb-4"
          />
        )}

        <button
          className="bg-teal-700 text-white w-full py-2 rounded-2xl font-semibold hover:bg-teal-800 transition mb-2"
          onClick={handleUpdate}
        >
          Update
        </button>

        <button
          className="w-full py-2 border border-teal-700 rounded-2xl font-semibold hover:bg-teal-100 transition"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
