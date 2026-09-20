import express from 'express';
import {
  getDashboard,
  getStudents,
  getCompanies,
  getDrives,
  getInterviews,
  generateReports
} from '../controllers/tpoController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.use(authorize('tpo'));

router.get('/dashboard', getDashboard);
router.get('/students', getStudents);
router.get('/companies', getCompanies);
router.get('/drives', getDrives);
router.get('/interviews', getInterviews);
router.get('/reports', generateReports);

export default router;
