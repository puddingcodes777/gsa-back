import bcrypt from "bcrypt";
import jwt, {
  JwtPayload,
  JsonWebTokenError,
  TokenExpiredError,
} from "jsonwebtoken";
import { customAlphabet } from "nanoid";
import { config } from "src/system";
import {
  createUser,
  getUserByEmail,
  getUserDocByEmail,
  getUserById,
  updateUserById,
} from "../documents";
import { sendEmail } from "src/utils/mail";
import { ApiValidationError, InternalError } from "src/utils/errors";

const nanoid = customAlphabet("1234567890", 10);

export const isPasswordValid = (value: string) => {
  return value.length > 7;
};

export const checkEmail = async (email: string) => {
  const user = await getUserByEmail(email);
  if (user) {
    return true;
  }

  return false;
};

export const doSignup = async (email: string, password: string) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  const user = await getUserByEmail(email);
  if (user) {
    throw new ApiValidationError("User already exists");
  }

  await sendEmail(email, hash);
};

export const doLogin = async (
  email: string,
  password: string
) => {
  const userDoc = await getUserDocByEmail(email);
  if (!userDoc) {
    throw new ApiValidationError("User not exists");
  }

  const isMatch = await bcrypt.compare(password, userDoc.password);
  if (!isMatch) {
    throw new ApiValidationError("Password is incorrect");
  }

  const payload = { id: userDoc.id };
  const token = jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.lifetime,
  });

  return {token, user: userDoc};
};

export const doVerify = async (token: string) => {
  try {
    const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;
    if (decoded.email && decoded.password) {
      const uid = nanoid();
      await createUser(decoded.email, decoded.password, uid);
    } else {
      throw new ApiValidationError("Token is incorrect");
    }
  } catch (e) {
    if (e instanceof TokenExpiredError) {
      throw new ApiValidationError("Token is expired");
    }

    if (e instanceof JsonWebTokenError) {
      throw new ApiValidationError("Token is invalid");
    }
    
    throw new InternalError("Unexpected error for verification");
  }
};

export const changePassword = async (
  oldPassword: string,
  newPassword: string,
  userId: string
) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new InternalError("User id is invalid");
  }

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) {
    throw new ApiValidationError("Old password is incorrect");
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(newPassword, salt);
  await updateUserById(userId, { password: hash });
};
