import { NextFunction, Request, Response } from "express";
export const mockAuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  (req as any).user = { userId: "12345" }; // Mock user ID
  next();
};
