import bcrypt from "bcrypt";
import { db } from "../../config/db.js";
import { signAccessToken, signRefreshToken } from "./auth.utils.js";

export interface User {
  id: string;
  email: string;
  fullName: string;
  password: string;
  role: "ADMIN" | "USER";
}

export const registerUser = async (
  email: string,
  password: string,
  fullName: string,
  role: "ADMIN" | "USER" = "USER"
): Promise<void> => {
  const hashedPassword = await bcrypt.hash(password, 10);

  // Note: Using 'full_name' as requested, ensure this column exists in your DB.
  await db.query(
    "INSERT INTO users (email, password, full_name, role) VALUES ($1, $2, $3, $4)",
    [email, hashedPassword, fullName, role]
  );
};

export const loginUser = async (user: any) => {
  return {
    accessToken: signAccessToken({ id: user.id || user.ID, role: user.role || user.ROLE }),
    refreshToken: signRefreshToken({ id: user.id || user.ID })
  };
};
