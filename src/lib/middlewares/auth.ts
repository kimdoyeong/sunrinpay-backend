import { RequestHandler } from "express";
import { validateToken } from "../token";
import createError from "../error/createError";
import User from "../../models/User";

const headerUndefinedError = createError(
  "x-access-token 헤더가 필요합니다.",
  400
);
export const autorized: RequestHandler = (req, res, next) => {
  (async () => {
    const token = req.headers["x-access-token"];
    if (!token) {
      throw headerUndefinedError;
    }
    const user = await validateToken(token as string);
    (req as any).user = user;
    next();
  })().catch(e => {
    next(e);
  });
};

export const adminAutorized: RequestHandler = (req, res, next) => {
  (async () => {
    const token = req.headers["x-access-token"];
    if (!token) throw headerUndefinedError;
    const user = await validateToken(token as string);
    const userdata = await User.findOne({
      _id: user._id,
      permission: {
        $in: "admin"
      }
    });

    if (!userdata) {
      throw createError("유저 권한이 없습니다.", 403);
    }
    next();
  })().catch(e => next(e));
};
