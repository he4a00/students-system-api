const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const queryParser = require("express-query-params");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const studentRoutes = require("./routes/studentRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const teacherRoutes = require("./routes/teacherRoutes");
const attendenceRoutes = require("./routes/attendenceRoutes");
const {
  updateAttendanceForNewDay,
} = require("./controllers/attendenceControllers");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(queryParser());

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB:", err);
  });

// updateAttendanceForNewDay();

app.listen(process.env.PORT, () => {
  console.log("listening on port", process.env.PORT);
});

// routes

app.use("/api/users", userRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/teacher", teacherRoutes);
app.use("/api/attendence", attendenceRoutes);
