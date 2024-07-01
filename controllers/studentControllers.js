const Attendence = require("../models/Attendence");
const MonthlyPayment = require("../models/MonthlyPayment");
const Student = require("../models/Student");
const Teacher = require("../models/Teacher");

const getAllStudents = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = 10;
    let query = {};

    // Filter by name if query parameter exists
    if (req.query.name) {
      query.name = { $regex: req.query.name, $options: "i" };
    }

    // Filter by education year if query parameter exists
    if (req.query.eduyear) {
      query.eduyear = req.query.eduyear;
    }

    const totalStudents = await Student.countDocuments(query); // Count documents based on query
    const totalPages = Math.ceil(totalStudents / perPage);

    if (totalPages === 0) {
      return res.status(200).json({
        totalStudents: 0,
        totalPages: 0,
        currentPage: page,
        students: [],
      });
    }

    const students = await Student.find(query)
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
    return res.status(500).json({ error: error.message });
  }
};

module.exports = getAllStudents;

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
    const { name, phoneNumber, gender, eduyear } = req.body;

    const existingStudent = await Student.findOne({ phoneNumber: phoneNumber });

    if (existingStudent) {
      return res.status(409).json("this user already exists");
    }

    const student = await Student.create({
      name,
      phoneNumber,
      gender,
      eduyear,
    });

    return res.status(200).json(student);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

const updateStudent = async (req, res) => {
  try {
    const { name, phoneNumber, gender, eduyear } = req.body;
    const { studentId } = req.params;

    const updatedStudent = await Student.findOneAndUpdate(
      studentId,
      {
        name,
        phoneNumber,
        gender,
        eduyear,
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

    // Find the student and populate related data
    const student = await Student.findById(studentId)
      .populate("monthlyPayment teacher attendence")
      .exec();

    if (!student) {
      return res.status(404).json("Student not found");
    }

    // Delete monthly payments
    for (const payment of student.monthlyPayment) {
      await MonthlyPayment.findByIdAndDelete(payment);
    }

    // Remove student from teachers' student lists
    for (const teacher of student.teacher) {
      await Teacher.findByIdAndDelete(teacher);
    }

    // Delete attendance records
    for (const attendance of student.attendence) {
      await Attendence.findByIdAndDelete(attendance);
    }

    // Finally, delete the student
    await Student.findByIdAndDelete(studentId);

    return res
      .status(200)
      .json({ message: "Student and related data deleted" });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

const filterByEducationYear = async (req, res) => {
  try {
    const { eduyear } = req.query;
    console.log("Received eduyear:", eduyear);

    if (!eduyear) {
      return res.status(400).json({ error: "Education year is required" });
    }

    const students = await Student.find({ eduyear: eduyear });

    return res.status(200).json(students);
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
  filterByEducationYear,
};
