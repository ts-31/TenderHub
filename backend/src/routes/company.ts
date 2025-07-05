import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { requireAuth } from "../middleware/auth";
import { generateToken } from "../utils/jwt";

const prisma = new PrismaClient();
const router = Router();

router.post("/signup", async (req: Request, res: Response) => {
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
  } catch (e: any) {
    res.status(400).json({ message: "Signup failed", error: e.message });
  }
});

router.post("/signin", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const company = await prisma.company.findUnique({ where: { email } });

    if (!company) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    const isValid = await bcrypt.compare(password, company.password);
    if (!isValid) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    const token = generateToken(company.id);
    res.json({ token });
  } catch (e: any) {
    console.error("[Signin Error]", e);
    res.status(500).json({ message: "Signin failed", error: e.message });
  }
});

router.get("/me", requireAuth, async (req: Request, res: Response) => {
  const companyId = (req as any).companyId;

  try {
    const company = await prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      res.status(404).json({ message: "Company not found" });
      return;
    }

    res.json(company);
  } catch (e: any) {
    console.error("[Company Me Error]", e);
    res.status(500).json({ message: "Fetch failed", error: e.message });
  }
});

router.get("/", async (_req: Request, res: Response) => {
  try {
    const companies = await prisma.company.findMany({
      select: {
        id: true,
        name: true,
        industry: true,
        description: true,
        logoUrl: true,
      },
    });

    res.json(companies);
  } catch (e: any) {
    res
      .status(500)
      .json({ message: "Error fetching companies", error: e.message });
  }
});

export default router;
