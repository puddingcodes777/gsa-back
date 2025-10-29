import { App } from "src/utils/api";
import { workloads, WorkloadName } from "./workloads";

export { parseWorkloadName } from "./workloads";

export const runWorkload = (
  workloadName: WorkloadName | undefined | null,
  app: App
) => {
  if (workloadName) {
    workloads[workloadName].entry(app);
  }
};
