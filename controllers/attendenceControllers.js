// const Attendence = require("../models/Attendence");
// const Student = require("../models/Student");

// // get the attendance by student id and will contain pagination

// const getAttendanceById = async (req, res) => {
//   const { studentId } = req.params;

//   try {
//     const page = parseInt(req.query.page) || 1;
//     const perPage = 10;
//     const totalAttendances = await Student.findOne({ _id: studentId })
//       .select("attendence")
//       .populate("attendence")
//       .then((student) => student.attendence.length);

//     const totalPages = Math.ceil(totalAttendances / perPage);

//     if (totalPages === 0) {
//       return res.status(200).json({
//         totalAttendances: 0,
//         totalPages: 0,
//         currentPage: page,
//         attendences: [],
//       });
//     }

//     const student = await Student.findOne({ _id: studentId }).populate({
//       path: "attendence",
//       options: {
//         skip: (page - 1) * perPage,
//         limit: perPage,
//       },
//     });

//     const attendences = student.attendence;

//     res.status(200).json({
//       totalAttendances: totalAttendances,
//       totalPages: totalPages,
//       currentPage: page,
//       attendences,
//     });
//   } catch (error) {
//     res.status(500).json(error);
//   }
// };

// const markAttendance = async (req, res) => {
//   const { id } = req.params;
//   const { date, present } = req.body;

//   const attendanceDate = date || new Date();
//   attendanceDate.setHours(0, 0, 0, 0);

//   try {
//     const student = await Student.findOne({ _id: id }).populate("attendence");
//     if (!student) {
//       return res.status(404).json("Student not found");
//     }

//     const existingAttendance = student.attendence.find(
//       (attendance) =>
//         attendance.date.toDateString() === attendanceDate.toDateString()
//     );

//     if (!existingAttendance) {
//       // Create a new attendance record and set it to false
//       const attendanceRecord = new Attendence({
//         date: attendanceDate,
//         present: false, // Set to false since there's no attendance recorded yet
//       });
//       await attendanceRecord.save();
//       student.attendence.push(attendanceRecord);
//       await student.save();

//       return res.status(200).json(student);
//     } else {
//       // If attendance exists, update its present value based on the request
//       existingAttendance.present = present === "true";
//       await existingAttendance.save();

//       return res.status(200).json(student);
//     }
//   } catch (error) {
//     return res.status(500).json(error.message);
//   }
// };

// const updateAttendanceForNewDay = async () => {
//   const now = new Date();
//   const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

//   const students = await Student.find().populate("attendence");
//   for (const student of students) {
//     const existingAttendance = student.attendence.find(
//       (attendance) => attendance.date.toDateString() === today.toDateString()
//     );

//     if (!existingAttendance) {
//       const attendanceRecord = new Attendence({
//         date: today,
//         present: false,
//       });
//       await attendanceRecord.save();
//       student.attendence.push(attendanceRecord._id);
//       await student.save();
//     }
//   }

//   // Schedule the next update for the next day
//   const nextMidnight = new Date(today.getTime() + 24 * 60 * 60 * 1000);
//   const timeUntilNextMidnight = nextMidnight - now;
//   setTimeout(updateAttendanceForNewDay, timeUntilNextMidnight);
// };

// module.exports = {
//   markAttendance,
//   updateAttendanceForNewDay,
//   getAttendanceById,
// };
