import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { ApiError } from '../utils/apiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

export const register = asyncHandler(async (req, res) => {
  const exists = await User.findOne({ email: req.body.email });
  if (exists) throw new ApiError(409, 'An account already exists for this email');
  const user = await User.create(req.body);
  res.status(201).json({ token: signToken(user._id), user: user.publicProfile() });
});

export const login = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email }).select('+password');
  if (!user || !(await user.comparePassword(req.body.password))) throw new ApiError(401, 'Invalid email or password');
  res.json({ token: signToken(user._id), user: user.publicProfile() });
});

export const me = asyncHandler(async (req, res) => {
  res.json({ user: req.user.publicProfile() });
});
