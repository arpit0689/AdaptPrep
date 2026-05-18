import { validationResult } from 'express-validator';
import { ApiError } from '../utils/apiError.js';

export const validate = (req, _res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return next(new ApiError(422, 'Please check the highlighted fields', errors.array()));
  next();
};

export const notFound = (req, _res, next) => next(new ApiError(404, `Route not found: ${req.originalUrl}`));

export const errorHandler = (err, _req, res, _next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: statusCode === 500 ? 'Something softened unexpectedly. Please try again.' : err.message,
    details: err.details || null
  });
};
