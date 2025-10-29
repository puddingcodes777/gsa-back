import { App } from "src/utils/api";
import { submissionRouter } from "./submission";
import { userRouter } from "./user";
import { reportRouter } from "./report";

const routers = [submissionRouter, userRouter, reportRouter];

const run = (app: App) => {
  for (const router of routers) {
    router(app);
  }
};

export const apiAdminWorkload = {
  name: "api-admin",
  entry: run,
};
