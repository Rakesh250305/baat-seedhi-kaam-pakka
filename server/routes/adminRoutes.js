import express from "express";
import adminAuth from "../middleware/adminAuthMiddleware.js";
import { adminLogin } from "../controllers/adminAuthController.js";
import { getComplaints, updateComplaintStatus } from "../controllers/complaintController.js";

const router = express.Router();

router.post("/login", adminLogin);
router.get("/complaints", adminAuth, getComplaints);
router.put("/complaints/:id/status", adminAuth, updateComplaintStatus);

export default router;
