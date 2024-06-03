import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import postRoutes from "./routes/post.route.js";
import paymentRoutes from "./routes/payment.route.js";
import commentRoutes from "./routes/comment.route.js";
import topicRoutes from "./routes/topic.route.js";
import reportRoutes from "./routes/report.route.js";
import cookieParser from "cookie-parser";


dotenv.config();

mongoose
  .connect(process.env.MongoDB)
  .then(() => {
    console.log("Mongodb is connected");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();

app.use(express.json());
app.use(cookieParser());

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/topics", topicRoutes);
app.use('/api/reports', reportRoutes);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
