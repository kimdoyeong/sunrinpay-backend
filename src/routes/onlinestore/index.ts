import { Router } from "express";
import wrapAsync from "../../lib/wrapAsync";
import { generateToken } from "../lib/token";
import createError from "../../lib/error/createError";
import User, { UserDocument } from "../models/User";
import { authorized } from "../lib/middlewares/auth";

const router = Router();
