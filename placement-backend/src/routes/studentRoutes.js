import express from 'express';
import {
  getDashboard,
  getProfile,
  uploadResume,
  updateProfile,
  getPlacementDrives,
  applyForDrive,
  getApplications,
  getInterviews
} from '../controllers/studentController.js';
import { protect, authorize } from '../middleware/auth.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const resumeDirectory = path.join(process.cwd(), 'uploads/resumes');
fs.mkdirSync(resumeDirectory, { recursive: true });
const uploadResumeFile = multer({
  storage: multer.diskStorage({
    destination: resumeDirectory,
    filename: (req, file, callback) => callback(null, `${req.user.id}-${Date.now()}.pdf`)
  }),
  fileFilter: (req, file, callback) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const mime = file.mimetype;
    if (ext === '.pdf' && mime === 'application/pdf') {
      return callback(null, true);
    }
    return callback(null, false);
  },
  limits: { fileSize: 5 * 1024 * 1024 }
});

const router = express.Router();

router.use(protect);
router.use(authorize('student'));

router.get('/dashboard', getDashboard);
router.get('/profile', getProfile);
router.post('/resume', uploadResumeFile.single('resume'), uploadResume);
router.put('/profile', updateProfile);
router.get('/drives', getPlacementDrives);
router.post('/apply', applyForDrive);
router.get('/applications', getApplications);
router.get('/interviews', getInterviews);

export default router;
