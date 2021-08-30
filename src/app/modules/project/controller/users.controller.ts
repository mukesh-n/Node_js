import express from "express";
import { ActionRes } from "../../../../global/model/actionres.model";
import { Users, UsersWrapper } from "../models/users.model";
import { UsersService } from "../service/users.service";
const router = express.Router();
router.get("/entity", async (req, res, next) => {
        try {
          var result: ActionRes<Users> = new ActionRes<Users>({
            item: new Users(),
          });
          next(result);
        } catch (error) {
          next(error);
        }
      });
router.post("/get", async (req, res, next) => {
  try {
    var result: ActionRes<Array<Users>> = new ActionRes<
      Array<Users>
    >();
    var service: UsersService = new UsersService();
    result.item = await service.select(req.body.item);
    next(result);
  } catch (error) {
    next(error);
  }
});
router.post("/insert", async (req, res, next) => {
        try {
          var result: ActionRes<Users> = new ActionRes<Users>();
          var service: UsersService = new UsersService();
          result.item = await service.insert(req.body.item);
          next(result);
        } catch (error) {
          next(error);
        }
      });
router.post("/update", async (req, res, next) => {
        try {
          var result: ActionRes<Users> = new ActionRes<Users>();
          var service: UsersService = new UsersService();
          result.item = await service.update(req.body.item);
          next(result);
        } catch (error) {
          next(error);
        }
      });
router.post("/delete", async (req, res, next) => {
        try {
          var result: ActionRes<Users> = new ActionRes<Users>();
          var service: UsersService = new UsersService();
          result.item = await service.delete(req.body.item);
          next(result);
        } catch (error) {
          next(error);
        }
      });
      export { router as UsersController}
