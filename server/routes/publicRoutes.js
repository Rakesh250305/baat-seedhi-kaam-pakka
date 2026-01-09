import express from "express";
import multer from "multer";
import { createComplaint, getcomplaintbyId, registerWithPhoto } from "../controllers/publicController.js";

const router = express.Router();

// ----- MULTER SETUP -----
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads"); // ensure this folder exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });
// ------------------------

router.post("/register", createComplaint);
router.get("/:complaintId", getcomplaintbyId);
router.post("/register-with-photo", upload.single("photo"), registerWithPhoto);

export default router;
