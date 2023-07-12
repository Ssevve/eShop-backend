import { ZodError, ZodSchema } from 'zod';
import { NextFunction, Request, Response } from 'express';

const validate = (schema: ZodSchema) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse(req.body);
    return next();
  } catch (error) {
    if (error instanceof ZodError) {
      const errorMessages = error.issues.map((issue) => issue.message);
      return res.status(400).json({ errors: errorMessages });
    }
    next(error);
  }
};

export default validate;