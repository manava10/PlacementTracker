import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  placementDrive: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PlacementDrive',
    required: true
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  status: {
    type: String,
    enum: ['applied', 'shortlisted', 'rejected', 'selected'],
    default: 'applied'
  },
  appliedAt: {
    type: Date,
    default: Date.now
  },
  shortlistedAt: Date,
  rejectedAt: Date,
  selectedAt: Date,
  salary: Number,
  ctc: Number
});

// Prevent duplicate applications
applicationSchema.index({ student: 1, placementDrive: 1 }, { unique: true });

export default mongoose.model('Application', applicationSchema);
