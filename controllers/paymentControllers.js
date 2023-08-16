const MonthlyPayment = require("../models/MonthlyPayment");
const Student = require("../models/Student");

const addPayment = async (req, res) => {
  const { id } = req.params;
  const { month, year, isPaid } = req.body;
  try {
    const student = await Student.findOne({ _id: id }).populate(
      "monthlyPayment"
    );
    if (!student) {
      return res.status(404).json("Student not found");
    }

    const payment = new MonthlyPayment({
      month,
      year,
      isPaid,
    });
    await payment.save();
    student.monthlyPayment.push(payment._id);
    await student.save();

    return res.status(200).json(student);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

module.exports = { addPayment };
