import { apiWorkload } from "./api";
import { apiAdminWorkload } from "./api-admin";

export const workloads = {
  api: apiWorkload,
  "api-admin": apiAdminWorkload,
};

export type WorkloadName = keyof typeof workloads;

export const isWorkloadName = (value: unknown): value is WorkloadName => {
  return Object.keys(workloads).includes(value as string);
};

export const parseWorkloadName = (workload: string) => {
  const isModernWorkload = isWorkloadName(workload);

  if (isModernWorkload) {
    return workload;
  }

  if (workload === "") {
    return undefined;
  }

  return null;
};
