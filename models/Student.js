const mongoose = require("mongoose");
const validator = require("validator");

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "student must have a name"],
  },
  phoneNumber: {
    type: String,
    required: [true, "student must have a phone number"],
    validate: {
      validator: function (value) {
        return validator.isMobilePhone(value, "any", { strictMode: false });
      },
      message: "Invalid phone number format",
    },
  },
  gender: {
    type: String,
    enum: ["male", "female"],
    required: true,
  },
  eduyear: {
    type: String,
    required: [true, "student must have a education year"],
  },
  monthlyPayment: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MonthlyPayment",
    },
  ],
  teacher: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
    },
  ],
  attendence: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Attendence",
    },
  ],
});

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
