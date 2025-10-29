import { redis } from "src/system";
import { getUserById, updateUserById, User } from "src/modules/user";
import { UpdateUserPayload } from "../types";

export const getUserKey = (id: string) => {
  return "user:" + id;
};

const getUserFromCache = async (id: string) => {
  const user = await redis.get(getUserKey(id));
  if (user) {
    return JSON.parse(user);
  } else {
    return null;
  }
};

const setUserToCache = async (id: string, user: Partial<User>) => {
  await redis.set(getUserKey(id), JSON.stringify(user));
};

const clearCreds = (user: Partial<User>) => {
  delete user.password;
  return user;
};

const clearUserFromCache = async (id: string) => {
  await redis.del(getUserKey(id));
};

export const getUser = async (id: string) => {
  const user = await getUserById(id);
  if (user) {
    clearCreds(user);
    await setUserToCache(id, Object.assign(user, { id }));
    return user;
  } else {
    const user = await getUserFromCache(id);
    return user;
  }
};

export const updateUser = async (
  userId: string,
  payload: UpdateUserPayload
) => {
  const user = await updateUserById(userId, payload);
  await clearUserFromCache(userId);
  return user;
};

export const isUsernameValid = (username: string) => {
  const regex = /^[a-zA-Z ]*$/;
  return regex.test(username);
};
