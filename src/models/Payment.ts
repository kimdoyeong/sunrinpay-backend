import { model, Schema, SchemaTypes, Document } from "mongoose";

const PaymentSchema = new Schema({
  issuedBy: {
    type: SchemaTypes.ObjectId,
    required: true
  },
  createdAt: {
    type: Number,
    default: Date.now
  }
});

export interface PaymentDocument extends Document {
  issuedBy: string;
  createdAt: number;
}
const Payment = model<PaymentDocument>("payment", PaymentSchema);

export default Payment;
