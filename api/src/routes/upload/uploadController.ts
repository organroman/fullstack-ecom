import { Request, Response } from "express";

export async function uploadFiles(req: Request, res: Response) {
  try {
    if (!req.file) {
      res.status(400).json({ error: "No file uploaded" });
      return;
    }
    res.status(200).json({
      fileUrl: req.file.path,
    });
  } catch (error) {
    res.status(500).send(error);
  }
}
