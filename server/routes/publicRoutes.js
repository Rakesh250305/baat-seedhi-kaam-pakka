import express from "express";
import multer from "multer";
import {
    //  createComplaint, 
    getcomplaintbyId, registerWithPhoto } from "../controllers/publicController.js";

const router = express.Router();

// ----- MULTER SETUP -----
const upload = multer({ storage: multer.memoryStorage() });
// ------------------------

// router.post("/register", createComplaint);
router.get("/:complaintId", getcomplaintbyId);
router.post("/register-with-photo", upload.single("photo"), registerWithPhoto);

export default router;
