const express = require("express");
const router = express.Router();

// ✅ Auth routes
router.post("/login" /* studentController.login */); // ✅
router.post("/register" /* studentController.register */);
router.post("/verify-otp" /* studentController.verifyOtp */); // if OTP flow is used
router.post("/forgot-password" /* studentController.forgotPassword */);
router.post("/reset-password" /* studentController.resetPassword */);

// ✅ Profile
router.get("/profile/:studentId" /* studentController.getProfile */); // ✅
router.put("/profile/:studentId" /* studentController.updateProfile */); // ✅

// ✅ Courses & Content
router.get("/courses" /* studentController.getAllCourses */);
router.get("/courses/:courseId" /* studentController.getCourseDetails */);
router.get("/courses/:courseId/videos" /* studentController.getCourseVideos */); // ✅
router.get("/courses/:courseId/notes" /* studentController.getCourseNotes */); // ✅

// ✅ Class Notes
router.get("/notes/download/:noteId" /* studentController.downloadNote */);

// ✅ Live Classes
router.get("/live-classes" /* studentController.getLiveClasses */); // ✅
router.get("/live-classes/:roomId" /* studentController.getLiveClassDetails */);
router.get("/join/:roomName" /* studentController.joinMeeting */);

// ✅ Recorded Videos
router.get("/videos/:videoId/stream" /* studentController.streamVideo */);

// ✅ Doubts & Feedback
router.post("/submit-doubt" /* studentController.submitDoubt */);
router.get("/doubts/:studentId" /* studentController.getStudentDoubts */);
router.post("/submit-feedback" /* studentController.submitFeedback */);

// ✅ Meeting History
router.get(
  "/meeting-history/:studentId" /* studentController.getMeetingHistory */
);

// ✅ Notifications (if applicable)
router.get(
  "/notifications/:studentId" /* studentController.getNotifications */
);
router.put(
  "/notifications/:notificationId/read" /* studentController.markNotificationRead */
);

module.exports = router;
