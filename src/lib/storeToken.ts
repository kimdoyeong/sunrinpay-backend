import * as jwt from "jsonwebtoken";
import Store, { StoreDocument } from "../models/Store";
import { TokenValidError } from "./error";
import createError from "./error/createError";

export interface StoreToken {
  _id: string;
  name: string;
  id: string;
  type: "store";
}
export function storeTokenGenerate(store: StoreDocument) {
  const { _id, name, id, encKey } = store;
  const data: StoreToken = {
    _id,
    name,
    id,
    type: "store"
  };
  return jwt.sign(data, encKey, {
    expiresIn: "3d"
  });
}
export async function storeTokenVerify(token: string): Promise<StoreDocument> {
  const data: StoreToken = jwt.decode(token) as StoreToken;

  if (data.type !== "store") throw TokenValidError;
  const store = await Store.findById(data._id);
  if (!store) throw TokenValidError;
  try {
    await jwt.verify(token, store.encKey);
  } catch (e) {
    if (e.name === "TokenExpiredError") {
      throw createError("토큰이 만료되었습니다.", 403);
    } else if (e.name === "JsonWebTokenError" || e.name === "NotBeforeError") {
      throw TokenValidError;
    }
    throw e;
  }
  return store;
}
