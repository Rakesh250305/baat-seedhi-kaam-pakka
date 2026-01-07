import express from "express";
import Complaint from "../models/complaint.js";
// import { translateHindi } from "../utils/translate.js";
 
const router = express.Router();
 
router.post("/", async (req, res) => {
  try {
    const { category, conversation, location } = req.body;
 
    if (!conversation || !conversation.questions) {
      return res.status(400).json({ message: "Invalid conversation" });
    }
 
    const complaint = await Complaint.create({
      category,
      conversation,
      location
    });
 
    res.json({ success: true, complaint });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
 
export default router;