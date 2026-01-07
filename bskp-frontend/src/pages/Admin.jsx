import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/admin";

export default function Admin() {
  const [complaints, setComplaints] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch complaints
  const fetchComplaints = async () => {
    try {
      setLoading(true);

      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (categoryFilter) params.category = categoryFilter;

      const res = await axios.get(`${API}/complaints`, { params });
      setComplaints(res.data);
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





// import { useState } from "react";
// import { mockComplaints } from "./mockComplaints";

// export default function Admin() {
//   const [complaints, setComplaints] = useState(mockComplaints);
//   const [selected, setSelected] = useState(null);

//   const updateStatus = (id, status) => {
//     setComplaints((prev) =>
//       prev.map((c) =>
//         c._id === id ? { ...c, status } : c
//       )
//     );
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 px-6 py-10 pb-24">
//       <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

//       {/* Table */}
//       <div className="bg-white rounded-xl shadow overflow-x-auto">
//         <table className="w-full text-left">
//           <thead className="bg-gray-200">
//             <tr>
//               <th className="px-4 py-3">ID</th>
//               <th className="px-4 py-3">Category</th>
//               <th className="px-4 py-3">Status</th>
//               <th className="px-4 py-3">Created</th>
//               <th className="px-4 py-3">Action</th>
//             </tr>
//           </thead>

//           <tbody>
//             {complaints.map((c) => (
//               <tr key={c._id} className="border-t">
//                 <td className="px-4 py-3 font-mono text-sm">
//                   {c._id.slice(-6)}
//                 </td>
//                 <td className="px-4 py-3">{c.category}</td>
//                 <td className="px-4 py-3">
//                   <StatusBadge status={c.status} />
//                 </td>
//                 <td className="px-4 py-3 text-sm">
//                   {new Date(c.createdAt).toLocaleString()}
//                 </td>
//                 <td className="px-4 py-3 flex gap-2">
//                   <select
//                     className="border rounded px-2 py-1"
//                     value={c.status}
//                     onChange={(e) =>
//                       updateStatus(c._id, e.target.value)
//                     }
//                   >
//                     <option value="registered">Registered</option>
//                     <option value="in_progress">In Progress</option>
//                     <option value="resolved">Resolved</option>
//                   </select>

//                   <button
//                     className="text-blue-600 underline"
//                     onClick={() => setSelected(c)}
//                   >
//                     View
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Detail Modal */}
//       {selected && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//           <div className="bg-white w-full max-w-lg rounded-xl p-6">
//             <h2 className="text-xl font-bold mb-2">
//               {selected.category}
//             </h2>

//             <p className="text-sm mb-2">
//               Status: <b>{selected.status}</b>
//             </p>

//             <p className="text-sm mb-4">
//               Location: {selected.location.city}
//             </p>

//             <div className="space-y-3">
//               {selected.conversation.questions.map((q) => (
//                 <div key={q.key} className="bg-gray-100 p-3 rounded">
//                   <p className="font-semibold">{q.question}</p>
//                   <p className="text-sm mt-1">{q.answer}</p>
//                   <p className="text-xs text-gray-500">
//                     Confidence: {(q.confidence * 100).toFixed(0)}%
//                   </p>
//                 </div>
//               ))}
//             </div>

//             <button
//               className="mt-6 w-full bg-gray-900 text-white py-2 rounded"
//               onClick={() => setSelected(null)}
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// /* Helpers */
// const StatusBadge = ({ status }) => {
//   const map = {
//     registered: "bg-yellow-100 text-yellow-800",
//     in_progress: "bg-blue-100 text-blue-800",
//     resolved: "bg-green-100 text-green-800",
//   };

//   return (
//     <span className={`px-3 py-1 rounded-full text-sm ${map[status]}`}>
//       {status.replace("_", " ")}
//     </span>
//   );
// };
