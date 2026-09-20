import express from 'express';
import {
  getDashboard,
  getStudents,
  getCompanies,
  verifyCompany,
  getDrives,
  getInterviews,
  generateReports
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/dashboard', getDashboard);
router.get('/students', getStudents);
router.get('/companies', getCompanies);
router.post('/verify-company', verifyCompany);
router.get('/drives', getDrives);
router.get('/interviews', getInterviews);
router.get('/reports', generateReports);

export default router;
