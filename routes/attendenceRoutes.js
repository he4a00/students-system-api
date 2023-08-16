const express = require("express");
const { verifyToken } = require("../middlewares/verifyToken");
const { markAttendance } = require("../controllers/attendenceControllers");

const router = express.Router();

router.post("/:id", verifyToken, markAttendance);
module.exports = router;
