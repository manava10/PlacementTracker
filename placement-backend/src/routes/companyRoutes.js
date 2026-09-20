import express from 'express';
import {
  getDashboard,
  createDrive,
  getDrives,
  getApplicants,
  getShortlisted,
  scheduleInterview,
  updateApplicationStatus,
  getInterviews
} from '../controllers/companyController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.use(authorize('company'));

router.get('/dashboard', getDashboard);
router.post('/drives', createDrive);
router.get('/drives', getDrives);
router.get('/applicants', getApplicants);
router.get('/shortlisted', getShortlisted);
router.patch('/applications/:applicationId/status', updateApplicationStatus);
router.post('/interviews', scheduleInterview);
router.get('/interviews', getInterviews);

export default router;
