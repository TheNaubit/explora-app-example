import { execFileSync, spawnSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import process from "node:process";

const reportDirectory = "artifacts/maestro";
const releaseNativeFlag = "--release-native";

function findDeviceId() {
  if (process.env.MAESTRO_DEVICE_ID) {
    return process.env.MAESTRO_DEVICE_ID;
  }

  const output = execFileSync("adb", ["devices"], { encoding: "utf8" });
  const devices = output
    .split("\n")
    .slice(1)
    .map((line) => line.trim().split(/\s+/))
    .filter((parts) => parts.length >= 2 && parts[1] === "device")
    .map(([deviceId]) => deviceId);
  const emulators = devices.filter((deviceId) => deviceId.startsWith("emulator-"));

  if (emulators.length === 1) {
    return emulators[0];
  }

  if (devices.length === 1) {
    return devices[0];
  }

  throw new Error("Start one Android emulator, or set MAESTRO_DEVICE_ID to one Android device.");
}

const deviceId = findDeviceId();
const forwardedArguments = process.argv.slice(2);
const isReleaseNativeRun = forwardedArguments.includes(releaseNativeFlag);
const maestroArguments = forwardedArguments.filter((argument) => argument !== releaseNativeFlag);
const reportName = isReleaseNativeRun
  ? "android-release-native-results.xml"
  : "android-results.xml";
const outputDirectory = isReleaseNativeRun ? "android-release-native-run" : "android-run";
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
    ...(isReleaseNativeRun ? [] : ["--exclude-tags", "ios"]),
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
