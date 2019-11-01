import { RequestHandler } from "express";
import { validateToken } from "../token";
import createError from "../error/createError";

export const autorized: RequestHandler = (req, res, next) => {
  (async () => {
    const token = req.headers["x-access-token"];
    if (!token) {
      throw createError("x-access-token 헤더가 필요합니다.", 400);
    }
    const user = await validateToken(token as string);
    (req as any).user = user;
    next();
  })().catch(e => {
    next(e);
  });
};
