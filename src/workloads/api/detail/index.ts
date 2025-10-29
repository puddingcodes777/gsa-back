import { Router } from "express";
import { api, App, GsaReq } from "src/utils/api";

export const detailRouter = (app: App) => {
  const router = Router();
  app.use("/api/detail", router);

  router.get(
    "/all",
    api.call(async (req) => {
      const { user } = req as GsaReq;
      return user;
    })
  );
};
