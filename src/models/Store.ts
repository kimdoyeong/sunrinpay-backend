import { Schema, model, Document } from "mongoose";

const storeSchema = new Schema({
  name: {
    type: String,
    required: true
  }
});

export interface StoreDocument extends Document {
  name: String;
}

const Store = model<StoreDocument>("store", storeSchema);

export default Store;
