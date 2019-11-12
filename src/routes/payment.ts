import { Router } from "express";
import wrapAsync from "../lib/wrapAsync";
import { autorized } from "../lib/middlewares/auth";
import { generatePaymentToken } from "../lib/paymentToken";

const router = Router();

router.post(
  "/qr",
  autorized,
  wrapAsync(async (req, res) => {
    const { user } = req as any;
    const token = await generatePaymentToken(user._id);

    res.json({
      token
    });
  })
);
export default router;
