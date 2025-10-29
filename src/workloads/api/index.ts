import { App } from "src/utils/api";
import { authRouter } from "./auth";
import { userRouter } from "./user";
import { mediaRouter } from "./media";
import { collectableRouter } from "./collectable";
import { addressRouter } from "./address";
import { submissionRouter } from "./submission";
import { membershipRouter } from "./membership";

const routers = [
  authRouter,
  userRouter,
  mediaRouter,
  collectableRouter,
  addressRouter,
  submissionRouter,
  membershipRouter,
];

const run = (app: App) => {
  for (const router of routers) {
    router(app);
  }
};

export const apiWorkload = {
  name: "api",
  entry: run,
};
