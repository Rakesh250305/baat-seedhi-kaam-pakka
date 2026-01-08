const express = require("express");
const adminAuth = require("../middleware/adminAuthMiddleware");
const { adminLogin } = require("../controllers/adminAuthController");
// const { getComplaints } = require("../controllers/complaintsController");

const router = express.Router();

// LOGIN
router.post("/login", adminLogin);

// PROTECTED
// router.get("/complaints", adminAuth, getComplaints);
router.get("/protected", adminAuth);

module.exports = router;
