import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { requireAuth } from "../middleware/auth";

const prisma = new PrismaClient();
const router = Router();

router.post(
  "/create",
  requireAuth,
  async (req: Request, res: Response): Promise<void> => {
    const companyId = (req as any).companyId;
    console.log("[DEBUG] companyId from token:", companyId); // 👈 this line
    const { title, description, deadline, budget } = req.body;

    if (!title || !description || !deadline || !budget) {
      res.status(400).json({ message: "All tender fields are required" });
      return;
    }

    try {
      const tender = await prisma.tender.create({
        data: {
          title,
          description,
          deadline: new Date(deadline),
          budget: parseInt(budget),
          companyId,
        },
      });

      res.status(201).json(tender);
    } catch (error: any) {
      console.error("Tender Creation Error:", error);
      res.status(500).json({
        message: "Tender creation failed",
        error: error.message,
      });
    }
  }
);

router.get(
  "/me",
  requireAuth,
  async (req: Request, res: Response): Promise<void> => {
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
      res
        .status(500)
        .json({ message: "Failed to fetch company", error: e.message });
    }
  }
);

router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const tenders = await prisma.tender.findMany({
      include: {
        company: {
          select: {
            id: true,
            name: true,
            logoUrl: true,
            industry: true,
          },
        },
      },
      orderBy: {
        deadline: "asc",
      },
    });

    res.json(tenders);
  } catch (error: any) {
    console.error("Tender Fetch Error:", error);
    res.status(500).json({
      message: "Error fetching tenders",
      error: error.message,
    });
  }
});

export default router;
