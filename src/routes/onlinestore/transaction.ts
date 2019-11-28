import { Router } from "express";
import wrapAsync from "../../lib/wrapAsync";
import createError from "../../lib/error/createError";
import User, { UserDocument } from "../../models/User";
import { authorized, adminAuthorized } from "../../lib/middlewares/auth";
import Product from "../../models/Product";
import OnlinePayment from "../../models/OnlinePayment";
import { generateToken } from "../../lib/token";

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

    await User.findOneAndUpdate(
      { _id },
      { $set: { credit: user.credit - product.cost * amount } }
    );

    await Product.findOneAndUpdate(
      { _id: productid },
      { $set: { stock: product.stock - amount } }
    );

    const payload: any = {
      userid: _id,
      product: productid,
      paymentid: onlinePayment._id
    };

    const paymentToken = generateToken(payload);

    res.status(200).json({ token: paymentToken });
  })
);

router.post(
  "/verify",
  adminAuthorized,
  wrapAsync(async (req, res) => {})
);

export default router;
