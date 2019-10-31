import { Router } from "express";
import wrapAsync from "../lib/wrapAsync";
const router = Router();

router.post("/", wrapAsync(async (req, res) => {}));
export default router;
