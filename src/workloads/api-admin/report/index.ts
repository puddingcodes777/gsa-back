import { Router } from "express";
import { createReport, getCollectablesByUserId } from "src/modules/collectable";
import { api, App, GsaReq } from "src/utils/api";
import { ApiValidationError } from "src/utils/errors";

export const reportRouter = (app: App) => {
  const router = Router();
  app.use("/api/admin/report", router);

  router.get(
    "/gradings",
    api.check,
    api.call(async (req) => {
      const { user } = req as GsaReq;
      return await getCollectablesByUserId(user.id)
    })
  )

  router.post(
    "/add",
    api.check,
    api.call(async (req) => {
      const { user } = req as GsaReq;
      const {
        image,
        sport,
        name,
        uid,
        manufacturer,
        year,
        type,
        description,
        grade,
        surface,
        center,
        corner,
        edge,
        certNumber,
        certType,
      } = req.body;

      if (!uid) {
        throw new ApiValidationError("Card Number id is required");
      }

      if (!description) {
        throw new ApiValidationError("Description is required");
      }

      if (!grade) {
        throw new ApiValidationError("Grade score is required");
      }

      if (!surface) {
        throw new ApiValidationError("Surface score is required");
      }

      if (!center) {
        throw new ApiValidationError("Centering score is required");
      }

      if (!corner) {
        throw new ApiValidationError("Corners score is required");
      }

      if (!edge) {
        throw new ApiValidationError("Edges score is required");
      }

      if (!certNumber) {
        throw new ApiValidationError("Certification Number is required");
      }

      if (!certType) {
        throw new ApiValidationError("Certification Type is required");
      }

      await createReport({
        image,
        sport,
        name,
        uid,
        manufacturer,
        year: +year,
        type,
        width: 0,
        height: 0,
        description,
        user: user.id,
        report: {
          grade,
          surface: +surface,
          center: +center,
          corner: +corner,
          edge: +edge,
          certNumber,
          certType
        }
      });
    })
  );
};
