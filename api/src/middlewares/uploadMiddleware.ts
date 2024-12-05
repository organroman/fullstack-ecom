import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../../cloudinaryConfig";

function uploadMiddleWare() {
  const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
      const fileExtension = file.mimetype.split("/")[1];
      const category = req.body.category || "general";
      const folderName = fileExtension === "svg" ? "icons" : category;
      return {
        folder: folderName,
        allowed_formats: ["jpg", "png", "svg", "jpeg"],
        public_id: `${Date.now()}-${file.originalname}`,
      };
    },
  });

  return multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  });
}

export default uploadMiddleWare;
