import mongoose from "mongoose";
 
const QA = new mongoose.Schema({
  key: String,
  question: String,
  answer: String,
  language: String,
  confidence: Number,
  audioPath: String,
});
 
const ComplaintSchema = new mongoose.Schema({
  category: String,
 
  conversation: {
    questions: [QA]
  },
 
  location: Object,
 
  source: {
    sttEngine: { type: String, default: "faster-whisper" }
  },
 
  status: {
  type: String,
  enum: ["registered", "in_progress", "resolved"],
  default: "registered"
},
 
 
  createdAt: {
    type: Date,
    default: Date.now
  }
});
 
export default mongoose.model("Complaint", ComplaintSchema);