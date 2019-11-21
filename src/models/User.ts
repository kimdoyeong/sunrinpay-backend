import { model, Schema, Model, Document } from "mongoose";
import { randomBytes, pbkdf2Sync } from "crypto";
import createError from "../lib/error/createError";
import * as uniqueValidator from "mongoose-unique-validator";

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
      this.encKey = encKey.toString("base64");

      return pbkdf2Sync(
        v,
        encKey.toString("base64"),
        10000,
        64,
        "sha512"
      ).toString("base64");
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
  },
  permission: {
    type: [String],
    enum: ["default", "admin", "store"],
    default: ["default"]
  }
});

userSchema.pre("save", function(next) {
  const { id, password, name, no } = this as any;
  if (!id || !password || !name || !no) {
    return next(createError("필수 항목이 없습니다.", 422));
  }
  next();
});
userSchema.plugin(uniqueValidator, {
  message: "이미 존재하는 {PATH}입니다.",
  expose: true
});
userSchema.methods.comparePassword = function(userPw: string) {
  const { password, encKey } = this as UserDocument;
  const userPwEnc = pbkdf2Sync(userPw, encKey, 10000, 64, "sha512").toString(
    "base64"
  );

  return password === userPwEnc;
};

export interface UserDocument extends Document {
  id: string;
  password: string;
  name: string;
  no: number;
  encKey: string;
  comparePassword(userPw: string): boolean;
}

const User: Model<UserDocument> = model("user", userSchema);

export default User;
