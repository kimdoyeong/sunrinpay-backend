import { Router } from "express";
import wrapAsync from "../../lib/wrapAsync";
import createError from "../../lib/error/createError";
import User, { UserDocument } from "../../models/User";
import { authorized } from "../../lib/middlewares/auth";
import OnlineStore from "../../models/Product";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    //재고처리 해줘야함!
    const onlineStore: Array<Object> = await OnlineStore.find();
    if (!onlineStore) {
      createError("데이터가 없습니다.", 404);
    }
    res.status(200).json({ data: onlineStore });
  } catch (error) {
    next(error);
  }
});

export default router;