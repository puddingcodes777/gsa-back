import { Types } from "mongoose";
import { redis } from "src/system";
import { createTransaction } from "src/utils/shippo";
import { createSubmission, ItemInSubmission, Submission } from "../documents";
import { SubmissionType } from "../types";
import { InternalError } from "src/utils/errors";

export const getSubmissionKey = (id: string) => {
  return "submission:" + id;
};

export const setSubmissionToCache = async (
  id: string,
  shipment: string,
  cost: number,
  type: string,
  address: string
) => {
  await redis.set(
    getSubmissionKey(id),
    JSON.stringify({ shipment, cost, type, address })
  );
  await redis.expire(getSubmissionKey(id), 3600);
};

export const getSubmissionFromCache = async (id: string) => {
  const submission = await redis.get(getSubmissionKey(id));
  if (!submission) {
    return null;
  }

  return JSON.parse(submission);
};

export const clearSubmissionFromCache = async (id: string) => {
  await redis.del(getSubmissionKey(id));
};

export const createNewSubmission = async (
  userId: string,
  items: ItemInSubmission[],
  shipmentId: string,
  type: SubmissionType,
  addressId: string
) => {
  const transaction = await createTransaction(shipmentId);
  if (!transaction) {
    throw new InternalError("Shipment transaction failed");
  }

  const submission: Submission = {
    uid: transaction.uid,
    user: new Types.ObjectId(userId),
    type,
    address: new Types.ObjectId(addressId),
    items,
    trackId: transaction.trackId,
    qrCode: transaction.qrCode,
    status: "shipping",
  };

  await createSubmission(submission);
  await clearSubmissionFromCache(userId);
};
