import { Router } from "express";
import {
  createNewSubmission,
  getSubmissionFromCache,
  SubmissionInfo,
  SubmissionType,
} from "src/modules/submission";
import { api, App, GsaReq } from "src/utils/api";
import { ApiValidationError, InternalError } from "src/utils/errors";
import { payWithCard } from "src/utils/stripe";

export const shopRouter = (app: App) => {
  const router = Router();
  app.use("/api/shop", router);

  router.post(
    "/confirm",
    api.check,
    api.call(async (req) => {
      const { user } = req as GsaReq;
      const { token, amount, items } = req.body;

      const cost = 240 * 100;
      if (amount < cost) {
        throw new ApiValidationError("Amount is invalid");
      }

      const paid = await payWithCard("Payment for Shopping", amount, token);
      if (paid.status !== "succeeded") {
        throw new InternalError("Payment failed");
      }
    })
  );
};
