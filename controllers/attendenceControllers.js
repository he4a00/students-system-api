const Attendence = require("../models/Attendence");
const Student = require("../models/Student");

const markAttendance = async (req, res) => {
  const { id } = req.params;
  const { date, present } = req.body;

  const attendanceDate = date || new Date();
  attendanceDate.setHours(0, 0, 0, 0);

  try {
    const student = await Student.findOne({ _id: id }).populate("attendence");
    if (!student) {
      return res.status(404).json("Student not found");
    }

    const existingAttendance = student.attendence.find(
      (attendance) =>
        attendance.date.toDateString() === attendanceDate.toDateString()
    );

    if (existingAttendance) {
      return res.status(409).json("Attendance already marked for this date");
    }

    const attendanceRecord = new Attendence({
      date: attendanceDate,
      present: true,
    });
    await attendanceRecord.save();
    student.attendence.push(attendanceRecord._id);
    await student.save();
    return res.status(200).json(student);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

module.exports = { markAttendance };
