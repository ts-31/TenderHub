import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { requireAuth } from "../middleware/auth";

const prisma = new PrismaClient();
const router = Router();

router.post(
  "/",
  requireAuth,
  async (req: Request, res: Response): Promise<void> => {
    const companyId = (req as any).companyId;
    const { tenderId, proposal } = req.body;

    if (!tenderId || !proposal) {
      res.status(400).json({ message: "tenderId and proposal are required" });
      return;
    }

    try {
      const company = await prisma.company.findUnique({
        where: { id: companyId },
      });
      if (!company) {
        res.status(404).json({ message: "Company not found" });
        return;
      }

      const tender = await prisma.tender.findUnique({
        where: { id: tenderId },
      });
      if (!tender) {
        res.status(404).json({ message: "Tender not found" });
        return;
      }

      if (tender.companyId === company.id) {
        res
          .status(400)
          .json({ message: "You cannot apply to your own tender" });
        return;
      }

      const existing = await prisma.application.findFirst({
        where: { companyId: company.id, tenderId },
      });
      if (existing) {
        res.status(400).json({ message: "You already applied to this tender" });
        return;
      }

      const application = await prisma.application.create({
        data: {
          proposal,
          tenderId,
          companyId: company.id,
        },
      });

      res.status(201).json(application);
    } catch (error: any) {
      console.error("Application Error:", error);
      res.status(500).json({
        message: "Error submitting proposal",
        error: error.message,
      });
    }
  }
);

router.get("/", async (req: Request, res: Response): Promise<void> => {
  const { tenderId } = req.query;

  if (!tenderId) {
    res.status(400).json({ message: "tenderId is required" });
    return;
  }

  try {
    const applications = await prisma.application.findMany({
      where: { tenderId: tenderId as string },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            industry: true,
            logoUrl: true,
          },
        },
      },
    });

    res.json(applications);
  } catch (error: any) {
    console.error("Fetch Error:", error);
    res.status(500).json({
      message: "Error fetching applications",
      error: error.message,
    });
  }
});

export default router;
