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


export const updateComplaintStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const allowed = ["Pending", "In Progress", "Resolved"];

  if (!allowed.includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  await Complaint.updateOne(
    { _id: id },
    { $set: { status } }
  );

  res.json({ success: true, status });
};

 export default {
  getComplaints,
  updateComplaintStatus,
};