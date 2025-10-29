import { Router } from "express";
import { api, App, GsaReq } from "src/utils/api";
import {
  addCardToHistory,
  getSearchHistory,
  isUsernameValid,
  removeCardFromHistory,
  updateUser,
  UpdateUserPayload,
} from "src/modules/user";
import { isMobilePhone, isURL } from "validator";
import { ApiValidationError } from "src/utils/errors";

export const userRouter = (app: App) => {
  const router = Router();
  app.use("/api/user", router);

  router.get(
    "/profile",
    api.check,
    api.call(async (req) => {
      const { user } = req as GsaReq;

      return user;
    })
  );

  router.get(
    "/history",
    api.check,
    api.call(async (req) => {
      const { user } = req as GsaReq;
      if (user._id)
        return await getSearchHistory(user._id);
    })
  )

  router.post(
    "/update",
    api.check,
    api.call(async (req) => {
      const { user } = req as GsaReq;
      const { avatar, name, phone, country } = req.body;
      const payload: UpdateUserPayload = {};

      if (avatar) {
        // if (!isURL(avatar)) {
        //   throw new ApiValidationError("Avatar is invalid");
        // }

        payload.avatar = avatar;
      }

      if (name) {
        if (!isUsernameValid(name)) {
          throw new ApiValidationError("Name is invalid");
        }

        payload.name = name;
      }

      if (phone) {
        if (!isMobilePhone(phone)) {
          throw new ApiValidationError("Phone number is invalid");
        }

        payload.phone = phone;
      }

      if (country) {
        payload.country = country;
      }

      return await updateUser(user.id, payload);
    })
  );

  router.put(
    "/history/:cardId",
    api.check,
    api.call(async (req) => {
      const { user } = req as GsaReq;
      const { cardId } = req.params;
      if (user?._id)
        return await addCardToHistory(user._id, cardId);
    })
  );

  router.delete(
    "/history/:cardId",
    api.check,
    api.call(async (req) => {
      const { user } = req as GsaReq;
      const { cardId } = req.params;
      if (user?._id)
        return await removeCardFromHistory(user._id, cardId);
    })
  )
};
