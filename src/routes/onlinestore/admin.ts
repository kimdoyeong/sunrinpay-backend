import { Router } from "express";
import wrapAsync from "../../lib/wrapAsync";
import createError from "../../lib/error/createError";
import User, { UserDocument } from "../../models/User";
import { authorized } from "../../lib/middlewares/auth";
import OnlineStore from "../../models/Product";

const router = Router();

export default router;
