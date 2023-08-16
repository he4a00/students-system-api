const Student = require("../models/Student");
const Teacher = require("../models/Teacher");

const addTeacher = async (req, res) => {
  const { id } = req.params;
  const { name, gender, subject } = req.body;
  try {
    const student = await Student.findOne({ _id: id });
    if (!student) {
      return res.status(404).json("Student not found");
    }

    const existingTeacher = await Teacher.findOne({
      name,
      _id: { $in: student.teacher },
    });

    if (existingTeacher) {
      return res
        .status(409)
        .json("This student already has a teacher with the same name");
    }

    const teacher = new Teacher({ name, gender, subject });

    await teacher.save();
    student.teacher.push(teacher._id);
    await student.save();

    return res.status(200).json(student);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

const deleteTeacher = async (req, res) => {
  const { studentId, teacherId } = req.params; // Student's ID and Teacher's ID
  try {
    const student = await Student.findOne({ _id: studentId });
    if (!student) {
      return res.status(404).json("Student not found");
    }

    // Check if the teacher is associated with the student
    if (!student.teacher.includes(teacherId)) {
      return res.status(404).json("Teacher not found for this student");
    }

    // Remove the teacher from the student's teacher array
    student.teacher = student.teacher.filter(
      (teacher) => teacher.toString() !== teacherId
    );
    await student.save();

    // Delete the teacher from the Teacher collection
    await Teacher.findOneAndDelete({ _id: teacherId });

    return res.status(200).json("Teacher removed from student successfully");
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

module.exports = { addTeacher, deleteTeacher };
