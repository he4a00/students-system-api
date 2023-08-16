const express = require("express");

const router = express.Router();

const { SignUp, SignIn } = require("../controllers/userControllers");

router.post("/register", SignUp);
router.post("/login", SignIn);
module.exports = router;
