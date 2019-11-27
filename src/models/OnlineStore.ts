import { Schema, model, Document, models } from "mongoose";

const OnlineStoreSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  content: {
    type: String,
    required: true
  },
  cost: {
    type: String,
    required: true
  },
  remain: {
    type: Number,
    required: true
  },
  img: {
    type: String,
    default: ""
  }
});

export interface OnlineStoreDocument extends Document {
  title: string;
  content: string;
  cost: string;
  remain: number;
}

const OnlineStore = model<OnlineStoreDocument>(
  "onlineStore",
  OnlineStoreSchema
);

export default OnlineStore;
