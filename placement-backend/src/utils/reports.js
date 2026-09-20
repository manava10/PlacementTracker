import Student from '../models/Student.js';
import Company from '../models/Company.js';
import PlacementDrive from '../models/PlacementDrive.js';
import Application from '../models/Application.js';
import Interview from '../models/Interview.js';

const PACKAGE_BOUNDARIES = [0, 500000, 800000, 1200000];
const PACKAGE_LABELS = ['Below ₹5 LPA', '₹5 - ₹8 LPA', '₹8 - ₹12 LPA', 'Above ₹12 LPA'];

export const buildPlacementReport = async () => {
  const totalStudents = await Student.countDocuments();
  const placedStudents = await Student.countDocuments({ isPlaced: true });
  const unplacedStudents = totalStudents - placedStudents;
  const placementRate = totalStudents > 0
    ? Number(((placedStudents / totalStudents) * 100).toFixed(1))
    : 0;

  const salaryAgg = await Student.aggregate([
    { $match: { isPlaced: true, salary: { $ne: null, $gt: 0 } } },
    { $group: { _id: null, averagePackage: { $avg: '$salary' }, highestPackage: { $max: '$salary' } } }
  ]);
  const averagePackage = Math.round(salaryAgg[0]?.averagePackage || 0);
  const highestPackage = salaryAgg[0]?.highestPackage || 0;

  const totalCompanies = await Company.countDocuments();
  const verifiedCompanies = await Company.countDocuments({ isVerified: true });
  const totalDrives = await PlacementDrive.countDocuments();
  const activeDrives = await PlacementDrive.countDocuments({ status: { $in: ['upcoming', 'ongoing'] } });
  const totalApplications = await Application.countDocuments();
  const totalInterviews = await Interview.countDocuments();

  const buckets = await Student.aggregate([
    { $match: { isPlaced: true, salary: { $ne: null, $gt: 0 } } },
    {
      $bucket: {
        groupBy: '$salary',
        boundaries: [...PACKAGE_BOUNDARIES, Number.MAX_SAFE_INTEGER],
        default: 'other',
        output: { count: { $sum: 1 } }
      }
    }
  ]);
  const packageDistribution = PACKAGE_LABELS.map((label) => ({ label, count: 0 }));
  buckets.forEach((bucket) => {
    const index = PACKAGE_BOUNDARIES.indexOf(bucket._id);
    if (index >= 0) packageDistribution[index].count = bucket.count;
  });

  const topCompanies = await Application.aggregate([
    {
      $group: {
        _id: '$company',
        applicants: { $sum: 1 },
        placed: { $sum: { $cond: [{ $eq: ['$status', 'selected'] }, 1, 0] } }
      }
    },
    { $lookup: { from: 'companies', localField: '_id', foreignField: '_id', as: 'company' } },
    { $unwind: '$company' },
    { $project: { _id: 0, name: '$company.companyName', applicants: 1, placed: 1 } },
    { $sort: { placed: -1, applicants: -1 } },
    { $limit: 5 }
  ]);

  return {
    totalStudents,
    placedStudents,
    unplacedStudents,
    placementRate,
    averagePackage,
    averageSalary: averagePackage,
    highestPackage,
    totalCompanies,
    verifiedCompanies,
    totalDrives,
    activeDrives,
    totalApplications,
    totalInterviews,
    packageDistribution,
    topCompanies,
    timestamp: new Date()
  };
};

export const attachApplicantCounts = async (drives) => {
  const counts = await Application.aggregate([
    { $group: { _id: '$placementDrive', count: { $sum: 1 } } }
  ]);
  const countMap = new Map(counts.map((c) => [String(c._id), c.count]));
  return drives.map((drive) => {
    const plain = typeof drive.toObject === 'function' ? drive.toObject() : drive;
    return { ...plain, applicantCount: countMap.get(String(plain._id)) || 0 };
  });
};
