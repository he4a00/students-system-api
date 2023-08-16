const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  present: {
    type: Boolean,
    default: false,
  },
});

const Attendence = mongoose.model("Attendence", attendanceSchema);

module.exports = Attendence;
