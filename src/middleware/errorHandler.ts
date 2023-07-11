import { NextFunction, Request, Response } from 'express';
import MessageResponse from '../types/MessageResponse';

interface ErrorResponse extends MessageResponse {
  stack?: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function errorHandler(err: Error, req: Request, res: Response<ErrorResponse>, next: NextFunction) {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '' : err.stack,
  });
}

export default errorHandler;