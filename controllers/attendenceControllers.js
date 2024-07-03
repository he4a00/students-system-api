const Attendence = require("../models/Attendence");
const Student = require("../models/Student");

// // get the attendance by student id and will contain pagination

const getAttendanceById = async (req, res) => {
  const { studentId } = req.params;

  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = 10;
    const totalAttendances = await Student.findOne({ _id: studentId })
      .select("attendence")
      .populate("attendence")
      .then((student) => student.attendence.length);

    const totalPages = Math.ceil(totalAttendances / perPage);

    if (totalPages === 0) {
      return res.status(200).json({
        totalAttendances: 0,
        totalPages: 0,
        currentPage: page,
        attendences: [],
      });
    }

    const student = await Student.findOne({ _id: studentId }).populate({
      path: "attendence",
      options: {
        skip: (page - 1) * perPage,
        limit: perPage,
      },
    });

    const attendences = student.attendence;

    res.status(200).json({
      totalAttendances: totalAttendances,
      totalPages: totalPages,
      currentPage: page,
      attendences,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

const markAttendance = async (req, res) => {
  const { id } = req.params;
  const { date, present } = req.body;

  const attendanceDate = date ? new Date(date) : new Date();
  attendanceDate.setHours(0, 0, 0, 0); // Normalize the date

  try {
    const student = await Student.findById(id).populate("attendence");
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Find existing attendance record
    let attendanceRecord = student.attendence.find(
      (attendance) =>
        attendance.date.toDateString() === attendanceDate.toDateString()
    );

    if (!attendanceRecord) {
      // Create new attendance record if not found
      attendanceRecord = new Attendence({
        date: attendanceDate,
        present: present === "true", // Set initial attendance value
      });
      await attendanceRecord.save();
      student.attendence.push(attendanceRecord);
    } else {
      // Update existing attendance record
      attendanceRecord.present = present === "true";
      await attendanceRecord.save();
    }

    await student.save();

    return res.status(200).json(student);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  markAttendance,
  getAttendanceById,
};
