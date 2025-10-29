import { ApiValidationError } from "src/utils/errors";
import {
  createAddress,
  deleteAddressById,
  getAddressById,
  updateAddressById,
  User,
} from "../documents";
import { CreateAddressPayload, UpdateAddressPayload } from "../types";
import { createShippoAddress } from "src/utils/shippo";

export const createValidatedAddress = async (
  address: CreateAddressPayload,
  user: Partial<User>
) => {
  const uid = await createShippoAddress(address, user);
  if (!uid) {
    throw new ApiValidationError("Address format is invalid");
  }

  await createAddress({ ...address, uid });
};

export const updateAddress = async (
  userId: string,
  id: string,
  payload: UpdateAddressPayload,
  user: Partial<User>
) => {
  const address = await getAddressById(id);
  if (address) {
    if (address.user.equals(userId)) {
      const uid = await createShippoAddress({ ...address, ...payload }, user);
      if (!uid) {
        throw new ApiValidationError("Address format is invalid");
      }

      await updateAddressById(id, { ...payload, uid });
    } else {
      throw new ApiValidationError("Address id is incorrect");
    }
  } else {
    throw new ApiValidationError("Address id is invalid");
  }
};

export const deleteAddress = async (userId: string, id: string) => {
  const address = await getAddressById(id);
  if (address) {
    if (address.user.equals(userId)) {
      await deleteAddressById(id);
    } else {
      throw new ApiValidationError("Address id is incorrect");
    }
  } else {
    throw new ApiValidationError("Address id is invalid");
  }
};

export const isValidZip = (value: string) => {
  const regex = /^\d{5}$/;
  return regex.test(value);
};
