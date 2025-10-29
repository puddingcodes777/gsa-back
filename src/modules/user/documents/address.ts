import { Document, Schema, model, Types } from "mongoose";
import { UpdateAddressPayload } from "../types";

export interface Address {
  uid: string;
  user: Types.ObjectId;
  country: string;
  state: string;
  city: string;
  street: string;
  code: string;
  phone: string;
}

export interface AddressDocument extends Address, Document {}

export const AddressSchema = new Schema<AddressDocument>(
  {
    uid: { type: String, required: true, unique: true },
    user: { type: Schema.Types.ObjectId, required: true, ref: "users" },
    country: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    street: { type: String, required: true },
    code: { type: String, required: true },
    phone: { type: String, required: true },
  },
  { timestamps: true }
);

export const AddressModel = model<AddressDocument>("addresses", AddressSchema);

export const createAddress = async (
  address: Address
): Promise<AddressDocument> => {
  const addressDoc = new AddressModel(address);
  return await addressDoc.save();
};

export const getAddressDocById = async (
  id: Types.ObjectId | string
): Promise<AddressDocument | null> => {
  return await AddressModel.findById(id);
};

export const getAddressById = async (
  id: Types.ObjectId | string
): Promise<Address | null> => {
  return await AddressModel.findById(id).lean();
};

export const getAddressDocsByUserId = async (
  userId: Types.ObjectId | string
): Promise<AddressDocument[]> => {
  return await AddressModel.find({ user: userId });
};

export const getAddressesByUserId = async (
  userId: Types.ObjectId | string
): Promise<Address[]> => {
  return await AddressModel.find({ user: userId }).lean();
};

export const updateAddressById = async (
  id: Types.ObjectId | string,
  payload: UpdateAddressPayload & { uid: string }
) => {
  return await AddressModel.findByIdAndUpdate(id, payload, { new: true });
};

export const deleteAddressById = async (id: Types.ObjectId | string) => {
  await AddressModel.findByIdAndDelete(id);
};
