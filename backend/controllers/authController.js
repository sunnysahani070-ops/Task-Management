const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '1d', // More secure short-lived token
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      res.status(400);
      throw new Error('Please add all fields');
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }

    // Create user (password hashing is handled by pre-save middleware in User model)
    const user = await User.create({
      name,
      email,
      password,
      isVerified: true, // Automatically verify
    });

    if (user) {
      res.status(201).json({
        message: 'Registration successful! You can now log in.',
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      res.status(400);
      throw new Error('Please add all fields');
    }

    // Check for user by email
    const user = await User.findOne({ email });

    // Check if user exists
    if (!user) {
      res.status(401);
      throw new Error('Invalid email or password');
    }

    // Check if user is verified
    // if (!user.isVerified) {
    //   res.status(401);
    //   throw new Error('Please verify your email before logging in');
    // }

    // Verify password
    if (await bcrypt.compare(password, user.password)) {
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot Password
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(404);
      throw new Error('There is no user with that email');
    }

    // Create a stateless JWT reset token valid for 15 minutes
    // We use the user's current password hash in the secret. 
    // This makes it a one-time use token, because changing the password changes the hash, invalidating the token.
    const secret = process.env.JWT_SECRET + user.password;
    const resetToken = jwt.sign({ id: user._id, email: user.email }, secret, { expiresIn: '15m' });

    // Create reset URL
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetUrl = `${frontendUrl}/reset-password/${user._id}/${resetToken}`;

    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

    try {
      const sendEmail = require('../utils/sendEmail');
      await sendEmail({
        email: user.email,
        subject: 'Password Reset Request',
        message,
        html: `<p>You are receiving this email because you (or someone else) has requested the reset of a password. Please click the link below to reset your password:</p>
               <a href="${resetUrl}" target="_blank">Reset Password</a>
               <p>If you did not request this, please ignore this email.</p>`,
      });

      res.status(200).json({ success: true, data: 'Email sent' });
    } catch (err) {
      console.error(err);
      res.status(500);
      throw new Error('Email could not be sent');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Reset Password
// @route   POST /api/auth/reset-password/:id/:token
// @access  Public
const resetPassword = async (req, res, next) => {
  try {
    const { id, token } = req.params;
    const { password } = req.body;

    const user = await User.findById(id);
    if (!user) {
      res.status(404);
      throw new Error('Invalid user or token');
    }

    const secret = process.env.JWT_SECRET + user.password;

    try {
      // Verify token
      const decoded = jwt.verify(token, secret);

      // Update password
      user.password = password;
      await user.save(); // This triggers the pre('save') hook to hash the new password

      res.status(200).json({
        success: true,
        message: 'Password successfully reset',
      });
    } catch (error) {
      res.status(400);
      throw new Error('Invalid or expired reset token');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Verify Email
// @route   GET /api/auth/verify-email/:token
// @access  Public
const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params;

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      const user = await User.findById(decoded.id);
      if (!user) {
        res.status(404);
        throw new Error('User not found');
      }

      if (user.isVerified) {
        return res.status(200).json({ message: 'Email is already verified' });
      }

      user.isVerified = true;
      await user.save();

      res.status(200).json({ message: 'Email successfully verified' });
    } catch (error) {
      res.status(400);
      throw new Error('Invalid or expired verification token');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  verifyEmail,
};
