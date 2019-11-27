import { model, Schema, SchemaTypes, Document } from "mongoose";
const PaymentSchema = new Schema({
  issuedBy: {
    type: SchemaTypes.ObjectId,
    required: true
  },
  createdAt: {
    type: Number,
    default: Date.now()
  },
  code: {
    type: String
  }
});

function randomChar(len: number) {
  const str = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
  let s = "";
  for (let i = 0; i < len; i++) {
    s += str[Math.floor(Math.random() * str.length)];
  }

  return s;
}
async function choiceCode(): Promise<any> {
  const c = randomChar(8);
  const doc = await Payment.findOne({ code: c });
  if (doc) {
    return await choiceCode();
  }
  return c;
}
PaymentSchema.pre("save", function(next) {
  const { code } = this as any;
  if (!code) {
    choiceCode()
      .then(c => {
        (this as any).code = c;
        next();
      })
      .catch(next);
  }
});
export interface PaymentDocument extends Document {
  issuedBy: string;
  createdAt: number;
  code: string;
}
const Payment = model<PaymentDocument>("payment", PaymentSchema);

export default Payment;
