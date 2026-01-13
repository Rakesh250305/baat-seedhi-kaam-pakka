import Complaint from "../models/Complaint.js";
import { put } from "@vercel/blob";

/** Generate unique complaint ID */
async function generateComplaintId(category) {
  const prefixMap = {
    road: "ROAD",
    electricity: "ELEC",
    water: "WATR",
  };

  const prefix = prefixMap[category?.toLowerCase()] || "GENR";

  // Get the last complaint of this category
  const last = await Complaint.find({ category })
    .sort({ _id: -1 }) // newest first
    .limit(1)
    .exec();

  let lastSerial = 0;
  if (last.length) {
    const parts = last[0].complaintId.split("-");
    lastSerial = parseInt(parts[1], 10) || 0;
  }

  const serial = lastSerial + 1;
  return `${prefix}-${String(serial).padStart(6, "0")}`;
}

/** Controller: Create complaint without photo */
// export const createComplaint = async (req, res) => {
//   try {
//     const payload = req.body;
//     const category = payload.category || "General";

//     const complaintId = await generateComplaintId(category);

//     const doc = {
//       complaintId,
//       category,
//       qa: payload.qa || [],
//       status: payload.status || "Pending",
//       timestamp: payload.timestamp || new Date().toISOString(),
//       location: payload.location || null,
//     };

//     const result = await Complaint.create(doc);

//     res.json({
//       success: true,
//       complaintId: result.complaintId,
//       status: result.status,
//       message: `Aapki complaint register ho gayi hai, ID: ${result.complaintId}`,
//     });
//   } catch (err) {
//     console.error("Create Complaint Error:", err);
//     res.status(500).json({ error: "Server error!" });
//   }
// };

/** Controller: Get complaint by ID */
export const getcomplaintbyId = async (req, res) => {
  try {
    const { complaintId } = req.params;
    const complaint = await Complaint.findOne({ complaintId });

    if (!complaint) {
      return res.status(404).json({ success: false, message: "Not found" });
    }

    res.json({
      success: true,
      data: {
        complaintId: complaint.complaintId,
        category: complaint.category,
        status: complaint.status,
        timestamp: complaint.timestamp,
        location: complaint.location,
        qa: complaint.qa || [],
        photoPath: complaint.photoPath || null,
      },
    });
  } catch (err) {
    console.error("Get Complaint Error:", err);
    res.status(500).json({ success: false, message: "Internal error" });
  }
};

/** Controller: Register complaint with photo */
export const registerWithPhoto = async (req, res) => {
  try {
    const photoFile = req.file; // multer file
    const data = JSON.parse(req.body.data || "{}"); // parse JSON string

    if(!photoFile){
      return res.status(400).json({ error: "Photo file is required" });
    }

    const category = data.category || "General";
    const complaintId = await generateComplaintId(category);

    let uploadUrl = null;
    if (photoFile){
      const blob = await put(
        `complaints/${Date.now()}-${photoFile.originalname}`,
        photoFile.buffer,
        {
          contentType: photoFile.mimetype,
          access : "public",
          token: process.env.BLOB_READ_WRITE_TOKEN,
        }
      );
      uploadUrl = blob.url;                                                             
        }
    const complaintDoc = {
      complaintId,
      category,
      qa: data.qa || [],
      timestamp: data.timestamp || new Date().toISOString(),
      location: data.location || null,
      photoPath: uploadUrl || null,
      status: data.status || "Pending",
    };

    const result = await Complaint.create(complaintDoc);

    res.status(200).json({
      success: true,
      complaintId: result.complaintId,
      photoPath: uploadUrl,
      data: result,
    });
  } catch (err) {
    console.error("Register With Photo Error:", err);
    res.status(500).json({ error: "Server Error", message: err.message });
  }
};

export default {
  // createComplaint,
  getcomplaintbyId,
  registerWithPhoto,
};
