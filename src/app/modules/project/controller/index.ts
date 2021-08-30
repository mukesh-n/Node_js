import express from "express";
import { Environment } from "../../../../global/utils";
import { UsersController } from "./users.controller";
import { productController } from "./product.controller";
const router = express.Router();
const environment = Environment.getInstance();

router.use("/User", UsersController);
router.use("/product", productController)

export { router as ProjectRoutes };