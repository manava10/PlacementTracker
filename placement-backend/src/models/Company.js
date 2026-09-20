import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  companyName: {
    type: String,
    required: true,
    unique: true
  },
  website: String,
  location: String,
  industry: String,
  description: String,
  hrName: String,
  hrPhone: String,
  hrEmail: String,
  logo: String,
  isVerified: {
    type: Boolean,
    default: false
  },
  totalPositions: {
    type: Number,
    default: 0
  },
  filledPositions: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Company', companySchema);
