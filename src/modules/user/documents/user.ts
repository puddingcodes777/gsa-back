import { Document, Schema, model, Types } from "mongoose";
import { UpdateUserPayload, UserRole } from "../types";

export interface User {
  uid: string;
  email: string;
  password: string;
  role: UserRole;
  avatar?: string;
  name?: string;
  phone?: string;
  country?: string;
  researchHistory?: string[];
}

export interface UserDocument extends User, Document {
  _id: string
}

export const UserSchema = new Schema<UserDocument>(
  {
    uid: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      required: true,
      enum: ["customer", "admin"],
      default: "customer",
    },
    avatar: { type: String },
    name: { type: String },
    phone: { type: String },
    country: { type: String },
    researchHistory: [
      {
        type: String,
        ref: "collectables"
      }
    ]
  },
  { timestamps: true }
);

export const UserModel = model<UserDocument>("users", UserSchema);

export const createUser = async (
  email: string,
  password: string,
  uid: string
): Promise<UserDocument> => {
  const userDoc = new UserModel({ email, password, uid });
  return await userDoc.save();
};

export const getUserById = async (
  id: Types.ObjectId | string
): Promise<User | null> => {
  return await UserModel.findById(id).lean();
};

export const getUserDocById = async (
  id: Types.ObjectId | string
): Promise<UserDocument | null> => {
  return await UserModel.findById(id);
};

export const getUserByUid = async (uid: string): Promise<User | null> => {
  return await UserModel.findOne({ uid }).lean();
};

export const getUserDocByUid = async (
  uid: string
): Promise<UserDocument | null> => {
  return await UserModel.findOne({ uid });
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  return await UserModel.findOne({ email }).lean();
};

export const getUserDocByEmail = async (
  email: string
): Promise<UserDocument | null> => {
  return await UserModel.findOne({ email });
};

export const updateUserById = async (
  id: Types.ObjectId | string,
  payload: UpdateUserPayload
): Promise<UserDocument | null> => {
  return await UserModel.findByIdAndUpdate(id, payload, { new: true });
};

export const getUsersByPage = async (page: number) => {
  const limit = 10;
  const count = await UserModel.countDocuments();
  const skip = (page - 1) * limit;
  const users = await UserModel.find({ role: "customer" })
    .skip(skip)
    .limit(limit)
    .select("-password -role")
    .sort({ createdAt: -1 })
    .lean();

  return { count, users };
};

export const addCardToHistory = async (userId: string, cardId: string): Promise<User | null> => {
  const user = await UserModel.findById(userId).lean();
  const researchHistory = user?.researchHistory || [];
  researchHistory.unshift(cardId);
  return await UserModel.findByIdAndUpdate(userId, { researchHistory }, { new: true }).lean();
}

export const removeCardFromHistory = async (userId: string, cardId: string): Promise<User | null> => {
  const user = await UserModel.findById(userId).lean();
  const researchHistory = user?.researchHistory?.filter(id => id != cardId) || [];
  return await UserModel.findByIdAndUpdate(userId, { researchHistory }, { new: true }).lean();
}

export const getSearchHistory = async (userId: string) => {
  const user = await UserModel.findById(userId).populate("researchHistory").lean();
  return user?.researchHistory;
}