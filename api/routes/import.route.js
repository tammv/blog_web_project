// routes/import.route.js
import express from "express";
import path from "path";
import Video from "../models/video.model.js";
import XLSX from "xlsx";

const router = express.Router();

router.post("/importVideos", async (req, res, next) => {
  try {
    const jsonData = req.body;

    await Video.insertMany(jsonData);

    res.status(200).json({ message: "Data imported successfully!" });
  } catch (error) {
    next(error);
  }
});

export default router;
