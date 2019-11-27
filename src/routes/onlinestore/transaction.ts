import { Router } from "express";
import wrapAsync from "../../lib/wrapAsync";
import createError from "../../lib/error/createError";
import User, { UserDocument } from "../../models/User";
import { authorized } from "../../lib/middlewares/auth";
import Product from "../../models/Product";
import OnlinePayment from "../../models/OnlinePayment";
import jwt from "jsonwebtoken";

const router = Router();

router.post(
  "/",
  authorized,
  wrapAsync(async (req, res) => {
    const { _id, productid, amount } = req.body;
    const token = req.headers["x-access-token"];

    if (!_id || !productid || !token) {
      return createError("필수 항목이 존재하지 않습니다.", 400);
    }

    const user = await User.findOne({ _id });

    if (!user) {
      return createError("유저 데이터가 존재하지 않습니다.", 404);
    }

    const product = await Product.findOne({ _id: productid });

    if (user.credit < product.cost * amount) {
      return createError("잔고가 부족합니다.", 403);
    }
    if (amount > product.stock) {
      return createError("재고가 부족합니다.", 400);
    }
    await User.findOneAndUpdate({ _id }, { cost: user.credit - product.cost });

    const onlinePayment = new OnlinePayment({
      issuedBy: _id,
      createdAt: Date.now(),
      product: productid,
      amount
    });
    await onlinePayment.save();

    const paymentToken = jwt.sign();
  })
);

export default router;
