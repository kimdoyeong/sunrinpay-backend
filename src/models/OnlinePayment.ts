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
  },
  accepted: {
    type: Boolean,
    default: false
  },
  token: {
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
}

const OnlinePayment = model<OnlinePaymentDocument>(
  "onlinepayment",
  OnlinePaymentSchema
);

export default OnlinePayment;
