import { Router } from "express";
import { getSubmissionsByPage } from "src/modules/submission";
import { api, App, GsaReq } from "src/utils/api";
import { ApiValidationError } from "src/utils/errors";

export const submissionRouter = (app: App) => {
  const router = Router();
  app.use("/api/admin/submission", router);

  router.get(
    "/all",
    api.check,
    api.call(async (req) => {
      const { user } = req as GsaReq;
      const { page } = req.query;

      if (user.role !== "admin") {
        throw new ApiValidationError("You don't have admin privilege");
      }

      if (!page) {
        throw new ApiValidationError("Page number is required");
      }

      if (!Number.isInteger(Number(page))) {
        throw new ApiValidationError("Page number is invalid");
      }

      return await getSubmissionsByPage(Number(page));
    })
  );
};
