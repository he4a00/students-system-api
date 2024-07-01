const MonthlyPayment = require("../models/MonthlyPayment");
const Student = require("../models/Student");

const getPaymentsById = async (req, res) => {
  const { studentId } = req.params;

  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = 10;
    const totalPayments = await Student.findOne({ _id: studentId })
      .select("monthlyPayment")
      .populate("monthlyPayment")
      .then((student) => student.monthlyPayment.length);

    const totalPages = Math.ceil(totalPayments / perPage);

    if (totalPages === 0) {
      return res.status(200).json({
        totalPayments: 0,
        totalPages: 0,
        currentPage: page,
        payments: [],
      });
    }

    const student = await Student.findOne({ _id: studentId }).populate({
      path: "monthlyPayment",
      options: {
        skip: (page - 1) * perPage,
        limit: perPage,
      },
    });

    const payments = student.monthlyPayment;

    res.status(200).json({
      totalPayments: totalPayments,
      totalPages: totalPages,
      currentPage: page,
      payments,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

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

    const existingPayment = student.monthlyPayment.find(
      (payment) => payment.month === month && payment.year === year
    );

    if (existingPayment) {
      return res.status(409).json("This month/year already marked");
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

module.exports = { addPayment, getPaymentsById };
