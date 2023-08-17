const Attendence = require("../models/Attendence");
const Student = require("../models/Student");
const corn = require("node-cron");

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

cron.schedule("0 0 * * *", async () => {
  try {
    const students = await Student.find().populate("attendence");

    for (const student of students) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const attendanceRecord = student.attendence.find(
        (attendance) => attendance.date.toDateString() === today.toDateString()
      );

      if (!attendanceRecord) {
        const newAttendanceRecord = new Attendence({
          date: today,
          present: false,
        });
        await newAttendanceRecord.save();
        student.attendence.push(newAttendanceRecord._id);
        await student.save();
      }
    }

    console.log("Daily attendance update completed.");
  } catch (error) {
    console.error("Error updating daily attendance:", error);
  }
});

module.exports = { markAttendance };
