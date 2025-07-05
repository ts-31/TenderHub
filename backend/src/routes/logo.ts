import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { requireAuth } from "../middleware/auth";
import { upload } from "../middleware/upload";
import { supabase } from "../utils/supabase";

const router = Router();
const prisma = new PrismaClient();

router.post(
  "/companies/:id/logo",
  requireAuth,
  upload.single("logo"),
  async (req: Request, res: Response): Promise<void> => {
    const companyId = req.params.id;
    const file = req.file;

    if (!file) {
      console.warn("[UPLOAD] No file received in request");
      res.status(400).json({ message: "No logo file uploaded" });
      return;
    }

    const fileName = `logo-${companyId}-${Date.now()}.png`;
    const bucket = "company-logos";

    console.log(
      `[UPLOAD] Uploading ${fileName} to Supabase bucket "${bucket}"`
    );

    try {
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
          upsert: true,
        });

      if (uploadError) {
        console.error("[SUPABASE UPLOAD ERROR]", uploadError);
        res.status(500).json({
          message: "Upload to Supabase failed",
          error: uploadError.message || uploadError,
        });
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      const logoUrl = publicUrlData.publicUrl;
      console.log(`[UPLOAD SUCCESS] File URL: ${logoUrl}`);

      const company = await prisma.company.update({
        where: { id: companyId },
        data: { logoUrl },
      });

      res.status(200).json(company);
    } catch (err: any) {
      console.error("[UNEXPECTED ERROR]", err);
      res.status(500).json({
        message: "Unexpected error occurred during logo upload",
        error: err.message || err,
      });
    }
  }
);

export default router;
