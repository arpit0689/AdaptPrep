import { asyncHandler } from '../utils/asyncHandler.js';
import { getDashboardAnalytics } from '../services/analyticsService.js';

export const analytics = asyncHandler(async (req, res) => {
  res.json(await getDashboardAnalytics(req.user));
});
