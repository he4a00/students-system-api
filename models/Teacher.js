const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "teacher must have a name"],
  },
  gender: {
    type: String,
    enum: ["male", "female"],
    required: true,
  },
  subject: {
    type: String,
    required: [true, "teacher must have a subject to teach"],
  },
});

const Teacher = mongoose.model("Teacher", teacherSchema);

module.exports = Teacher;
