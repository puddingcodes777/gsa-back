import { Router } from "express";
import {
  createValidatedAddress,
  deleteAddress,
  getAddressesByUserId,
  isValidZip,
  updateAddress,
  UpdateAddressPayload,
} from "src/modules/user";
import { api, App, GsaReq } from "src/utils/api";
import { ApiValidationError } from "src/utils/errors";

export const addressRouter = (app: App) => {
  const router = Router();
  app.use("/api/address", router);

  router.get(
    "/all",
    api.check,
    api.call(async (req) => {
      const { user } = req as GsaReq;

      return await getAddressesByUserId(user.id);
    })
  );

  router.post(
    "/add",
    api.check,
    api.call(async (req) => {
      const { user } = req as GsaReq;
      const { country, state, city, street, code, phone } = req.body;

      if (!country) {
        throw new ApiValidationError("Country is empty");
      }

      if (!state) {
        throw new ApiValidationError("State is empty");
      }

      if (!city) {
        throw new ApiValidationError("City is empty");
      }

      if (!street) {
        throw new ApiValidationError("Street is empty");
      }

      if (!code) {
        throw new ApiValidationError("Zip code is empty");
      }

      if (!isValidZip(code)) {
        throw new ApiValidationError("Zip code is invalid");
      }

      if (!phone) {
        throw new ApiValidationError("Phone is empty");
      }

      return await createValidatedAddress(
        {
          user: user.id,
          country,
          state,
          city,
          street,
          code,
          phone,
        },
        user
      );
    })
  );

  router.put(
    "/",
    api.check,
    api.call(async (req) => {
      const { user } = req as GsaReq;
      const { _id: id, country, state, city, street, code, phone } = req.body;

      const payload: UpdateAddressPayload = {};

      if (!id) {
        throw new ApiValidationError("Address id is required");
      }

      if (country) {
        payload.country = country;
      }

      if (state) {
        payload.state = state;
      }

      if (city) {
        payload.city = city;
      }

      if (street) {
        payload.street = street;
      }

      if (code) {
        if (!isValidZip(code)) {
          throw new ApiValidationError("Zip code is invalid");
        }

        payload.code = code;
      }

      if (phone) {
        payload.phone = phone;
      }

      await updateAddress(user.id, id, payload, user);
    })
  );

  router.post(
    "/delete",
    api.check,
    api.call(async (req) => {
      const { user } = req as GsaReq;
      const { id } = req.body;

      if (!id) {
        throw new ApiValidationError("Address id is required");
      }

      await deleteAddress(user.id, id);
    })
  );
};
