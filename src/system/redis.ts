import { createClient } from "redis";
import { config } from "./config";

export const redis = createClient({
  socket: {
    host: config.redis.host,
    port: config.redis.port as number,
  },
});

redis.on("error", (error) => {
  console.error("Redis client error", error);
});

export const initRedis = async () => {
  try {
    await redis.connect();
    console.log("Redis connected");
  } catch (error) {
    const msg = (error as Error).message;
    throw new Error(msg);
  }
};
