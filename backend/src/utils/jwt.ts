import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

export const generateToken = (companyId: string): string => {
  return jwt.sign({ companyId }, JWT_SECRET, { expiresIn: "1d" });
};
