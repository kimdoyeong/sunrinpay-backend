import wrapAsync from "../wrapAsync";
import { headerUndefinedError } from "./auth";
import { storeTokenVerify } from "../storeToken";

export const storeAuthorized = wrapAsync(async (req, res) => {
  if (!req.headers["x-access-token"]) throw headerUndefinedError;
  const auth = await storeTokenVerify(req.headers["x-access-token"] as any);
  (req as any).store = auth;
});
