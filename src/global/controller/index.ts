import express from "express";
import { Environment } from "../utils";
import { SettingsController } from "./settings.controller";
import { UploadController } from "./upload.controller";
const router = express.Router();
router.use("/settings", SettingsController);
router.use("/upload", UploadController);

export { router as GlobalRoutes };
