import { User } from "../documents";

export type UpdateUserPayload = Partial<Omit<User, "uid" | "email">>;

export type UserRole = "customer" | "admin";
