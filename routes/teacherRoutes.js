const express = require("express");
const {
  addTeacher,
  deleteTeacher,
  getTeachersForStudent,
  getStudentsForTeacher,
  getAllTeachers,
  addTeacherToStudent,
} = require("../controllers/teacherControllers");
const { verifyToken } = require("../middlewares/verifyToken");

const router = express.Router();

router.get("/", verifyToken, getAllTeachers);
router.post("/add-teacher", verifyToken, addTeacher);
router.post("/:id/add-teacher-student", verifyToken, addTeacherToStudent);
router.get("/:studentId/teachers", verifyToken, getTeachersForStudent);
router.get("/:teacherId/students", verifyToken, getStudentsForTeacher);

router.delete(
  "/:studentId/delete-teacher/:teacherId",
  verifyToken,
  deleteTeacher
);
module.exports = router;
