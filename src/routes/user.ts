import { Router } from "express";
import wrapAsync from "../lib/wrapAsync";
import User from "../models/User";
const router = Router();

router.post(
  "/",
  wrapAsync(async (req, res) => {
    const { id, password, name, no } = req.body;
    const user = new User({
      id,
      password,
      name,
      no
    });
    await user.save();

    res.json({
      success: true
    });
  })
);
router.get("/", (req, res) => {
  res.send("Test");
});
export default router;
