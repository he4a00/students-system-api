const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const User = require("../models/User");

const verifyToken = async (req, res, next) => {
  // first: get the token
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(res.status(401).json("You Are Not Authorized"));
  }

  // validate the token

  try {
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    const freshUser = await User.findById(decoded.id);
    if (!freshUser) {
      return next(
        res
          .status(401)
          .json("This user belonging to this token does not exist anymore")
      );
    }
    req.user = freshUser;
    next();
  } catch (error) {
    return next(res.status(500).json("something went wrong"));
  }
};

module.exports = { verifyToken };
