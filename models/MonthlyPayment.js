const mongoose = require("mongoose");

const monthlyPaymentSchema = new mongoose.Schema({
  month: { type: String, required: true },
  year: { type: String, required: true },
  isPaid: { type: Boolean, default: false },
});

const MonthlyPayment = mongoose.model("MonthlyPayment", monthlyPaymentSchema);

module.exports = MonthlyPayment;
