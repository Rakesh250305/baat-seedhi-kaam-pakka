import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

function adminLogin(req, res) {
  const { email, password } = req.body;

  // Hardcoded credentials
  if (
    email !== process.env.ADMIN_EMAIL ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { role: "admin" },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({
    message: "Login successful",
    token,
  });
};

export { adminLogin };