import { Router } from "express";
import wrapAsync from "../lib/wrapAsync";
import { generateToken } from "../lib/token";
import createError from "../lib/error/createError";
import User, { UserDocument } from "../models/User";
import { authorized } from "../lib/middlewares/auth";
import Transaction from "../models/Transaction";

const router = Router();

router.post(
  "/",
  wrapAsync(async (req, res) => {
    const { id, password } = req.body;

    if (!id || !password) {
      throw createError("필수 항목이 없습니다.", 400);
    }
    const user: UserDocument = await User.findOne({
      id
    });

    const userNotFoundError = createError(
      "아이디가 없거나 비밀번호가 다릅니다.",
      404
    );

    if (!user || !user.comparePassword(password)) throw userNotFoundError;

    const { _id, name, no } = user;
    const token = await generateToken({
      _id,
      name,
      no
    });

    res.json({
      token
    });
  })
);

router.get(
  "/",
  authorized,
  wrapAsync(async (req, res) => {
    const _id = (req as any).user._id;
    const user = await User.findById(_id, [
      "name",
      "no",
      "id",
      "permission",
      "credit"
    ]);

    res.json({ user });
  })
);
router.get(
  "/transactions",
  authorized,
  wrapAsync(async (req, res) => {
    const { _id } = (req as any).user;
    const transactions = await Transaction.find(
      {
        user: _id
      },
      ["store", "sum", "at"]
    )
      .populate("store", ["name"])
      .sort("-at");

    res.json({
      data: transactions
    });
  })
);
export default router;
