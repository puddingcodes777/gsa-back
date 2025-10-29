import dotenv from "dotenv";
import { DeepNonNullable, DeepReadonly } from "ts-essentials";

dotenv.config();

const nullableConfig = {
  port: process.env.PORT || 3003,
  domain: process.env.DOMAIN || "https://gsagrading.com",
  mongodb: {
    uri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/gsa",
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: true,
      useCreateIndex: true,
    },
  },
  redis: {
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: process.env.REDIS_PORT || 6379,
  },
  worker: process.env.WORKER,
  jwt: {
    secret: process.env.JWT_SECRET || "secret",
    lifetime: process.env.JWT_LIFETIME || "1h",
  },
  media: {
    bucket: process.env.MEDIA_BUCKET || "media",
    formats: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
  },
  brevo: {
    url: process.env.BREVO_API_URL || "https://api.brevo.com/v3/smtp/email",
    key:
      process.env.BREVO_API_KEY ||
      "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",
    host: {
      name: process.env.BREVO_API_HOST_NAME || "GSA",
      email: process.env.BREVO_API_HOST_MAIL || "abrahan@silverdigitalbus.io",
    },
  },
  stripe: {
    key:
      process.env.STRIPE_API_KEY ||
      "sk_test_51QZAx9AWVLFcnFbzQu3BakY0kOnx4NfORje3x6pwlK8tNdZ0IfNT6Ln20WRjlQFHRlFanPZSh7fVkMueeBV3HXfD00k4UWurzB",
  },
  shippo: {
    key:
      process.env.SHIPPO_API_KEY ||
      "shippo_test_efc5ca34791495e564c82e4edb80f839fa85ac72",
  },
};

type Config = DeepReadonly<DeepNonNullable<typeof nullableConfig>>;

export const config = nullableConfig as Config;
