import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import adminRoutes from './routes/adminRoutes.js';
import publicRoutes from './routes/publicRoutes.js';
import path from 'path';


dotenv.config();

const app = express();

// Serve uploads folder
app.use("/uploads", express.static(path.join(path.resolve(), "uploads")));

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

app.use("/admin", adminRoutes);
app.use("/public", publicRoutes);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Admin server is running" });
});

connectDB().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  });
});
