import { model, Schema, SchemaTypes, Document } from "mongoose";

const transactionSchema = new Schema({
  user: {
    type: SchemaTypes.ObjectId,
    required: true
  },
  store: {
    type: SchemaTypes.ObjectId,
    required: true
  },
  sum: {
    type: Number,
    required: true
  }
});

export interface TransactionDocument extends Document {
  user: string;
  store: string;
  sum: Number;
}

const Transaction = model<TransactionDocument>(
  "transaction",
  transactionSchema
);

export default Transaction;
