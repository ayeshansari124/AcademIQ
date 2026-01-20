import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IClass extends Document {
  name: string;
  subjects: string[];
  students: Types.ObjectId[];
}

const ClassSchema = new Schema<IClass>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },

    subjects: {
      type: [String],
      required: true,
    },

    students: [
      {
        type: Schema.Types.ObjectId,
        ref: "Student",
      },
    ],
  },
  { timestamps: true }
);

const ClassModel: Model<IClass> =
  mongoose.models.Class || mongoose.model<IClass>("Class", ClassSchema);

export default ClassModel;
