import { Membership } from "../documents";

export const MembershipInfo = {
  bronze: {
    bonus: 0.1,
    price: {
      month: 0,
      year: 0,
    },
  },
  silver: {
    bonus: 0.2,
    price: {
      month: 9,
      year: 99,
    },
  },
  gold: {
    bonus: 0.3,
    price: {
      month: 19,
      year: 199,
    },
  },
} as const;

export type MembershipType = keyof typeof MembershipInfo;

export type MembershipPeriod = "month" | "year";

export type UpdateMembershipPayload = Partial<Omit<Membership, "user">>;
