import { pbkdf2Sync } from "crypto";
import User from "../models/User";
import { UserNotFoundError } from "./error";

export async function generatePaymentToken(userId: string) {
  const user = await User.findById(userId);

  if (!user) {
    throw UserNotFoundError;
  }

  const payload = {
    issuedBy: user._id,
    username: user.name,
    issuedAt: Date.now(),
    tokenExpires: Date.now() + 1000 * 60 * 5
  };

  const tokenPayload = Buffer.from(JSON.stringify(payload)).toString("base64");
  const validation = pbkdf2Sync(
    tokenPayload,
    user.encKey,
    100000,
    64,
    "sha512"
  ).toString("base64");

  return `sunrinpay-payment.${tokenPayload}.${validation}`;
}
