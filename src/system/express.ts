import express from "express";
import http from "http";
import compression from "compression";
import helmet from "helmet";
import cors from "cors";
import path from "path";

import { config } from "./config";
import { getPassport } from "src/utils/passport";

export const app = express();
export const server = http.createServer(app);
export const passport = getPassport();

export const loadExpressMiddleware = () => {
  [
    // helmet({
    //   contentSecurityPolicy: false,
    //   crossOriginEmbedderPolicy: false,
    //   crossOriginResourcePolicy: false,
    //   referrerPolicy: { policy: "no-referrer" },
    // }),
    compression(),
    express.json(),
    express.urlencoded({ extended: false }),
    cors(),
    passport.initialize(),
  ].forEach((middleware) => app.use(middleware));

  app.use(
    "/media",
    express.static(path.resolve("./") + `/${config.media.bucket}`)
  );
};
