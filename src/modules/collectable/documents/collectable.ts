import { Document, Schema, model, Types } from "mongoose";
import { ApiValidationError } from "src/utils/errors";
import { Collectable } from "../types";

export interface CollectableDocument extends Collectable, Document {}

export const CollectableSchema = new Schema<CollectableDocument>(
  {
    uid: { type: String, required: true },
    type: { type: String, required: true },
    description: { type: String, required: true },
    year: { type: Number, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    sport: { type: String, required: true },
    name: { type: String },
    manufacturer: { type: String },
    image: { type: String, required: true },
    user: { type: String },
    report: {
      grade: {
        type: String,
        required: true,
      },
      surface: {
        type: Number,
        required: true,
      },
      center: {
        type: Number,
        required: true,
      },
      corner: {
        type: Number,
        required: true,
      },
      edge: {
        type: Number,
        required: true,
      },
      certNumber: {
        type: String,
        required: true,
      },
      certType: {
        type: String,
        required: true,
      },
    },
  },
  { timestamps: true }
);

export const CollectableModel = model<CollectableDocument>(
  "collectables",
  CollectableSchema
);

export const getCollectableById = async (
  id: Types.ObjectId | string
): Promise<Collectable | null> => {
  return await CollectableModel.findById(id).lean();
};

export const getCollectableByUid = async (
  uid: string
): Promise<Collectable | null> => {
  return await CollectableModel.findOne({ uid }).lean();
};

export const getCollectablesByFilter = async (
  keyword: string,
  type: string,
  grading: boolean
): Promise<Collectable[]> => {
  return await CollectableModel.aggregate([
    {
      $match: {
        $and: [
          {
            $or: [
              {
                uid: { $regex: keyword, $options: "i" },
              },
              {
                description: { $regex: keyword, $options: "i" },
              },
            ],
          },
          {
            type: { $regex: type, $options: "i" },
          },
          {
            report: { $exists: grading }
          }
        ],
      },
    }
  ]).exec();
};

export const getCollectablesByUserId = async (
  user: string
): Promise<Collectable[]> => {
  return await CollectableModel.find({ user }).lean();
}

export const getCardDetail = async (cert: string) => {
  try {
    const data = await CollectableModel.aggregate([
      {
        $match: {
          $expr: {
            $regexMatch: {
              input: '$report.certNumber',
              regex: cert,
              options: 'i',
            },
          }
        },
      },
      {
        $lookup: {
          from: "reports",
          localField: "_id",
          foreignField: "collectable",
          as: "reports",
        },
      },
    ]);
    return data.length ? data[0] : {};
  } catch (error) {
    console.log(error)
    throw new Error("Hello")
  }
};

export const createReport = async (
  data: Collectable
): Promise<Collectable> => {
  const collectable = await CollectableModel.findOne({ uid: data.uid });
  if (collectable) {
    collectable.report = data.report;
    return await collectable.save();
  }
  try {
    const newCollectable = new CollectableModel(data);
    return await newCollectable.save();
  } catch(error) {
    console.log(error);
    throw new ApiValidationError("Uploading failed");
  }
};

export const mockCollectableReport = async () => {
  const documentsToUpdate = await CollectableModel.find({}).select('_id');

  const idsToUpdate = documentsToUpdate.map(doc => doc._id);

  for (let i = 0; i < idsToUpdate.length; i += 2) {
    await CollectableModel.updateOne(
      { _id: idsToUpdate[i] },
      {
        $set: {
          report: {
            grade: `GEM MINT ${Math.floor(Math.random() * 5) + 5}`,
            surface: Math.floor(Math.random() * 8) + 2,
            center: Math.floor(Math.random() * 8) + 2,
            corner: Math.floor(Math.random() * 8) + 2,
            edge: Math.floor(Math.random() * 8) + 2,
            certNumber: Math.floor(Math.random() * 100000000) + 10000000,
            certType: "GEM"
          }
        }
      }
      // {
      //   $unset: {
      //     report: 1
      //   }
      // }
    )
  }
}