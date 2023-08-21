const express = require("express");
const { verifyToken } = require("../middlewares/verifyToken");
const {
  markAttendance,
  getAttendanceById,
} = require("../controllers/attendenceControllers");

const router = express.Router();

router.post("/:id", verifyToken, markAttendance);
router.get("/:studentId/attendances", verifyToken, getAttendanceById);
module.exports = router;
