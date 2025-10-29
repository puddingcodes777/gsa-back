import { Router } from "express";
import {
  createNewSubmission,
  getRecentSubmissionsByUserId,
  getSubmissionFromCache,
  getSubmissionsByUserId,
  setSubmissionToCache,
  SubmissionInfo,
  SubmissionItemReq,
  SubmissionType,
} from "src/modules/submission";
import { getAddressById } from "src/modules/user";
import { api, App, GsaReq } from "src/utils/api";
import { ApiValidationError, InternalError } from "src/utils/errors";
import {
  createShipment,
  getBestPriceForShipment,
  getTrackInfo,
} from "src/utils/shippo";
import { payWithCard } from "src/utils/stripe";

export const submissionRouter = (app: App) => {
  const router = Router();
  app.use("/api/submission", router);

  router.post(
    "/request",
    api.check,
    api.call(async (req) => {
      const { user } = req as GsaReq;
      const { type, address } = req.body;

      if (!type) {
        throw new ApiValidationError("Submission type is required");
      }

      if (!Object.keys(SubmissionInfo).includes(type)) {
        throw new ApiValidationError("Submission type is invalid");
      }

      if (!address) {
        throw new ApiValidationError("Address is required");
      }

      const addressEntity = await getAddressById(address);

      if (!addressEntity) {
        throw new ApiValidationError("Address is invalid");
      }

      const shipmentId = await createShipment(addressEntity.uid);
      if (!shipmentId) {
        throw new InternalError("Shipment is not available");
      }

      const price = await getBestPriceForShipment(shipmentId);
      const cost = Math.ceil(parseFloat(price) * 2);

      await setSubmissionToCache(user.id, shipmentId, cost, type, address);

      return { cost };
    })
  );

  router.post(
    "/confirm",
    api.check,
    api.call(async (req) => {
      const { user } = req as GsaReq;
      const { token, amount, items } = req.body;

      const submission = await getSubmissionFromCache(user.id);
      if (!submission) {
        throw new ApiValidationError("You should request first");
      }

      const cost =
      ((submission.cost as number) +
      SubmissionInfo[submission.type as SubmissionType].price) *
      100;
      // if (amount < cost) {
      //   throw new ApiValidationError("Amount is invalid");
      // }

      const paid = await payWithCard("Payment for Submission", amount, token);
      if (paid.status !== "succeeded") {
        throw new InternalError("Payment failed");
      }

      await createNewSubmission(
        user.id,
        (items as SubmissionItemReq[]).map(item => {
          return {
            info: item._id,
            ...item
          }
        }),
        submission.shipment,
        submission.type,
        submission.address
      );
    })
  );

  router.get(
    "/recent",
    api.check,
    api.call(async (req) => {
      const { user } = req as GsaReq;

      return await getRecentSubmissionsByUserId(user.id);
    })
  );

  router.get(
    "/track",
    api.check,
    api.call(async (req) => {
      const { trackId } = req.query;

      if (!trackId) {
        throw new ApiValidationError("TrackId is required");
      }

      return await getTrackInfo(trackId as string);
    })
  );

  router.get(
    "/all",
    api.check,
    api.call(async (req) => {
      const { user } = req as GsaReq;

      return await getSubmissionsByUserId(user.id);
    })
  );
};
