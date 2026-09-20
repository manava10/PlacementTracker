import crypto from 'crypto';
import User from '../models/User.js';
import Student from '../models/Student.js';
import Company from '../models/Company.js';
import jwt from 'jsonwebtoken';

const signToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

export const register = async (req, res) => {
  try {
    const { name, email, password, role, additionalData } = req.body;

    const allowedRoles = ['student', 'company'];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ error: 'Registration is only allowed for student or company accounts.' });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role
    });

    // Create role-specific data
    if (role === 'student') {
      await Student.create({
        userId: user._id,
        rollNumber: additionalData?.rollNumber || `ROLL-${Date.now()}`,
        department: additionalData?.department || 'General',
        batch: additionalData?.batch || new Date().getFullYear().toString(),
        cgpa: additionalData?.cgpa != null ? Number(additionalData.cgpa) : 0,
        skills: Array.isArray(additionalData?.skills) ? additionalData.skills : [],
        bio: additionalData?.bio || ''
      });
    } else if (role === 'company') {
      await Company.create({
        userId: user._id,
        companyName: additionalData?.companyName || name,
        hrName: additionalData?.hrName || name,
        hrEmail: additionalData?.hrEmail || email,
        hrPhone: additionalData?.hrPhone || '',
        industry: additionalData?.industry || '',
        location: additionalData?.location || '',
        website: additionalData?.website || '',
        description: additionalData?.description || ''
      });
    }

    // Generate token
    const token = signToken(user._id, user.role);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email and password
    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide an email and password' });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = signToken(user._id, user.role);

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Please provide your email address.' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ message: 'If an account exists, reset instructions will be sent.' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.passwordResetExpires = Date.now() + 60 * 60 * 1000;
    await user.save();

    res.json({
      message: 'If an account exists, reset instructions will be sent.'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, token, password } = req.body;

    if (!email || !token || !password) {
      return res.status(400).json({ error: 'Email, token, and new password are required.' });
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
      email,
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    }).select('+passwordResetToken +passwordResetExpires');

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired reset token.' });
    }

    user.password = password;
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    await user.save();

    res.json({ message: 'Password reset successful. You can now log in with your new password.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
