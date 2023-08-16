const jwt = require("jsonwebtoken");
const User = require("../models/User");

const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: "10d",
  });
};

const SignUp = async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(409).json("user already exists...");
    }
    const user = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });
    const token = signToken(user._id);
    return res.status(200).json({ token, user });
  } catch (error) {
    res.status(400).json(error.message);
  }
};

const SignIn = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json("Please Provide The username And the Password");
  }

  const user = await User.findOne({ username }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return res.status(400).json("Incorrect Username or Password");
  }

  user.password = undefined;

  const token = signToken(user._id);

  return res.status(200).json({ user, token });
};

module.exports = { SignUp, SignIn };
