import Student from '../models/Student.js';
import Company from '../models/Company.js';
import PlacementDrive from '../models/PlacementDrive.js';
import Interview from '../models/Interview.js';
import { buildPlacementReport, attachApplicantCounts } from '../utils/reports.js';

export const getDashboard = async (req, res) => {
  try {
    const stats = {
      totalStudents: await Student.countDocuments(),
      totalCompanies: await Company.countDocuments(),
      totalDrives: await PlacementDrive.countDocuments(),
      placedStudents: await Student.countDocuments({ isPlaced: true })
    };
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getStudents = async (req, res) => {
  try {
    const students = await Student.find()
      .populate('userId', 'name email')
      .populate('placedCompany', 'companyName');
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCompanies = async (req, res) => {
  try {
    const companies = await Company.find().populate('userId', 'name email');
    res.json(companies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const verifyCompany = async (req, res) => {
  try {
    const company = await Company.findByIdAndUpdate(
      req.body.companyId,
      { isVerified: true },
      { new: true }
    );

    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    res.json(company);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getDrives = async (req, res) => {
  try {
    const drives = await PlacementDrive.find()
      .populate('company')
      .sort({ registrationDeadline: 1 });
    res.json(await attachApplicantCounts(drives));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find()
      .populate({ path: 'student', populate: { path: 'userId', select: 'name email' } })
      .populate('company')
      .populate('placementDrive')
      .sort({ scheduledDate: 1 });
    res.json(interviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const generateReports = async (req, res) => {
  try {
    res.json(await buildPlacementReport());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
