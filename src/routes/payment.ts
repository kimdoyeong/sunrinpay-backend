import { Router } from "express";
import wrapAsync from "../lib/wrapAsync";
import { authorized } from "../lib/middlewares/auth";
import { createPayment } from "../lib/createPayment";

const router = Router();

router.post(
  "/qr",
  authorized,
  wrapAsync(async (req, res) => {
    const { user } = req as any;
    const data = await createPayment(user._id);

    res.json(data);
  })
);
export default router;
