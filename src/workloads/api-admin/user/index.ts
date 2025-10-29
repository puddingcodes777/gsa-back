import { Router } from "express";
import { api, App, GsaReq } from "src/utils/api";
import { ApiValidationError } from "src/utils/errors";
import { getUsersByPage } from "src/modules/user";

export const userRouter = (app: App) => {
  const router = Router();
  app.use("/api/admin/user", router);

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

      return await getUsersByPage(Number(page));
    })
  );
};
