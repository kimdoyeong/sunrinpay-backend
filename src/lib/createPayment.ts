import User from "../models/User";
import { UserNotFoundError } from "./error";
import Payment from "../models/Payment";

export async function createPayment(userId: string) {
  const user = await User.findById(userId);
  if (!user) {
    throw UserNotFoundError;
  }

  const payment = new Payment({
    issuedBy: user._id
  });
  await payment.save();

  return {
    token: "sunrinpay:" + payment._id,
    expiredAt: payment.createdAt + 1000 * 60 * 5,
    code: payment.code
  };
}
