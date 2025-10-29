import { Document, Schema, model, Types } from "mongoose";

export interface Bill {
  user: Types.ObjectId;
  type: string;
  number: string;
  expiration: {
    month: string;
    year: string;
  };
  cvc: string;
}

export interface BillDocument extends Bill, Document {}

export const BillSchema = new Schema<BillDocument>(
  {
    user: { type: Schema.Types.ObjectId, required: true, ref: "users" },
    type: { type: String, required: true },
    number: { type: String, required: true },
    expiration: {
      month: { type: String, required: true },
      year: { type: String, required: true },
    },
    cvc: { type: String, required: true },
  },
  { timestamps: true }
);

export const BillModel = model<BillDocument>("bills", BillSchema);

export const createBill = async (bill: Bill): Promise<BillDocument> => {
  const billDoc = new BillModel(bill);
  return await billDoc.save();
};

export const getBillById = async (
  id: Types.ObjectId | string
): Promise<Bill | null> => {
  return await BillModel.findById(id).lean();
};

export const getBillDocById = async (
  id: Types.ObjectId | string
): Promise<BillDocument | null> => {
  return await BillModel.findById(id);
};

export const getBillsByUserId = async (
  userId: Types.ObjectId | string
): Promise<Bill[]> => {
  return await BillModel.find({ user: userId }).lean();
};

export const getBillDocsByUserId = async (
  userId: Types.ObjectId | string
): Promise<BillDocument[]> => {
  return await BillModel.find({ user: userId });
};
