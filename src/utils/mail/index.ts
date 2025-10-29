import jwt from "jsonwebtoken";
import fetch from "cross-fetch";
import { config } from "src/system";
import { getEmailContent } from "./template";

const generateLink = (email: string, password: string): string => {
  const token = jwt.sign({ email, password }, config.jwt.secret, {
    expiresIn: "10m",
  });

  return `${config.domain}/api/auth/verify?token=${token}`;
};

export const sendEmail = async (email: string, password: string) => {
  try {
    const response = await fetch(config.brevo.url, {
      method: "POST",
      headers: {
        "api-key": config.brevo.key,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: {
          name: config.brevo.host.name,
          email: config.brevo.host.email,
        },
        to: [{ email }],
        subject: "Verification code for your GSA account",
        htmlContent: getEmailContent(generateLink(email, password)),
      }),
    });
    const result =  await response.json();
    
    return result.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
