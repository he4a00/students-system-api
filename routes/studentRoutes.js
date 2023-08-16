const express = require("express");

const router = express.Router();

const { verifyToken } = require("../middlewares/verifyToken");
const {
  addStudent,
  getAllStudents,
  getStudent,
  updateStudent,
  deleteStudent,
} = require("../controllers/studentControllers");

router.get("/", getAllStudents);
router.get("/:id", getStudent);
router.post("/", verifyToken, addStudent);
router.put("/:id", verifyToken, updateStudent);
router.delete("/:studentId", verifyToken, deleteStudent);
module.exports = router;
