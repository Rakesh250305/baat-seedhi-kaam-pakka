import Complaint from "../models/Complaint.js";

export const getComplaints = async (req, res) => {
  try {
    const {status , category } = req.query;
    let query = {};

    if (status) {
      query.status = status;
    }
    if (category) {
      query.category = category;
    }
    const complaints = await Complaint.find(query).sort({ timestamp: -1 });

    const formatted = complaints.map(c => ({
      _id: c._id,
      complaintId: c.complaintId,
      category: c.category,
      status: c.status,
      timestamp: c.timestamp,
      qa: c.qa || [],
      location: c.location || null,
      photoPath: c.photoPath || null,
    }));

    res.json(formatted);
  } catch (err) {
    console.error("FETCH ERROR:", err);
    res.status(500).json({ success: false, message: "Unable to fetch complaints" });
  }
};


// export const updateComplaintStatus = async (req, res) => {
//   const { id } = req.params;
//   const { status, reason } = req.body;

//   const allowed = ["Pending", "In Progress", "Resolved"];

//   if (!allowed.includes(status)) {
//     return res.status(400).json({ error: "Invalid status" });
//   }

//   await Complaint.updateOne(
//     { _id: id },
//     { $set: { status } }
//   );

//   res.json({ success: true, status });
// };


export const updateComplaintStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reason } = req.body;

    const allowed = ["Pending", "In Progress", "Resolved"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    if (!reason || reason.trim() === "") {
      return res.status(400).json({ error: "Reason is required for status update" });
    }

    // Find the complaint
    const complaint = await Complaint.findById(id);
    if (!complaint) {
      return res.status(404).json({ error: "Complaint not found" });
    }

    // Update status and push to statusHistory
    complaint.status = status;
    complaint.statusHistory.push({
      status,
      reason,
      timestamp: new Date()
    });

    await complaint.save();

    res.json({ success: true, status, statusHistory: complaint.statusHistory });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

 export default {
  getComplaints,
  updateComplaintStatus,
};