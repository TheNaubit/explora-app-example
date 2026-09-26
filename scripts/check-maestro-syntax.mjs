import { readdirSync } from "node:fs";
import { spawnSync } from "node:child_process";
import process from "node:process";

const flowDirectories = [".maestro/flows", ".maestro/release-flows", ".maestro/subflows"];
const flowFiles = flowDirectories.flatMap((flowDirectory) =>
  readdirSync(flowDirectory)
    .filter((file) => file.endsWith(".yaml"))
    .sort()
    .map((file) => `${flowDirectory}/${file}`),
);

for (const flowFile of flowFiles) {
  const result = spawnSync("maestro", ["check-syntax", flowFile], {
    env: {
      ...process.env,
      MAESTRO_CLI_ANALYSIS_NOTIFICATION_DISABLED: "true",
      MAESTRO_CLI_NO_ANALYTICS: "true",
    },
    stdio: "inherit",
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}
