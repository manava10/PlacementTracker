import { pathToFileURL } from 'url';
import { connectDB } from '../config/db.js';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Student from '../models/Student.js';
import Company from '../models/Company.js';
import PlacementDrive from '../models/PlacementDrive.js';
import Application from '../models/Application.js';
import Interview from '../models/Interview.js';

const daysFromNow = (days) => new Date(Date.now() + days * 24 * 60 * 60 * 1000);

// ============================================================================
// SEED DATA
// ----------------------------------------------------------------------------
// Login credentials created by this seed (all work on a fresh download + run):
//   Admin      -> admin@placement.com      / admin123
//   TPO Head   -> tpohead@placement.com    / tpohead123
//   Students   -> prajwal@student.com      / student123   (+ aditya, sneha,
//                 rahul, ananya @student.com / student123)
//   Companies  -> careers@abctech.com      / company123   (+ jobs@techsolutions,
//                 campus@infosys, careers@deloitte, careers@wipro, careers@tcs)
// ============================================================================

const seedUsers = [
  { name: 'Admin User', email: 'admin@placement.com', password: 'admin123', role: 'admin', phone: '9999999999' },
  { name: 'Dr. Rajesh Kumar', email: 'tpohead@placement.com', password: 'tpohead123', role: 'tpo', phone: '8888888888' },
  { name: 'Prajwal Budhwant', email: 'prajwal@student.com', password: 'student123', role: 'student', phone: '7777777777' },
  { name: 'Aditya Sharma', email: 'aditya@student.com', password: 'student123', role: 'student', phone: '6666666666' },
  { name: 'Sneha Reddy', email: 'sneha@student.com', password: 'student123', role: 'student', phone: '5555555555' },
  { name: 'Rahul Verma', email: 'rahul@student.com', password: 'student123', role: 'student', phone: '5555555556' },
  { name: 'Ananya Singh', email: 'ananya@student.com', password: 'student123', role: 'student', phone: '5555555557' },
  { name: 'ABC Technologies', email: 'careers@abctech.com', password: 'company123', role: 'company', phone: '4444444444' },
  { name: 'Tech Solutions', email: 'jobs@techsolutions.com', password: 'company123', role: 'company', phone: '3333333333' },
  { name: 'Infosys', email: 'campus@infosys.com', password: 'company123', role: 'company', phone: '2222222222' },
  { name: 'Deloitte', email: 'careers@deloitte.com', password: 'company123', role: 'company', phone: '2222222223' },
  { name: 'Wipro', email: 'careers@wipro.com', password: 'company123', role: 'company', phone: '2222222224' },
  { name: 'TCS', email: 'careers@tcs.com', password: 'company123', role: 'company', phone: '2222222225' }
];

const seedStudents = [
  { userEmail: 'prajwal@student.com', rollNumber: '2021001', department: 'CSE', batch: '2021', cgpa: 8.6, skills: ['Java', 'React', 'MongoDB', 'Node.js'], bio: 'Software engineering student passionate about backend systems and web development.', atsScore: 84, profileStrength: 88, isPlaced: false },
  { userEmail: 'aditya@student.com', rollNumber: '2021002', department: 'CSE', batch: '2021', cgpa: 9.1, skills: ['Java', 'Spring Boot', 'MySQL', 'System Design'], bio: 'Backend-focused student with experience in APIs, databases, and scalable services.', atsScore: 91, profileStrength: 94, isPlaced: false },
  { userEmail: 'sneha@student.com', rollNumber: '2022003', department: 'ECE', batch: '2022', cgpa: 8.8, skills: ['React', 'JavaScript', 'CSS', 'UI/UX'], bio: 'Frontend developer focused on clean interfaces and responsive product design.', atsScore: 87, profileStrength: 90, isPlaced: false },
  { userEmail: 'rahul@student.com', rollNumber: '2021004', department: 'IT', batch: '2021', cgpa: 7.9, skills: ['Python', 'Django', 'PostgreSQL', 'REST APIs'], bio: 'Information technology student interested in web frameworks and databases.', atsScore: 80, profileStrength: 82, isPlaced: false },
  { userEmail: 'ananya@student.com', rollNumber: '2022005', department: 'CSE', batch: '2022', cgpa: 9.0, skills: ['Data Analysis', 'SQL', 'Python', 'Power BI'], bio: 'Aspiring data analyst with strong statistics and visualization skills.', atsScore: 89, profileStrength: 92, isPlaced: false }
];

const seedCompanies = [
  { userEmail: 'careers@abctech.com', companyName: 'ABC Technologies', website: 'https://abctech.com', location: 'Hyderabad', industry: 'IT & Software', description: 'Product engineering company focused on cloud and digital transformation.', hrName: 'Neha Verma', hrPhone: '9898989898', hrEmail: 'neha@abctech.com', isVerified: true, totalPositions: 25, filledPositions: 0 },
  { userEmail: 'jobs@techsolutions.com', companyName: 'Tech Solutions', website: 'https://techsolutions.com', location: 'Bengaluru', industry: 'Software', description: 'Builds enterprise software solutions for global clients.', hrName: 'Rohit Menon', hrPhone: '9876543210', hrEmail: 'rohit@techsolutions.com', isVerified: true, totalPositions: 18, filledPositions: 0 },
  { userEmail: 'campus@infosys.com', companyName: 'Infosys', website: 'https://infosys.com', location: 'Pune', industry: 'IT Services', description: 'Global leader in next-generation digital services and consulting.', hrName: 'Priya Shah', hrPhone: '9988776655', hrEmail: 'priya@infosys.com', isVerified: true, totalPositions: 30, filledPositions: 0 },
  { userEmail: 'careers@deloitte.com', companyName: 'Deloitte', website: 'https://deloitte.com', location: 'Mumbai', industry: 'Consulting', description: 'Multinational professional services network and consulting firm.', hrName: 'Karan Malhotra', hrPhone: '9812345670', hrEmail: 'karan@deloitte.com', isVerified: true, totalPositions: 20, filledPositions: 0 },
  { userEmail: 'careers@wipro.com', companyName: 'Wipro', website: 'https://wipro.com', location: 'Hyderabad', industry: 'IT Services', description: 'Leading global information technology and consulting company.', hrName: 'Divya Nair', hrPhone: '9812345671', hrEmail: 'divya@wipro.com', isVerified: true, totalPositions: 22, filledPositions: 0 },
  { userEmail: 'careers@tcs.com', companyName: 'TCS', website: 'https://tcs.com', location: 'Chennai', industry: 'IT Services', description: 'Tata Consultancy Services, a global IT services and consulting organization.', hrName: 'Suresh Iyer', hrPhone: '9812345672', hrEmail: 'suresh@tcs.com', isVerified: true, totalPositions: 40, filledPositions: 0 }
];

const seedDrives = [
  { title: 'Software Engineer Campus Drive', companyName: 'ABC Technologies', description: 'Hiring for full-stack software engineering roles.', positions: 8, salary: 900000, location: 'Hyderabad', jobRole: 'Software Engineer', jobType: 'Full Time', status: 'upcoming', eligibility: { minCGPA: 7.5, departments: ['CSE', 'IT'], batches: ['2021', '2022'] }, requirements: ['Java', 'Data Structures', 'Problem Solving', 'Communication'], benefits: ['Health Insurance', 'Learning Allowance', 'Hybrid Work'], deadlineInDays: 25, driveInDays: 32 },
  { title: 'Backend Developer Hiring', companyName: 'Tech Solutions', description: 'Opportunity for backend developers with strong APIs and scalable systems knowledge.', positions: 5, salary: 1200000, location: 'Bengaluru', jobRole: 'Backend Developer', jobType: 'Full Time', status: 'upcoming', eligibility: { minCGPA: 8, departments: ['CSE'], batches: ['2021', '2022'] }, requirements: ['Java', 'Spring Boot', 'SQL'], benefits: ['Performance Bonus', 'Relocation Assistance'], deadlineInDays: 20, driveInDays: 28 },
  { title: 'System Engineer Recruitment', companyName: 'Infosys', description: 'Hiring system engineers for modern enterprise platforms.', positions: 12, salary: 850000, location: 'Pune', jobRole: 'System Engineer', jobType: 'Full Time', status: 'upcoming', eligibility: { minCGPA: 7.0, departments: ['CSE', 'ECE', 'IT'], batches: ['2021', '2022'] }, requirements: ['Problem Solving', 'DBMS', 'Communication'], benefits: ['Joining Bonus', 'Training Program'], deadlineInDays: 30, driveInDays: 40 },
  { title: 'Data Analyst Opening', companyName: 'Deloitte', description: 'Analyst roles for data-driven consulting engagements.', positions: 6, salary: 950000, location: 'Mumbai', jobRole: 'Data Analyst', jobType: 'Full Time', status: 'upcoming', eligibility: { minCGPA: 7.5, departments: ['CSE', 'IT', 'ECE'], batches: ['2021', '2022'] }, requirements: ['SQL', 'Excel', 'Statistics', 'Power BI'], benefits: ['Mentorship', 'Certification Support'], deadlineInDays: 18, driveInDays: 26 },
  { title: 'Java Developer Drive', companyName: 'Wipro', description: 'Java developer positions for enterprise application teams.', positions: 10, salary: 650000, location: 'Hyderabad', jobRole: 'Java Developer', jobType: 'Full Time', status: 'ongoing', eligibility: { minCGPA: 6.5, departments: ['CSE', 'IT'], batches: ['2021', '2022'] }, requirements: ['Core Java', 'Spring', 'SQL'], benefits: ['Transport Facility', 'Health Insurance'], deadlineInDays: 12, driveInDays: 18 },
  { title: 'Software Developer Recruitment', companyName: 'TCS', description: 'Campus hiring for software developer trainees.', positions: 15, salary: 750000, location: 'Chennai', jobRole: 'Software Developer', jobType: 'Full Time', status: 'completed', eligibility: { minCGPA: 6.5, departments: ['CSE', 'IT', 'ECE'], batches: ['2021', '2022'] }, requirements: ['Aptitude', 'Programming Fundamentals', 'Communication'], benefits: ['Training Program', 'Relocation Assistance'], deadlineInDays: -5, driveInDays: -1 }
];

const seedApplications = [
  { studentEmail: 'prajwal@student.com', companyName: 'ABC Technologies', driveTitle: 'Software Engineer Campus Drive', status: 'applied' },
  { studentEmail: 'prajwal@student.com', companyName: 'Tech Solutions', driveTitle: 'Backend Developer Hiring', status: 'shortlisted' },
  { studentEmail: 'aditya@student.com', companyName: 'Tech Solutions', driveTitle: 'Backend Developer Hiring', status: 'selected', salary: 1200000 },
  { studentEmail: 'sneha@student.com', companyName: 'ABC Technologies', driveTitle: 'Software Engineer Campus Drive', status: 'applied' },
  { studentEmail: 'sneha@student.com', companyName: 'Infosys', driveTitle: 'System Engineer Recruitment', status: 'shortlisted' },
  { studentEmail: 'rahul@student.com', companyName: 'Wipro', driveTitle: 'Java Developer Drive', status: 'applied' },
  { studentEmail: 'rahul@student.com', companyName: 'Deloitte', driveTitle: 'Data Analyst Opening', status: 'rejected' },
  { studentEmail: 'ananya@student.com', companyName: 'Deloitte', driveTitle: 'Data Analyst Opening', status: 'selected', salary: 950000 },
  { studentEmail: 'ananya@student.com', companyName: 'Infosys', driveTitle: 'System Engineer Recruitment', status: 'shortlisted' }
];

const seedInterviews = [
  { studentEmail: 'aditya@student.com', companyName: 'Tech Solutions', driveTitle: 'Backend Developer Hiring', round: 'technical', scheduledInDays: 7, status: 'scheduled', location: 'Bengaluru', interviewer: 'Amit Nair', interviewerEmail: 'amit@techsolutions.com', feedback: 'Strong backend fundamentals.', result: 'Pending' },
  { studentEmail: 'sneha@student.com', companyName: 'Infosys', driveTitle: 'System Engineer Recruitment', round: 'hr', scheduledInDays: 9, status: 'scheduled', location: 'Online', interviewer: 'Priya Shah', interviewerEmail: 'priya@infosys.com', joinLink: 'https://meet.infosys.com/sneha-hr' },
  { studentEmail: 'ananya@student.com', companyName: 'Deloitte', driveTitle: 'Data Analyst Opening', round: 'technical', scheduledInDays: -2, status: 'completed', location: 'Mumbai', interviewer: 'Karan Malhotra', interviewerEmail: 'karan@deloitte.com', feedback: 'Excellent analytical skills.', result: 'Selected' }
];

// ----------------------------------------------------------------------------
// Self-healing helpers: always key role profiles to the CURRENT user id so a
// re-seed can never leave profiles pointing at deleted users.
// ----------------------------------------------------------------------------
const upsertStudent = async (userId, data) => {
  const existing = await Student.findOne({ userId });
  if (existing) return existing;
  await Student.deleteMany({ rollNumber: data.rollNumber, userId: { $ne: userId } });
  return Student.create({ userId, ...data });
};

const upsertCompany = async (userId, data) => {
  const existing = await Company.findOne({ userId });
  if (existing) return existing;
  await Company.deleteMany({ companyName: data.companyName, userId: { $ne: userId } });
  return Company.create({ userId, ...data });
};

export const seedDatabase = async (options = {}) => {
  const { reset = false } = options;

  try {
    if (reset) {
      await Promise.all([
        User.deleteMany({}),
        Student.deleteMany({}),
        Company.deleteMany({}),
        PlacementDrive.deleteMany({}),
        Application.deleteMany({}),
        Interview.deleteMany({})
      ]);
      console.log('✓ Database reset complete.');
    }

    // ---- Users (match by email so real registered accounts are untouched) ----
    const userMap = new Map();
    for (const seed of seedUsers) {
      let user = await User.findOne({ email: seed.email });
      if (!user) {
        user = await User.create(seed);
      }
      userMap.set(seed.email, user);
    }

    // ---- Student profiles ----
    for (const seed of seedStudents) {
      const user = userMap.get(seed.userEmail);
      const { userEmail, ...data } = seed;
      await upsertStudent(user._id, data);
    }

    // ---- Company profiles ----
    for (const seed of seedCompanies) {
      const user = userMap.get(seed.userEmail);
      const { userEmail, ...data } = seed;
      await upsertCompany(user._id, data);
    }

    const companies = await Company.find();
    const companyMap = new Map(companies.map((c) => [c.companyName, c]));

    // ---- Placement drives ----
    for (const seed of seedDrives) {
      const company = companyMap.get(seed.companyName);
      if (!company) continue;
      const exists = await PlacementDrive.findOne({ title: seed.title, company: company._id });
      if (exists) continue;
      const { companyName, deadlineInDays, driveInDays, ...data } = seed;
      await PlacementDrive.create({
        ...data,
        company: company._id,
        registrationDeadline: daysFromNow(deadlineInDays),
        driveDate: daysFromNow(driveInDays)
      });
    }

    const drives = await PlacementDrive.find();
    const driveMap = new Map(drives.map((d) => [d.title, d]));
    const students = await Student.find();
    const studentByUserEmail = new Map();
    for (const seed of seedStudents) {
      const user = userMap.get(seed.userEmail);
      const profile = students.find((s) => String(s.userId) === String(user._id));
      if (profile) studentByUserEmail.set(seed.userEmail, profile);
    }

    // ---- Applications ----
    for (const seed of seedApplications) {
      const student = studentByUserEmail.get(seed.studentEmail);
      const company = companyMap.get(seed.companyName);
      const drive = driveMap.get(seed.driveTitle);
      if (!student || !company || !drive) continue;

      let application = await Application.findOne({ student: student._id, placementDrive: drive._id });
      if (!application) {
        application = await Application.create({
          student: student._id,
          placementDrive: drive._id,
          company: company._id,
          status: seed.status,
          salary: seed.salary || drive.salary,
          ctc: seed.salary || drive.salary,
          appliedAt: new Date()
        });
      }

      // Keep placement state consistent with a 'selected' application.
      if (application.status === 'selected' && !student.isPlaced) {
        student.isPlaced = true;
        student.placedCompany = company._id;
        student.salary = application.salary || application.ctc;
        await student.save();
      }
    }

    // ---- Interviews ----
    for (const seed of seedInterviews) {
      const student = studentByUserEmail.get(seed.studentEmail);
      const company = companyMap.get(seed.companyName);
      const drive = driveMap.get(seed.driveTitle);
      if (!student || !company || !drive) continue;

      const exists = await Interview.findOne({ student: student._id, company: company._id, placementDrive: drive._id, round: seed.round });
      if (exists) continue;
      const { studentEmail, companyName, driveTitle, scheduledInDays, ...data } = seed;
      await Interview.create({
        ...data,
        student: student._id,
        company: company._id,
        placementDrive: drive._id,
        scheduledDate: daysFromNow(scheduledInDays)
      });
    }

    if (process.env.NODE_ENV !== 'test') {
      console.log('✓ Seed completed successfully.');
      console.log('  Logins → Admin: admin@placement.com/admin123 | TPO Head: tpohead@placement.com/tpohead123');
      console.log('           Student: prajwal@student.com/student123 | Company: careers@abctech.com/company123');
    }
    return true;
  } catch (error) {
    console.error('Seed error:', error.message);
    return false;
  }
};

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  (async () => {
    try {
      await connectDB();
      await seedDatabase({ reset: true });
      console.log('✓ Standalone seed finished.');
    } catch (error) {
      console.error('Standalone seed failed:', error.message);
      process.exitCode = 1;
    } finally {
      await mongoose.disconnect();
    }
  })();
}

export default seedDatabase;
