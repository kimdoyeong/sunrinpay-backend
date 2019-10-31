import { model, Schema } from "mongoose";
import { randomBytes, pbkdf2Sync } from "crypto";
import createError from "../lib/error/createError";

const userSchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    set(v: string) {
      const encKey = randomBytes(64);
      this.encKey = encKey;

      return pbkdf2Sync(v, encKey.toString("base64"), 10000, 64, "sha512");
    }
  },
  name: {
    type: String,
    required: true
  },
  no: {
    type: Number,
    required: true
  },
  encKey: {
    type: String
  }
});

userSchema.pre("save", function(next) {
  const { id, password, name, no } = this as any;
  if (!id || !password || !name || !no) {
    return next(createError("필수 항목이 없습니다.", 422));
  }
  next();
});
const User = model("user", userSchema);
export default User;
