import mongoose from 'mongoose';

const interviewSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  placementDrive: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PlacementDrive'
  },
  round: {
    type: String,
    enum: ['online', 'group discussion', 'technical', 'hr', 'final'],
    required: true
  },
  scheduledDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'passed', 'failed', 'cancelled'],
    default: 'scheduled'
  },
  location: String,
  interviewer: String,
  interviewerEmail: String,
  feedback: String,
  result: String,
  joinLink: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Interview', interviewSchema);
