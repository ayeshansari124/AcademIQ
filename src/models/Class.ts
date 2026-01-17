import mongoose, { Schema, Document, Model } from "mongoose";

export interface IClass extends Document {
  name: string;
  subjects: string[];
  createdAt: Date;
}

const ClassSchema = new Schema<IClass>(
  {
    name: { type: String, required: true, unique: true },
    subjects: { type: [String], default: [] },
  },
  { timestamps: true }
);

const ClassModel: Model<IClass> =
  mongoose.models.Class || mongoose.model<IClass>("Class", ClassSchema);

export default ClassModel;
