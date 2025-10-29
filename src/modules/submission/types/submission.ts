export const SubmissionInfo = {
  economy: {
    min: 25,
    price: 5,
  },
  standard: {
    min: 10,
    price: 10,
  },
  express: {
    min: 1,
    price: 40,
  },
} as const;

export type SubmissionType = keyof typeof SubmissionInfo;

export type SubmissionStatus =
  | "shipping"
  | "review"
  | "cancelled"
  | "delayed"
  | "completed";


export interface SubmissionItemReq {
  _id: string,
  serviceLevel: string,
  declValue: number
}