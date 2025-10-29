import {
  DistanceUnitEnum,
  LabelFileTypeEnum,
  Shippo,
  WeightUnitEnum,
} from "shippo";
import { CreateAddressPayload, User } from "src/modules/user";
import { config } from "src/system";

const shippo = new Shippo({ apiKeyHeader: config.shippo.key });

export const createShippoAddress = async (
  payload: CreateAddressPayload,
  user: Partial<User>
) => {
  try {
    const address = await shippo.addresses.create({
      name: user.name ? user.name : "Unknown",
      company: "GSA",
      street1: payload.street,
      city: payload.city,
      state: payload.state,
      zip: payload.code,
      country: payload.country,
      phone: payload.phone,
      email: user.email,
      validate: true,
    });

    if (!address.validationResults?.isValid) {
      return null;
    }

    if (address.zip?.slice(0, 5) !== payload.code) {
      return null;
    }
    return address.objectId;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const createShipment = async (address: string) => {
  const parcel = await shippo.parcels.create({
    metadata: "GSA Cards",
    length: "9",
    width: "12",
    height: "2",
    distanceUnit: DistanceUnitEnum.In,
    weight: "30",
    massUnit: WeightUnitEnum.Oz,
  });

  if (!parcel.objectId) {
    return null;
  }

  const shipment = await shippo.shipments.create({
    addressFrom: address,
    addressTo: {
      name: "Service",
      company: "GSA",
      street1: "965 Mission St.",
      city: "San Francisco",
      state: "CA",
      zip: "94105",
      country: "US",
      metadata: "Company Main Address",
    },
    parcels: [parcel.objectId],
    carrierAccounts: ["b07c1a5eba1441ad86c8dcce829b9087"],
    extra: {
      qrCodeRequested: true,
    },
    metadata: "GSA Cards Shipment",
    async: false,
  });

  if (shipment.status !== "SUCCESS") {
    return null;
  }

  if (shipment.rates.length < 1) {
    return null;
  }

  return shipment.objectId;
};

export const getBestPriceForShipment = async (id: string) => {
  const shipment = await shippo.shipments.get(id);
  const rate = shipment.rates[0];

  return rate.amount;
};

export const createTransaction = async (shipmentId: string) => {
  const shipment = await shippo.shipments.get(shipmentId);
  const rate = shipment.rates[0];

  const transaction = await shippo.transactions.create({
    rate: rate.objectId,
    labelFileType: LabelFileTypeEnum.Pdf,
    async: false,
  });

  if (transaction.status !== "SUCCESS") {
    return null;
  }

  if (!transaction.objectId || !transaction.trackingNumber) {
    return null;
  }

  return {
    uid: transaction.objectId,
    trackId: transaction.trackingNumber,
    qrCode: transaction.qrCodeUrl,
  };
};

export const getTrackInfo = async (trackId: string) => {
  return await shippo.trackingStatus.get("SHIPPO_PRE_TRANSIT", "shippo");
};
