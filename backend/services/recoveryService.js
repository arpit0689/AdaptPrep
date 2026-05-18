import User from '../models/User.js';
import { rebalanceFutureTasks } from './roadmapService.js';
import { createNotification } from './notificationService.js';

export const activateRecoveryMode = async (userId, reason = 'consistency') => {
  const user = await User.findByIdAndUpdate(userId, { recoveryMode: true }, { new: true });
  if (!user) return null;
  const result = await rebalanceFutureTasks(user);
  await createNotification({
    userId,
    type: 'recovery',
    title: 'Your roadmap has been gently rebalanced',
    message: "Let's recover gradually with a calmer plan for the next few days.",
    scheduledFor: new Date(),
    metadata: { reason, ...result }
  });
  return { user, ...result };
};
