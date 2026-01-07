import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { jwtConfig } from "../../../config/jwt.js";

export interface AuthRequest extends Request {
  user?: { id: string; role: "ADMIN" | "USER" };
}

export const authMiddleware = (
  req: AuthRequest,
  _: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return next();

  const token = authHeader.split(" ")[1];
  if (!token) return next();

  try {
    req.user = jwt.verify(token, jwtConfig.accessSecret) as AuthRequest["user"];
  } catch {
    req.user = undefined;
  }

  next();
};
