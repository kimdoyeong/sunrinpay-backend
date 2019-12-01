import { Router } from "express";
import wrapAsync from "../../lib/wrapAsync";
import createError from "../../lib/error/createError";
import User, { UserDocument } from "../../models/User";
import { authorized, adminAuthorized } from "../../lib/middlewares/auth";
import Product from "../../models/Product";
import OnlinePayment from "../../models/OnlinePayment";
import { generateToken, validateToken } from "../../lib/token";
import {
  onlineStoreTokenGenerate,
  onlineStoreTokenVerify
} from "../../lib/onlineStoreToken";
import * as jwt from "jsonwebtoken";

const router = Router();

router.post("/", authorized, async (req, res, next) => {
  try {
    const { product, amount } = req.body;
    const token: any = req.headers["x-access-token"];
    if (!token || !product || !amount) {
      return createError("필수 항목이 존재하지 않습니다.", 400);
    }
    let tokenvalue: any;
    try {
      tokenvalue = await validateToken(token);
    } catch (error) {
      throw error;
    }

    const user = await User.findOne({ _id: tokenvalue._id });
    if (!user) {
      throw createError("유저 데이터가 존재하지 않습니다.", 404);
    }
    const productdata = await Product.findOne({ title: product });

    if (user.credit < productdata.cost * amount) {
      throw createError("잔고가 부족합니다.", 403);
    }
    if (amount > productdata.stock) {
      throw createError("재고가 부족합니다.", 400);
    }

    const onlinePayment = new OnlinePayment({
      issuedBy: tokenvalue._id,
      createdAt: Date.now(),
      product: productdata._id,
      amount
    });

    await onlinePayment.save();

    const userRemainCredit: number = user.credit - productdata.cost * amount;

    await User.findOneAndUpdate(
      { _id: user._id },
      { $set: { credit: userRemainCredit } }
    );

    const productRemainStock: number = productdata.stock - amount;
    await Product.findOneAndUpdate(
      { _id: productdata._id },
      { $set: { stock: productRemainStock } }
    );

    const payload: any = {
      userid: user._id,
      product: productdata._id,
      paymentid: onlinePayment._id,
      type: "onlinestore"
    };

    const paymentToken = onlineStoreTokenGenerate(payload);

    await OnlinePayment.findOneAndUpdate(
      { _id: onlinePayment._id },
      { $set: { token: paymentToken } }
    );

    res.status(200).json({ token: paymentToken });
  } catch (error) {
    next(error);
  }
});

router.post(
  "/recieve",
  adminAuthorized,
  wrapAsync(async (req, res) => {
    const token: string = req.headers["x-access-token"].toString();
    if (!token) throw createError("필수 항목이 존재하지 않습니다.", 400);

    const tokenValue: any = await onlineStoreTokenVerify(token);

    const onlinePayment = await OnlinePayment.findOne({
      _id: tokenValue.paymentid
    });
    if (onlinePayment.accepted === true) {
      throw createError("이미 사용된 코드입니다.", 403);
    }
    await OnlinePayment.findOneAndUpdate(
      { _id: tokenValue.paymentid },
      {
        $set: {
          accepted: true
        }
      }
    );

    res.status(200).json(...tokenValue);
  })
);

export default router;
