import { Router } from "express";
import { isEmail } from "validator";
import { config } from "src/system";
import { api, App, GsaReq } from "src/utils/api";
import { ApiValidationError } from "src/utils/errors";
import {
  changePassword,
  checkEmail,
  doLogin,
  doSignup,
  doVerify,
  isPasswordValid,
} from "src/modules/user";

export const authRouter = (app: App) => {
  const router = Router();
  app.use("/api/auth", router);

  router.post(
    "/check-email",
    api.call(async (req) => {
      const { email } = req.body;

      if (!email) {
        throw new ApiValidationError("Email is empty");
      }

      if (!isEmail(email)) {
        throw new ApiValidationError("Email is invalid");
      }

      const result = await checkEmail(email);
      return { result };
    })
  );

  router.post(
    "/signup",
    api.call(async (req) => {
      const { email, password } = req.body;

      if (!email) {
        throw new ApiValidationError("Email is empty");
      }

      if (!isEmail(email)) {
        throw new ApiValidationError("Email is invalid");
      }

      if (!password) {
        throw new ApiValidationError("Password is empty");
      }

      if (!isPasswordValid(password)) {
        throw new ApiValidationError("Password is invalid");
      }

      await doSignup(email, password);
    })
  );

  router.get(
    "/verify",
    api.call(async (req, res) => {
      const { token } = req.query;

      if (!token) {
        throw new ApiValidationError("Token is required");
      }

      await doVerify(token as string);
      res.redirect(`${config.domain}/auth/signin`);
    })
  );

  router.post(
    "/login",
    api.call(async (req) => {
      const { email, password } = req.body;

      if (!email) {
        throw new ApiValidationError("Email is empty");
      }

      if (!password) {
        throw new ApiValidationError("Password is empty");
      }

      return await doLogin(email, password);
    })
  );

  router.post(
    "/change-password",
    api.check,
    api.call(async (req) => {
      const { oldPassword, newPassword } = req.body;
      const { user } = req as GsaReq;

      if (!oldPassword) {
        throw new ApiValidationError("Old password is required");
      }

      if (!newPassword) {
        throw new ApiValidationError("New password is empty");
      }

      if (!isPasswordValid(newPassword)) {
        throw new ApiValidationError("New password is invalid");
      }

      await changePassword(oldPassword, newPassword, user.id);
    })
  );
};
