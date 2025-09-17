import multer from "multer";

export type UploadMeta = {
  folder: string;
  public_id: string;
  format?: string;
  allowed_formats?: string[];
};

function uploadMiddleWare() {
  // const storage = new CloudinaryStorage({
  //   cloudinary,
  //   params: async (req, file) => {
  //     try {
  //       const fileExtension = file.mimetype.split("/")[1];
  //       const category = req.body.category || "general";
  //       const folderName =
  //         fileExtension === "svg+xml" || fileExtension === "svg"
  //           ? "icons"
  //           : category;

  //       if (fileExtension === "svg+xml" || fileExtension === "svg") {
  //         return {
  //           folder: folderName,
  //           format: "svg",
  //           public_id: `${Date.now()}-${file.originalname}`,
  //         };
  //       }
  //       return {
  //         folder: folderName,
  //         allowed_formats: ["jpg", "png", "svg", "jpeg", "webp"],
  //         public_id: `${Date.now()}-${file.originalname}`,
  //       };
  //     } catch (error) {
  //       console.error("Error in CloudinaryStorage params:", error);
  //       throw error;
  //     }
  //   },
  // });

  return multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  });
}

export default uploadMiddleWare;
