import { Request, Response, NextFunction } from 'express';
import { ErrorRequestHandler } from 'express';

export const errorHandler: ErrorRequestHandler = (
  err: Error & { status?: number },
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const statusCode = err.status || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    error: message,
  });
};
