import { Router } from "express";

import { uploadFiles } from "./uploadController";
import uploadMiddleWare from "../../middlewares/uploadMiddleware";

const router = Router();

router.post("/", uploadMiddleWare().single("file"), uploadFiles);

export default router;
