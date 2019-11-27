import { Router } from "express";
import wrapAsync from "../../lib/wrapAsync";
import Store from "../../models/Store";
import { RequiredError, AuthError } from "../../lib/error";
import { storeTokenGenerate } from "../../lib/storeToken";

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

export default router;
