import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

router.get("/", async (req: Request, res: Response): Promise<void> => {
  const query = ((req.query.q as string) || "").trim();

  if (!query) {
    res.status(400).json({ message: "Search query (q) is required" });
    return;
  }

  try {
    const companies = await prisma.company.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { industry: { contains: query, mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        name: true,
        industry: true,
        logoUrl: true,
      },
    });

    const tenders = await prisma.tender.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            logoUrl: true,
          },
        },
      },
    });

    res.json({ companies, tenders });
  } catch (error: any) {
    console.error("[SEARCH ERROR]", error);
    res.status(500).json({ message: "Search failed", error: error.message });
  }
});

export default router;
