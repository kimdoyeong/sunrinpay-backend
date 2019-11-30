import { Router } from "express";
import wrapAsync from "../../lib/wrapAsync";
import Store, { StoreDocument } from "../../models/Store";
import { RequiredError, AuthError } from "../../lib/error";
import { storeTokenGenerate } from "../../lib/storeToken";
import { storeAuthorized } from "../../lib/middlewares/auth";
import Payment, { PaymentDocument } from "../../models/Payment";
import User from "../../models/User";
import createError from "../../lib/error/createError";
import Transaction from "../../models/Transaction";

const router = Router();
router.post(
  "/",
  wrapAsync(async (req, res) => {
    const { name, description, id, password } = req.body;
    const store = new Store({
      name,
      description,
      id,
      password
    });
    await store.save();
    res.json({
      success: true
    });
  })
);
router.post(
  "/auth",
  wrapAsync(async (req, res) => {
    const { id, password } = req.body;
    if (!id) throw RequiredError("아이디");
    if (!password) throw RequiredError("비밀번호");

    const store = await Store.findOne({ id });
    if (!store || !(store as any).comparePassword(password)) throw AuthError;

    res.json({
      token: storeTokenGenerate(store)
    });
  })
);
router.post(
  "/progress",
  storeAuthorized,
  wrapAsync(async (req, res) => {
    const store: StoreDocument = (req as any).user;
    const {
      type,
      data,
      price
    }: { type: "QR" | "CODE"; data: string; price: number } = req.body;

    let payment: PaymentDocument;

    if (type === "QR") {
      payment = await Payment.findById(data.replace("sunrinpay:", ""));
    } else {
      payment = await Payment.findOne({ code: data });
    }
    if (!payment) throw createError("없는 결제 정보입니다.", 404);
    const user = await User.findById(payment.issuedBy);
    if (!user) return;
    if (user.credit < price) {
      throw createError("잔액이 부족합니다.", 400);
    }
    await user.updateOne({
      credit: user.credit - price
    });

    const transaction = new Transaction({
      user: user._id,
      store: store._id,
      sum: -price
    });
    await transaction.save();
    await payment.remove();

    res.json({
      success: true
    });
  })
);

export default router;
