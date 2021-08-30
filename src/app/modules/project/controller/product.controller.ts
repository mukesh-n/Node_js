import express from "express";
import { ActionRes } from "../../../../global/model/actionres.model";
import { product, productWrapper } from "../models/product.model";
import { productService } from "../service/product.service";
const router = express.Router();
router.get("/entity", async (req, res, next) => {
        try {
          var result: ActionRes<product> = new ActionRes<product>({
            item: new product(),
          });
          next(result);
        } catch (error) {
          next(error);
        }
      });
router.post("/get", async (req, res, next) => {
  try {
    var result: ActionRes<Array<product>> = new ActionRes<
      Array<product>
    >();
    var service: productService = new productService();
    result.item = await service.select(req.body.item);
    next(result);
  } catch (error) {
    next(error);
  }
});
router.post("/insert", async (req, res, next) => {
        try {
          var result: ActionRes<product> = new ActionRes<product>();
          var service: productService = new productService();
          result.item = await service.insert(req.body.item);
          next(result);
        } catch (error) {
          next(error);
        }
      });
router.post("/update", async (req, res, next) => {
        try {
          var result: ActionRes<product> = new ActionRes<product>();
          var service: productService = new productService();
          result.item = await service.update(req.body.item);
          next(result);
        } catch (error) {
          next(error);
        }
      });
router.post("/delete", async (req, res, next) => {
        try {
          var result: ActionRes<product> = new ActionRes<product>();
          var service: productService = new productService();
          result.item = await service.delete(req.body.item);
          next(result);
        } catch (error) {
          next(error);
        }
      });
      export { router as productController}
