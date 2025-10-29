import { Address } from "../documents";

export type UpdateAddressPayload = Partial<Omit<Address, "user" | "uid">>;

export type CreateAddressPayload = Omit<Address, "uid">;
