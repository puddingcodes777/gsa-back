import { Router } from "express";
import {
  getCardDetail,
  getCollectableByUid,
  getCollectablesByFilter,
  isCollectableType,
  mockCollectableReport
} from "src/modules/collectable";
import { api, App } from "src/utils/api";
import { ApiValidationError } from "src/utils/errors";

export const collectableRouter = (app: App) => {
  const router = Router();
  app.use("/api/collectable", router);

  router.get(
    "/search",
    api.call(async (req) => {
      let { keyword, type, grading } = req.query;

      if (typeof keyword !== "string") {
        keyword = "";
      }

      if (typeof type !== "string") {
        type = "";
      } else {
        if (!isCollectableType(type)) {
          throw new ApiValidationError("Collectable type is invalid");
        }
      }

      return await getCollectablesByFilter(keyword, type, grading == "true");
    })
  );

  router.get(
    "/search/:uid",
    api.call(async (req) => {
      let { uid } = req.params;

      const item = await getCollectableByUid(uid);
      if (!item) throw new ApiValidationError("Collectable doesn't exist");

      return item;
    })
  )

  router.get(
    "/card-detail/:cert",
    api.call(async (req) => {
      const { cert } = req.params;
      return await getCardDetail(cert);
    })
  );

  router.post(
    "/mock",
    api.call(async (req) => {
      await mockCollectableReport();
    })
  );
};
