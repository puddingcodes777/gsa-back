import { Document, Schema, model, Types } from "mongoose";
import { MembershipType, UpdateMembershipPayload } from "../types";

export interface Membership {
  user: Types.ObjectId;
  type: MembershipType;
  point: number;
  deadline: Date;
}

export interface MembershipDocument extends Membership, Document {}

export const MembershipSchema = new Schema<MembershipDocument>(
  {
    user: { type: Schema.Types.ObjectId, required: true, ref: "users" },
    type: {
      type: String,
      default: "bronze",
      enum: ["bronze", "silver", "gold"],
    },
    point: { type: Number, default: 0 },
    deadline: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const MembershipModel = model<MembershipDocument>(
  "memberships",
  MembershipSchema
);

export const createMembership = async (
  userId: Types.ObjectId | string
): Promise<MembershipDocument> => {
  const membershipDoc = new MembershipModel({ user: userId });
  return await membershipDoc.save();
};

export const getMembershipById = async (
  id: Types.ObjectId | string
): Promise<Membership | null> => {
  return await MembershipModel.findById(id).lean();
};

export const getMembershipDocById = async (
  id: Types.ObjectId | string
): Promise<MembershipDocument | null> => {
  return await MembershipModel.findById(id);
};

export const getMembershipByUserId = async (
  userId: Types.ObjectId | string
): Promise<Membership | null> => {
  return await MembershipModel.findOne({ user: userId }).lean();
};

export const getMembershipDocByUserId = async (
  userId: Types.ObjectId | string
): Promise<MembershipDocument | null> => {
  return await MembershipModel.findOne({ user: userId });
};

export const updateMembershipById = async (
  id: Types.ObjectId | string,
  payload: UpdateMembershipPayload
): Promise<MembershipDocument | null> => {
  return await MembershipModel.findByIdAndUpdate(id, payload, { new: true });
};

export const updateMembershipByUserId = async (
  userId: Types.ObjectId | string,
  payload: UpdateMembershipPayload
): Promise<MembershipDocument | null> => {
  return await MembershipModel.findOneAndUpdate({ user: userId }, payload, {
    new: true,
  });
};
