const express = require("express");
const { addPayment } = require("../controllers/paymentControllers");
const { verifyToken } = require("../middlewares/verifyToken");

const router = express.Router();

router.post("/:id", verifyToken, addPayment);
module.exports = router;
