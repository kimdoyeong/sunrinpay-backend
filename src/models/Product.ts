import { Schema, model, Document, models } from "mongoose";

const ProductSchema = new Schema({
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
    type: Number,
    required: true
  },
  stock: {
    type: Number,
    required: true
  },
  img: {
    type: String,
    default: ""
  }
});

export interface ProductDocument extends Document {
  title: string;
  content: string;
  cost: number;
  stock: number;
  img: string;
}

const Product = model<ProductDocument>("product", ProductSchema);

export default Product;
