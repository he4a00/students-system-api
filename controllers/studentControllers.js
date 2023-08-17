const Student = require("../models/Student");

const getAllStudents = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;

    const perPage = 10;
    const totalStudents = await Student.countDocuments();
    const totalPages = Math.ceil(totalStudents / perPage);

    if (totalPages === 0) {
      return res.status(200).json({
        totalStudents: 0,
        totalPages: 0,
        currentPage: page,
        students: [],
      });
    }

    const students = await Student.find()
      .skip((page - 1) * perPage)
      .limit(perPage)
      .populate("monthlyPayment")
      .populate("teacher");

    res.status(200).json({
      totalStudents: totalStudents,
      totalPages: totalPages,
      currentPage: page,
      students,
    });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

const getStudent = async (req, res) => {
  const { id } = req.params;
  try {
    const student = await Student.findOne({ _id: id })
      .populate("monthlyPayment")
      .populate("teacher")
      .populate("attendence");

    if (!student) {
      return res.status(404).json("There Is No Student With this id");
    }

    return res.status(200).json(student);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

const addStudent = async (req, res) => {
  try {
    const { name, phoneNumber, gender } = req.body;

    const existingStudent = await Student.findOne({ phoneNumber: phoneNumber });

    if (existingStudent) {
      return res.status(409).json("this user already exists");
    }

    const student = await Student.create({
      name,
      phoneNumber,
      gender,
    });

    return res.status(200).json(student);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

const updateStudent = async (req, res) => {
  try {
    const { name, phoneNumber, gender } = req.body;
    const { studentId } = req.params;

    const updatedStudent = await Student.findOneAndUpdate(
      studentId,
      {
        name,
        phoneNumber,
        gender,
      },
      { new: true }
    );

    if (!updatedStudent) {
      return res.status(404).json("Student not found");
    }

    return res.status(200).json(updatedStudent);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

const deleteStudent = async (req, res) => {
  try {
    const { studentId } = req.params;

    const deletedStudent = await Student.findByIdAndDelete(studentId);

    if (!deletedStudent) {
      return res.status(404).json("Student not found");
    }

    return res.status(200).json(deletedStudent);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

module.exports = {
  addStudent,
  getAllStudents,
  getStudent,
  updateStudent,
  deleteStudent,
};
