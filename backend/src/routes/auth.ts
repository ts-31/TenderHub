import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { generateToken } from "../utils/jwt";

const prisma = new PrismaClient();
const router = Router();

router.post("/signup", async (req: Request, res: Response): Promise<void> => {
  const { email, password, name, industry, description } = req.body;

  if (!email || !password || !name || !industry || !description) {
    res.status(400).json({ message: "All fields are required" });
    return;
  }

  try {
    const hash = await bcrypt.hash(password, 10);

    const company = await prisma.company.create({
      data: {
        email,
        password: hash,
        name,
        industry,
        description,
      },
    });

    const token = generateToken(company.id);
    res.json({ token });
  } catch (error: any) {
    console.error("Signup Error:", error);
    if (error.code === "P2002" && error.meta?.target?.includes("email")) {
      res.status(400).json({ message: "Email already exists" });
    } else {
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  }
});

router.post("/signin", async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const company = await prisma.company.findUnique({ where: { email } });

    if (!company || !(await bcrypt.compare(password, company.password))) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const token = generateToken(company.id);
    res.json({ token });
  } catch (error: any) {
    console.error("Signin Error:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

export default router;
