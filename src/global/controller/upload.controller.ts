import express from "express";
import { ActionRes } from "../model/actionres.model";
import { ErrorResponse } from "../model/errorres.model";
import { UploadService } from "../service/upload.service";
import { Environment } from "../utils";
import { CustomImageUploader } from "../utils/customeruploader";

var environment = new Environment();
const router = express.Router();
router.post(
  "/image",
  CustomImageUploader.single(environment.IMAGE_FIELD || "file"),
  async (req, res, next) => {
    try {
      if (!req.file) {
        throw new ErrorResponse({
          code: ErrorResponse.ErrorCodes.BAD_REQUEST,
          message: "File not supplied",
        });
      }
      var file_name = req.file?.filename;
      var matches = file_name?.match(/^(.+?)_.+?\.(.+)$/i);
      var item: string = "";
      if (matches) {
        item = matches![1] + "." + matches![2];
      } else {
        item = file_name;
      }
      var result: ActionRes<string> = new ActionRes<string>({
        item,
      });
      next(result);
    } catch (error) {
      next(error);
    }
  }
);
router.post("/delete", async (req, res, next) => {
  try {
    // var file_name = req.file.filename;
    // var matches = file_name.match(/^(.+?)_.+?\.(.+)$/i);
    // var item: string = "";
    // if (matches) {
    //   item = matches![1] + "." + matches![2];
    // } else {
    //   item = file_name;
    // }
    var service: UploadService = new UploadService();
    var item: boolean = await service.deleteImage(req.body.item);
    var result: ActionRes<boolean> = new ActionRes<boolean>({
      item,
    });
    next(result);
  } catch (error) {
    next(error);
  }
});

export { router as UploadController };
