import express, { Request, Response, NextFunction } from "express";
import passport from "passport";
import { UserDocument } from "src/modules/user";
import { ApiValidationError } from "src/utils/errors";

export type Router = express.Router;
export type App = express.Express;
export type Passport = passport.PassportStatic;

export interface GsaReq extends Request {
  user: Partial<UserDocument>;
}

export const isGsaReq = <T extends Request>(req: T) => {
  return !!req && !!req.user;
};

const validatedApiCall =
  (process: (req: Request, res: Response) => Promise<unknown>) =>
  (req: Request, res: Response) => {
    process(req, res)
      .then((data) => {
        if (!res.headersSent) {
          res.json(data || { success: true });
        }
      })
      .catch((e) => {
        if (e instanceof ApiValidationError) {
          res.status(400).json({
            message: e.message,
          });

          return;
        }

        res.status(500).send("Internal server error");
      });
  };

export const api = {
  check: function (req: Request, res: Response, next: NextFunction) {
    passport.authenticate("jwt", { session: false })(req, res, next);
  },
  call: validatedApiCall,
};
