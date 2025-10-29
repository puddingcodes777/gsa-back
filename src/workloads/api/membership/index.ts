import { Router } from "express";
import { api, App, GsaReq } from "src/utils/api";
import { ApiValidationError, InternalError } from "src/utils/errors";
import {
  getMembership,
  MembershipInfo,
  MembershipPeriod,
  MembershipType,
  upgradeMembership,
} from "src/modules/user";
import { payWithCard } from "src/utils/stripe";

export const membershipRouter = (app: App) => {
  const router = Router();
  app.use("/api/membership", router);

  router.get(
    "/current",
    api.check,
    api.call(async (req) => {
      const { user } = req as GsaReq;

      return await getMembership(user.id);
    })
  );

  router.post(
    "/update",
    api.check,
    api.call(async (req) => {
      const { user } = req as GsaReq;
      const { type, period, amount, token } = req.body;
      if (!Object.keys(MembershipInfo).includes(type)) {
        throw new ApiValidationError("Membership type is invalid");
      }

      if (!["month", "year"].includes(period)) {
        throw new ApiValidationError("Membership period is invalid");
      }

      if (type !== "bronze") {
        const cost =
          MembershipInfo[type as MembershipType].price[
            period as MembershipPeriod
          ] * 100;
        if (amount as number < cost) {
          throw new ApiValidationError("Amount is invalid");
        }
        const paid = await payWithCard("Payment for Membership", amount, token);
        if (paid.status !== "succeeded") {
          throw new InternalError("Payment failed");
        }
      }
      await upgradeMembership(user.id, type, period);
    })
  );
};
