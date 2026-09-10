import jwt from 'jsonwebtoken';
import { ResponseFactory } from '../factories/ResponseFactory.js';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    // If token is missing, attempt to extract custom header for persona simulator fallback
    const mockUserId = req.headers['x-persona-user-id'];
    if (mockUserId) {
      req.user = { userId: mockUserId, role: mockUserId === 'admin' ? 'admin' : 'student' };
      return next();
    }
    return ResponseFactory.error(res, 'Authentication token required.', 401, 'UNAUTHORIZED');
  }

  try {
    const secret = process.env.JWT_SECRET || 'skillnexus_super_secret_key_2026_webcraft';
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (err) {
    return ResponseFactory.error(res, 'Invalid or expired token.', 403, 'FORBIDDEN');
  }
};

export const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return ResponseFactory.error(res, 'Admin privileges required for this endpoint.', 403, 'ADMIN_REQUIRED');
  }
  next();
};
