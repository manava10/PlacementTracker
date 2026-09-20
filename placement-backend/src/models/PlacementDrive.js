import mongoose from 'mongoose';

const placementDriveSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  positions: {
    type: Number,
    required: true
  },
  salary: {
    type: Number,
    required: true
  },
  location: String,
  jobRole: String,
  jobType: {
    type: String,
    default: 'Full Time'
  },
  eligibility: {
    minCGPA: {
      type: Number,
      default: 0
    },
    departments: [String],
    batches: [String]
  },
  registrationDeadline: Date,
  driveDate: Date,
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'upcoming'
  },
  requirements: [String],
  benefits: [String],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('PlacementDrive', placementDriveSchema);
