const express = require("express");
const {
  addTeacher,
  deleteTeacher,
} = require("../controllers/teacherControllers");
const { verifyToken } = require("../middlewares/verifyToken");

const router = express.Router();

router.post("/:id/add-teacher", verifyToken, addTeacher);

router.delete(
  "/:studentId/delete-teacher/:teacherId",
  verifyToken,
  deleteTeacher
);
module.exports = router;
