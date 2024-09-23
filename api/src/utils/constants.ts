export const JWT_KEY = process.env.JWT_KEY || 'secret';
export const TASK_STATUS = ['pending', 'in progress', 'completed'];
export const PORT = process.env.PORT || 3000;
export const MONGO_URI = process.env.MONGO_URI || '';
export const RATE_LIMITER_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
export const MAX_AGE_JWT_COOKIE = 30 * 60 * 1000; // 30 minutes