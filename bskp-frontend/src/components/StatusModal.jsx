export default function StatusModal({ onClose }) {
  const complaints =
    JSON.parse(localStorage.getItem("complaints")) || [];

  const lastComplaint = complaints[complaints.length - 1];

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl p-6 w-[90%] max-w-md">
        <h2 className="text-xl font-bold mb-4">
          Complaint Status
        </h2>

        {!lastComplaint ? (
          <p>No complaints found.</p>
        ) : (
          <div className="space-y-2">
            <p><strong>Problem:</strong> {lastComplaint.problem}</p>
            <p><strong>Status:</strong> {lastComplaint.status}</p>
            <p className="text-sm text-gray-500">
              {new Date(lastComplaint.timestamp).toLocaleString()}
            </p>
          </div>
        )}

        <button
          onClick={onClose}
          className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg"
        >
          Close
        </button>
      </div>
    </div>
  );
}
