import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  rollNumber: {
    type: String,
    unique: true,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  batch: {
    type: String,
    required: true
  },
  cgpa: {
    type: Number,
    default: 0
  },
  resume: {
    type: String,
    default: null
  },
  skills: [String],
  bio: String,
  atsScore: {
    type: Number,
    default: 0
  },
  profileStrength: {
    type: Number,
    default: 0
  },
  isPlaced: {
    type: Boolean,
    default: false
  },
  placedCompany: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    default: null
  },
  salary: {
    type: Number,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Student', studentSchema);
