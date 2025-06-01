import mongoose from "mongoose";

const liveClassSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },

  scheduledTime: {
    type: Date, // You can use ISO string or combine into Date
    required: true,
  },

  roomName: {
    type: String,
    required: true, // This will be the Jitsi/Zoom/Google Meet link
  },
  students: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Student",
  },
  videoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Video",
  },
  // instructor: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const LiveClass = mongoose.model("LiveClass", liveClassSchema);

export default LiveClass;
