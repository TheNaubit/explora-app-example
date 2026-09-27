import { execFileSync, spawnSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import process from "node:process";

const preferredSimulatorName = "Explora iPhone 18 Pro";
const reportDirectory = "artifacts/maestro";
const releaseNativeFlag = "--release-native";

function findDeviceId() {
  if (process.env.MAESTRO_DEVICE_ID) {
    return process.env.MAESTRO_DEVICE_ID;
  }

  const output = execFileSync("xcrun", ["simctl", "list", "devices", "booted", "--json"], {
    encoding: "utf8",
  });
  const parsed = JSON.parse(output);
  const devices = Object.values(parsed.devices).flat();
  const available = devices.filter((device) => device.isAvailable && device.state === "Booted");
  const preferred = available.find((device) => device.name === preferredSimulatorName);

  if (preferred) {
    return preferred.udid;
  }

  if (available.length === 1) {
    return available[0].udid;
  }

  throw new Error(
    `Boot ${preferredSimulatorName}, or set MAESTRO_DEVICE_ID to one booted iOS Simulator.`,
  );
}

const deviceId = findDeviceId();
const forwardedArguments = process.argv.slice(2);
const isReleaseNativeRun = forwardedArguments.includes(releaseNativeFlag);
const maestroArguments = forwardedArguments.filter((argument) => argument !== releaseNativeFlag);
const reportName = isReleaseNativeRun ? "ios-release-native-results.xml" : "results.xml";
const outputDirectory = isReleaseNativeRun ? "ios-release-native-run" : "run";
const flowTarget = isReleaseNativeRun ? ".maestro/release-flows" : ".maestro";
mkdirSync(reportDirectory, { recursive: true });

const result = spawnSync(
  "maestro",
  [
    "--device",
    deviceId,
    "test",
    ...(isReleaseNativeRun ? [] : ["--config", ".maestro/config.yaml"]),
    "--format",
    "JUNIT",
    "--output",
    `${reportDirectory}/${reportName}`,
    "--test-output-dir",
    `${reportDirectory}/${outputDirectory}`,
    "--exclude-tags",
    "android",
    ...maestroArguments,
    flowTarget,
  ],
  {
    env: {
      ...process.env,
      MAESTRO_CLI_ANALYSIS_NOTIFICATION_DISABLED: "true",
      MAESTRO_CLI_NO_ANALYTICS: "true",
      MAESTRO_DRIVER_STARTUP_TIMEOUT: process.env.MAESTRO_DRIVER_STARTUP_TIMEOUT ?? "120000",
    },
    stdio: "inherit",
  },
);

if (result.error) {
  throw result.error;
}

process.exit(result.status ?? 1);
