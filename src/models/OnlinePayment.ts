import {
  model,
  Schema,
  SchemaTypes,
  Document,
  SchemaType,
  SchemaTypeOpts
} from "mongoose";
const OnlinePaymentSchema = new Schema({
  issuedBy: {
    type: SchemaTypes.ObjectId,
    required: true
  },
  createdAt: {
    type: Number,
    default: Date.now()
  },
  product: {
    type: SchemaTypes.ObjectId,
    required: true
  },
  amount: {
    type: Number,
    default: 1
  }
});

export interface OnlinePaymentDocument extends Document {
  issuedBy: string;
  createdAt: Date;
  product: string;
  amount: number;
}

const OnlinePayment = model<OnlinePaymentDocument>(
  "onlinepayment",
  OnlinePaymentSchema
);

export default OnlinePayment;
