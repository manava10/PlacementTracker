import Student from '../models/Student.js';
import Application from '../models/Application.js';
import Interview from '../models/Interview.js';
import PlacementDrive from '../models/PlacementDrive.js';

export const getDashboard = async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user.id });
    if (!student) {
      return res.status(404).json({ error: 'Student profile not found' });
    }

    const applications = await Application.countDocuments({ student: student._id });
    const interviews = await Interview.countDocuments({ student: student._id });
    const shortlisted = await Application.countDocuments({
      student: student._id,
      status: 'shortlisted'
    });

    // Dynamically calculate profile strength
    let strengthPoints = 0;
    if (student.department) strengthPoints += 20;
    if (student.batch) strengthPoints += 20;
    if (student.skills && student.skills.length > 0) strengthPoints += 30;
    if (student.bio) strengthPoints += 15;
    if (student.resume) strengthPoints += 15;
    const profileStrength = Math.min(100, Math.max(student.profileStrength || 0, strengthPoints));

    // Calculate ATS score
    const skillCount = student.skills ? student.skills.length : 0;
    const atsScore = Math.min(100, Math.max(student.atsScore || 0, Math.min(95, 60 + skillCount * 6 + (student.resume ? 10 : 0))));

    res.json({
      atsScore,
      applications,
      interviews,
      shortlisted,
      profileStrength,
      isPlaced: student.isPlaced
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user.id }).populate('userId');
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Please upload a PDF resume' });
    }

    const student = await Student.findOneAndUpdate(
      { userId: req.user.id },
      { resume: `/uploads/resumes/${req.file.filename}` },
      { new: true }
    );

    res.json({ message: 'Resume uploaded successfully', resume: student.resume });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { bio, skills, department, batch, rollNumber } = req.body;
    const allowedUpdates = {};
    if (bio !== undefined) allowedUpdates.bio = bio;
    if (skills !== undefined) allowedUpdates.skills = skills;
    if (department !== undefined) allowedUpdates.department = department;
    if (batch !== undefined) allowedUpdates.batch = batch;
    if (rollNumber !== undefined) allowedUpdates.rollNumber = rollNumber;

    const student = await Student.findOneAndUpdate(
      { userId: req.user.id },
      allowedUpdates,
      { new: true }
    );
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPlacementDrives = async (req, res) => {
  try {
    const drives = await PlacementDrive.find({ status: { $in: ['upcoming', 'ongoing'] } })
      .populate('company')
      .sort({ registrationDeadline: 1 });
    res.json(drives);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const applyForDrive = async (req, res) => {
  try {
    const { driveId } = req.body;
    const student = await Student.findOne({ userId: req.user.id });
    if (!student) {
      return res.status(404).json({ error: 'Student profile not found' });
    }

    const drive = await PlacementDrive.findById(driveId);
    if (!drive) {
      return res.status(404).json({ error: 'Placement drive not found' });
    }

    const alreadyApplied = await Application.findOne({ student: student._id, placementDrive: drive._id });
    if (alreadyApplied) {
      return res.status(400).json({ error: 'You have already applied for this drive' });
    }

    const application = await Application.create({
      student: student._id,
      placementDrive: drive._id,
      company: drive.company,
      salary: drive.salary
    });

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getApplications = async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user.id });
    if (!student) {
      return res.status(404).json({ error: 'Student profile not found' });
    }
    const applications = await Application.find({ student: student._id })
      .populate('placementDrive')
      .populate('company')
      .sort({ appliedAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getInterviews = async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user.id });
    if (!student) {
      return res.status(404).json({ error: 'Student profile not found' });
    }
    const interviews = await Interview.find({ student: student._id })
      .populate('company')
      .populate('placementDrive')
      .sort({ scheduledDate: 1 });
    res.json(interviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
