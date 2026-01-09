import mongoose from "mongoose";

const ComplaintSchema = new mongoose.Schema({
  complaintId: { type: String, required: true },
  category: String,
  qa: [
    {
      question: String,
      answer: String
    }
  ],
  location: {
    lat: Number,
    lng: Number,
    address: String,
  },
  status: {
    type: String,
    default: "Pending"
  },
    photoPath: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

export default mongoose.model("Complaint", ComplaintSchema, "complaints");
