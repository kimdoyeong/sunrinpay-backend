import {
  model,
  Schema,
  SchemaTypes,
  Document,
  SchemaType,
  SchemaTypeOpts
} from "mongoose";
import { string } from "prop-types";
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
  productName: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    default: 1
  },
  accepted: {
    type: Boolean,
    default: false
  },
  token: {
    type: String
  },
  paymentid: {
    type: String
  }
});

export interface OnlinePaymentDocument extends Document {
  issuedBy: string;
  createdAt: Date;
  product: string;
  amount: number;
  accepted: boolean;
  token: string;
  paymentid: string;
}

const OnlinePayment = model<OnlinePaymentDocument>(
  "onlinepayment",
  OnlinePaymentSchema
);

export default OnlinePayment;
