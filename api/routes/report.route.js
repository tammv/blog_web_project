import express from 'express';
import {
  createReport,
  getAllReports,
  getReportById,
  updateReportById,
  deleteReportById
} from '../controllers/report.controller.js';

const router = express.Router();

router.post('/', createReport);
router.get('/', getAllReports);
router.get('/:id', getReportById);
router.put('/:id', updateReportById);
router.delete('/:id', deleteReportById);

export default router;
