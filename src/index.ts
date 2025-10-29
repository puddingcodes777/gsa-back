import { init, run, config, app } from "src/system";
import { parseWorkloadName, runWorkload } from "./workloads";

const bootstrap = async () => {
  await init();
  run();
  load();
};

// Load workload
const load = () => {
  const workloadName = parseWorkloadName(config.worker);
  runWorkload(workloadName, app);
};

bootstrap().catch((error) => {
  console.error(error);
});
