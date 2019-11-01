import * as jwt from "jsonwebtoken";
import createError from "./error/createError";

interface tokenData {
  _id: string;
  name: string;
  no: number;
}
const TOKEN_KEY = process.env.TOKEN_KEY || "token_key13456";
export function generateToken(data: tokenData) {
  return new Promise((resolve, reject) => {
    jwt.sign(data, TOKEN_KEY, (err, token) => {
      if (err) {
        return reject(err);
      }
      return resolve(token);
    });
  });
}

export function validateToken(token: string) {
  return new Promise<object>((resolve, reject) => {
    jwt.verify(token, TOKEN_KEY, (err, data) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          reject(createError("토큰이 만료되었습니다.", 403));
        } else if (
          err.name === "JsonWebTokenError" ||
          err.name === "NotBeforeError"
        ) {
          console.error(err);
          reject(createError("잘못된 토큰입니다.", 400));
        } else {
          reject(err);
        }
        return;
      }

      resolve(data as object);
    });
  });
}
