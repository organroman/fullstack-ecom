import { Router } from "express";
import uploadMiddleWare from "../../middlewares/uploadMiddleware";
import { uploadFiles } from "./uploadController";

const router = Router();

router.post("/", uploadMiddleWare().single("file"), uploadFiles);

export default router;
