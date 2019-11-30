import { Router } from "express";
import wrapAsync from "../../lib/wrapAsync";
import createError from "../../lib/error/createError";
import User, { UserDocument } from "../../models/User";
import { authorized } from "../../lib/middlewares/auth";
import OnlineStore from "../../models/Product";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    let sendArray: Array<Object> = new Array();
    const onlineStore: Array<Object> = await OnlineStore.find();
    if (!onlineStore) {
      createError("데이터가 없습니다.", 404);
    }
    onlineStore.map((data: any) => {
      if (data.stock !== 0) {
        sendArray.push(data);
      }
    });
    res.status(200).json({ data: sendArray });
  } catch (error) {
    next(error);
  }
});

router.get("/:product", async (req, res, next) => {
  const product = req.params.product;

  try {
    const onlineStoreData: Object = await OnlineStore.findOne({
      title: product
    });
    if (!onlineStoreData) {
      return createError("데이터가 없습니다.", 404);
    }
    res.status(200).json({ data: onlineStoreData });
  } catch (error) {
    next(error);
  }
});

export default router;
