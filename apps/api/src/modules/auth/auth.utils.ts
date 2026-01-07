import jwt from "jsonwebtoken";
import { jwtConfig } from "../../config/jwt.js";

export interface JwtPayload {
  id: string;
  role?: "ADMIN" | "USER";
}

export const signAccessToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, jwtConfig.accessSecret, {
    expiresIn: jwtConfig.accessExpiry as any
  });
};

export const signRefreshToken = (payload: Pick<JwtPayload, "id">): string => {
  return jwt.sign(payload, jwtConfig.refreshSecret, {
    expiresIn: jwtConfig.refreshExpiry as any
  });
};
