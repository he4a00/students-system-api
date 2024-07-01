const express = require("express");
const {
  addPayment,
  getPaymentsById,
} = require("../controllers/paymentControllers");
const { verifyToken } = require("../middlewares/verifyToken");

const router = express.Router();

router.post("/:id", verifyToken, addPayment);
router.get("/:studentId/payments", verifyToken, getPaymentsById);
module.exports = router;
