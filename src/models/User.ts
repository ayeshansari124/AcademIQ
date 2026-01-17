import mongoose, { Schema, Document, Model } from "mongoose";

export type UserRole = "ADMIN" | "STUDENT";

export interface IUser extends Document {
  name: string;
  email?: string;
  username?: string;
  passwordHash: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },

    email: {
      type: String,
      unique: true,
      sparse: true, // allows null for students
      lowercase: true,
      trim: true,
    },

    username: {
      type: String,
      unique: true,
      sparse: true, // allows null for admin
      lowercase: true,
      trim: true,
    },

    passwordHash: { type: String, required: true },

    role: {
      type: String,
      enum: ["ADMIN", "STUDENT"],
      required: true,
    },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
