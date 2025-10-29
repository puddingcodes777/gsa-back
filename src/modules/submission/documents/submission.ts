import { Document, Schema, model, Types, ObjectId } from "mongoose";
import { SubmissionStatus, SubmissionType } from "../types";
import { Collectable } from "src/modules/collectable";

export interface ItemInSubmission {
  info: string | Collectable,
  declValue: number,
  serviceLevel: string
}

export interface Submission {
  uid: string;
  user: Types.ObjectId;
  type: SubmissionType;
  address: Types.ObjectId;
  status: SubmissionStatus;
  items: ItemInSubmission[];
  trackId: string;
  qrCode?: string;
}

export interface SubmissionDocument extends Submission, Document {}

export const SubmissionSchema = new Schema<SubmissionDocument>(
  {
    uid: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, required: true, ref: "users" },
    type: {
      type: String,
      required: true,
      enum: ["economy", "standard", "express"],
    },
    address: { type: Schema.Types.ObjectId, required: true, ref: "addresses" },
    status: {
      type: String,
      enum: ["shipping", "review", "cancelled", "delayed", "completed"],
      default: "shipping",
    },
    items: [
      {
        info: {
          type: String,
          required: true,
          ref: "collectables",
        },
        declValue: Number,
        serviceLevel: String
      }
    ],
    trackId: { type: String, required: true },
    qrCode: { type: String },
  },
  { timestamps: true }
);

export const SubmissionModel = model<SubmissionDocument>(
  "submissions",
  SubmissionSchema
);

export const createSubmission = async (submission: Submission) => {
  const submissionDoc = new SubmissionModel(submission);
  return await submissionDoc.save();
};

export const getRecentSubmissionsByUserId = async (
  userId: Types.ObjectId | string
) => {
  return await SubmissionModel.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(5)
    .populate("user", "-password -role")
    .populate("address")
    .populate("items")
    .lean();
};

export const getSubmissionsByUserId = async (
  userId: Types.ObjectId | string
) => {
  return await SubmissionModel.find({ user: userId })
    .sort({ createdAt: -1 })
    .populate("items.info")
    .populate("address")
    .lean();
};

export const getSubmissionsByPage = async (page: number) => {
  const limit = 10;
  const count = await SubmissionModel.countDocuments();
  const skip = (page - 1) * limit;
  const submissions = await SubmissionModel.find()
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 })
    .populate("user", "-password -role")
    .populate("address")
    .populate("items.info")
    .lean();

  return { count, submissions };
};
