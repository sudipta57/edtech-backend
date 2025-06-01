import axios from "axios";
import crypto from "crypto";
import fs from "fs";
import LiveClass from "../../models/Liveclass.js";
import Pdf from "../../models/pdf.js";
import Video from "../../models/Video.js";

// export const uploadVideo = async (req, res) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ errors: errors.array() });
//   }

//   const { title, description, course, liveClassId } = req.body;
//   const file = req.file;

//   if (!file) {
//     return res.status(400).json({ error: "No video file uploaded." });
//   }

//   try {
//     // Step 1: Create video entry
//     const createResp = await axios.post(
//       `https://video.bunnycdn.com/library/${process.env.LIBRARY_ID}/videos`,
//       { title },
//       {
//         headers: {
//           AccessKey: process.env.BUNNY_API_KEY,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     const guid = createResp.data.guid;
//     const socketId = req.body.socketId;
//     // Step 2: Generate AuthorizationSignature
//     const expire = Math.floor(Date.now() / 1000) + 3600;
//     const stringToHash = `${process.env.LIBRARY_ID}${process.env.BUNNY_API_KEY}${expire}${guid}`;
//     const signature = crypto
//       .createHash("sha256")
//       .update(stringToHash)
//       .digest("hex");

//     // Save file temporarily
//     const tempPath = file.path;
//     const fileSize = fs.statSync(tempPath).size;
//     // Step 3: TUS upload
//     const upload = new tus.Upload(fs.createReadStream(tempPath), {
//       endpoint: "https://video.bunnycdn.com/tusupload",
//       uploadSize: fileSize,
//       retryDelays: [0, 3000, 5000, 10000],
//       metadata: {
//         filetype: file.mimetype,
//         title,
//       },
//       headers: {
//         AuthorizationSignature: signature,
//         AuthorizationExpire: expire,
//         VideoId: guid,
//         LibraryId: process.env.LIBRARY_ID,
//       },
//       onError: (error) => {
//         console.error("TUS upload error:", error);
//         return res.status(500).json({ error: "Upload failed" });
//       },
//       onProgress: (bytesUploaded, bytesTotal) => {
//         const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
//         if (socketId && io.sockets.sockets.get(socketId)) {
//           io.to(socketId).emit("uploadProgress", { percentage });
//         }
//         console.log(`Upload progress: ${percentage}%`);
//       },
//       onSuccess: async () => {
//         const hlsUrl = `https://vz-${process.env.HLSCODE}.b-cdn.net/${guid}/playlist.m3u8`;
//         const thumbnailUrl = `https://vz-${process.env.HLSCODE}.b-cdn.net/${guid}/thumbnail.jpg`;

//         const video = new Video({
//           title,
//           description,
//           course,
//           bunnyGuid: guid,
//           videoUrl: hlsUrl,
//           thumbnailUrl,
//         });
//         await video.save();

//         if (liveClassId) {
//           await LiveClass.findByIdAndUpdate(liveClassId, {
//             videoId: video._id,
//           });
//         }

//         fs.unlinkSync(tempPath);

//         res
//           .status(201)
//           .json({ message: "Video uploaded and saved successfully" });
//       },
//     });

//     upload.start();
//   } catch (err) {
//     console.error("Upload error:", err.response?.data || err.message);
//     res.status(500).json({ error: "Upload failed" });
//   }
// };
export const getPresignedUpload = async (req, res) => {
  const { title } = req.body;
  try {
    // Create Bunny video entry
    const createResp = await axios.post(
      `https://video.bunnycdn.com/library/${process.env.LIBRARY_ID}/videos`,
      { title },
      {
        headers: {
          AccessKey: process.env.BUNNY_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );
    const guid = createResp.data.guid;
    const expire = Math.floor(Date.now() / 1000) + 3600;
    const stringToHash = `${process.env.LIBRARY_ID}${process.env.BUNNY_API_KEY}${expire}${guid}`;
    const signature = crypto
      .createHash("sha256")
      .update(stringToHash)
      .digest("hex");

    res.json({
      guid,
      expire,
      signature,
      libraryId: process.env.LIBRARY_ID,
    });
  } catch (err) {
    console.error("Presign error:", err.message);
    res.status(500).json({ error: "Failed to generate presigned upload" });
  }
};

export const saveUploadedVideo = async (req, res) => {
  const { title, description, course, liveClassId, guid, length } = req.body;

  if (!title || !guid || !course) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  try {
    const hlsUrl = `https://vz-${process.env.HLSCODE}.b-cdn.net/${guid}/playlist.m3u8`;
    const thumbnailUrl = `https://vz-${process.env.HLSCODE}.b-cdn.net/${guid}/thumbnail.jpg`;

    const video = new Video({
      title,
      description,
      course,
      bunnyGuid: guid,
      videoUrl: hlsUrl,
      thumbnailUrl,
      length,
    });

    await video.save();

    if (liveClassId) {
      await LiveClass.findByIdAndUpdate(liveClassId, {
        videoId: video._id,
      });
    }

    res.status(201).json({ message: "Video saved successfully", video });
  } catch (err) {
    console.error("Error saving video:", err.message);
    res.status(500).json({ error: "Server error saving video" });
  }
};

export const getVideoStatus = async (req, res) => {
  const { guid } = req.params;
  const status = await axios.get(
    `https://video.bunnycdn.com/library/${process.env.LIBRARY_ID}/videos/${guid}`,
    { headers: { AccessKey: process.env.BUNNY_API_KEY } }
  );
  res.status(200).json(status.data);
};

export const getVideosByFilters = async (req, res) => {
  try {
    const { courseId, title, date } = req.query;
    console.log(courseId, title, date);

    // Validate that courseId is provided
    if (!courseId) {
      return res.status(400).json({ error: "courseId is required" });
    }

    // Build the filter object dynamically
    const filter = {
      course: courseId,
    };

    if (title) {
      // Case-insensitive partial match for title
      filter.title = { $regex: title, $options: "i" };
    }

    if (date) {
      const targetDate = new Date(date);
      const nextDay = new Date(targetDate);
      nextDay.setDate(nextDay.getDate() + 1);

      filter.createdAt = {
        $gte: targetDate,
        $lt: nextDay,
      };
    }
    // pdf upload against a video
    const videos = await Video.find(filter)
      .select("-bunnyGuid -updatedAt -createdAt -__v")
      .populate("course", "title")
      .sort({ createdAt: -1 });

    res.status(200).json(videos);
  } catch (err) {
    console.error("Error fetching videos:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const updateVideo = async (req, res) => {
  try {
    const { _id } = req.params;
    const { title, description, course } = req.body;
    // Check if PDFs were uploaded
    if (!req.files || !req.files.pdfs) {
      return res.status(400).json({ message: "No PDF file(s) uploaded" });
    }

    // Create PDF documents for each uploaded file
    const pdfPromises = req.files.pdfs.map(async (file) => {
      const pdf = new Pdf({
        pdfUrl: file.path, // Store the file path
        videoId: _id,
      });
      return await pdf.save();
    });

    // Wait for all PDFs to be saved
    const savedPdfs = await Promise.all(pdfPromises);
    const pdfIds = savedPdfs.map((pdf) => pdf._id);

    // Update video with new details and PDF references
    const video = await Video.findByIdAndUpdate(_id, {
      $set: { title, description, course },
      $push: { pdfs: { $each: pdfIds } }, // Add new PDFs to the existing array
    });

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    res.status(200).json({
      message: "Video updated successfully",
    });
  } catch (error) {
    console.error("Error updating video:", error);
    res.status(500).json({ message: "Failed to update video" });
  }
};

export const deleteVideo = async (req, res) => {
  try {
    const { _id } = req.params;

    // Find the video first to get the bunnyGuid
    const video = await Video.findById(_id);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    // Delete video from Bunny.net
    try {
      await axios.delete(
        `https://video.bunnycdn.com/library/${process.env.LIBRARY_ID}/videos/${video.bunnyGuid}`,
        {
          headers: {
            AccessKey: process.env.BUNNY_API_KEY,
          },
        }
      );
    } catch (bunnyError) {
      console.error("Error deleting from Bunny.net:", bunnyError);
      // Continue with database deletion even if Bunny.net deletion fails
    }

    // Delete associated PDFs
    if (video.pdfs && video.pdfs.length > 0) {
      // First get all PDFs to get their file paths
      const pdfs = await Pdf.find({ _id: { $in: video.pdfs } });

      // Delete PDF files from filesystem
      for (const pdf of pdfs) {
        try {
          const filePath = pdf.pdfUrl;
          console.log(filePath);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        } catch (fsError) {
          console.error(`Error deleting PDF file ${pdf.pdfUrl}:`, fsError);
          // Continue with other deletions even if one fails
        }
      }

      // Delete PDF records from database
      await Pdf.deleteMany({ _id: { $in: video.pdfs } });
    }

    // Delete the video from database
    await Video.findByIdAndDelete(_id);

    res.status(200).json({
      message: "Video and associated files deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting video:", error);
    res.status(500).json({ message: "Failed to delete video" });
  }
};
