import { ResponseFactory } from '../factories/ResponseFactory.js';

export const errorHandler = (err, req, res, next) => {
  console.error('[API Error]:', err);
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return ResponseFactory.error(res, message, statusCode, 'SERVER_ERROR');
};
