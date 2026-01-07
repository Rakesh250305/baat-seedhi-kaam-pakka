import express from "express";
import Complaint from "../models/Complaint.js";
 
const router = express.Router();
 
// Get all complaints (with filters)
router.get("/complaints", async (req, res) => {
  const { status, category } = req.query;
 
  const filter = {};
  if (status) filter.status = status;
  if (category) filter.category = category;
 
  const complaints = await Complaint.find(filter).sort({ createdAt: -1 });
  res.json(complaints);
});
 
// Get single complaint
router.get("/complaints/:id", async (req, res) => {
  const complaint = await Complaint.findById(req.params.id);
  res.json(complaint);
});
 
// Update complaint status
router.patch("/complaints/:id/status", async (req, res) => {
  const { status } = req.body;
 
  const updated = await Complaint.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );
 
  res.json(updated);
});
 
export default router;