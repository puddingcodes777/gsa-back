import { addTimeInDuration } from "src/utils/helpers/time";
import {
  getMembershipByUserId,
  createMembership,
  updateMembershipByUserId,
} from "../documents";
import { MembershipType, MembershipPeriod } from "../types";

export const getMembership = async (userId: string) => {
  const membership = await getMembershipByUserId(userId);
  if (!membership) {
    return await createMembership(userId);
  }

  return membership;
};

export const upgradeMembership = async (
  userId: string,
  type: MembershipType,
  period: MembershipPeriod
) => {
  const deadline = addTimeInDuration(1, period);
  return await updateMembershipByUserId(userId, { type, deadline });
};
