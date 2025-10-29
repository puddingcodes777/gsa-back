import { config } from "./config";
import { initMongoDB } from "./mongo";
import { initRedis } from "./redis";

export * from "./config";
export * from "./redis";
export * from "./mongo";
export * from "./express";

import { server, loadExpressMiddleware } from "./express";

export const init = async () => {
  // Open mongodb connection pool
  await initMongoDB();

  // Connect to redis cache
  await initRedis();

  // Attach all express middlewares
  loadExpressMiddleware();
};

export const run = () => {
  server
    .listen(config.port, () => {
      console.log(`Server is running on port ${config.port}`);
    })
    .on("error", (error: Error) => {
      throw new Error(error.message);
    });
};
