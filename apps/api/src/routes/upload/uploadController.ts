import cloudinary from "@/cloudinaryConfig";
import { UploadApiErrorResponse, UploadApiResponse } from "cloudinary";
// import cloudinary from "../../../cloudinaryConfig";
import { Request, Response } from "express";

export async function uploadFiles(req: Request, res: Response) {
  try {
    if (!req.file) {
      res.status(400).json({ error: "No file uploaded" });
      return;
    }
    // res.status(200).json({
    //   fileUrl: req.file.path,
    // });
    const file = req.file;
    const mime = file.mimetype || "";
    const ext = mime.split("/")[1]; // e.g. 'jpeg', 'svg+xml'
    const category = (req.body?.category as string) || "general";

    const isSvg = ext === "svg+xml" || ext === "svg";
    const folder = isSvg ? "icons" : category;

    const public_id = `${Date.now()}-${file.originalname}`;

    const options: Record<string, any> = {
      folder,
      public_id,
      resource_type: "image",
    };

    if (isSvg) {
      options.format = "svg";
    } else {
      options.allowed_formats = ["jpg", "png", "svg", "jpeg", "webp"];
    }

    const result: UploadApiResponse = await new Promise<UploadApiResponse>(
      (resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          options,
          (err?: UploadApiErrorResponse, resData?: UploadApiResponse) => {
            if (err) return reject(err);
            if (!resData)
              return reject(new Error("Upload failed with no result"));
            resolve(resData);
          }
        );
        stream.end(file.buffer);
      }
    );

    res.status(200).json({ fileUrl: result?.url });
  } catch (error) {
    res.status(500).send({ message: "Something went wrong", error: error });
  }
}
