import { Router, Request, Response } from "express";
import multer from "multer";
import { uploadFilesToFolder } from "../controllers/drive.controller";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// POST /api/drive/upload-image
router.post(
  "/upload-image",
  upload.single("image"),
  async (req: Request, res: Response) => {
    try {
      const file = req.file;
      const { materialId, materialName } = req.body;
      const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

      if (!file) {
        return res.status(400).json({ error: "No image uploaded" });
      }

      if (!materialName) {
        return res
          .status(400)
          .json({ error: "Material name is required" });
      }

      if (!folderId) {
        return res
          .status(500)
          .json({ error: "Google Drive folder not configured" });
      }

      const links = await uploadFilesToFolder([file], folderId);
      res.json({
        success: true,
        imageUrl: links[0],
        materialId: materialId || null,
        materialName,
      });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ error: "Failed to upload image" });
    }
  }
);

export default router;
