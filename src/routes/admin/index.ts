import { Router } from "express";
import { adminAuthorized } from "../../lib/middlewares/auth";
import wrapAsync from "../../lib/wrapAsync";
import User from "../../models/User";

const router = Router();

router.get(
  "/user",
  adminAuthorized,
  wrapAsync(async (req, res) => {
    const user = await User.find({}, ["name", "permission", "no"]);
    res.json(user);
  })
);

export default router;
