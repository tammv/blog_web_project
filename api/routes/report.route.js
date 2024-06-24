import express from "express";

import { verifyToken } from "../utils/verifyUser.js";
import {
  createReport,
  getAllReports,
  getReportById,
  updateReportById,
  deleteReportById,
} from "../controllers/report.controller.js";

const router = express.Router();

router.post("/create", verifyToken, createReport);
router.get("/getall", verifyToken, getAllReports);
router.get("/:id", verifyToken, getReportById);
router.put("/update-report/:id", verifyToken, updateReportById);
router.delete("/delete-report/:id", verifyToken, deleteReportById);

export default router;
