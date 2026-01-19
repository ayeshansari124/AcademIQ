import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IStudent extends Document {
  userId: Types.ObjectId;
  fullName: string;
  parentName: string;
  phone: string;
  // classId: Types.ObjectId;
  classId: string; //temp
  subjects: string[];
  days: string[];
  monthlyFees: number;
  createdAt: Date;
}

const StudentSchema = new Schema<IStudent>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    fullName: { type: String, required: true },
    parentName: { type: String, required: true },
    phone: { type: String, required: true },

    classId: {
      // type: Schema.Types.ObjectId,
      type:String, //temp
      ref: "Class",
      required: true,
    },

    subjects: {
      type: [String],
      required: true,
    },

    days: {
      type: [String],
      required: true,
    },

    monthlyFees: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Student: Model<IStudent> =
  mongoose.models.Student ||
  mongoose.model<IStudent>("Student", StudentSchema);

export default Student;
