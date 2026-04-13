import type { ExpoConfig } from "@expo/config-types";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import appJson from "./app.json";

function readEnvFileVar(filePath: string, key: string): string | undefined {
  if (!fs.existsSync(filePath)) return undefined;
  const content = fs.readFileSync(filePath, "utf8");
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx <= 0) continue;
    const k = trimmed.slice(0, idx).trim();
    if (k !== key) continue;
    return trimmed.slice(idx + 1).trim();
  }
  return undefined;
}

const rootEnvPath = path.resolve(__dirname, "../../.env");
const appUrl = readEnvFileVar(rootEnvPath, "APP_URL");
const apiPrefix = readEnvFileVar(rootEnvPath, "API_PREFIX") ?? "/api";

function getLanIPv4(): string | null {
  const interfaces = os.networkInterfaces();
  for (const entries of Object.values(interfaces)) {
    for (const entry of entries ?? []) {
      if (entry.family !== "IPv4" || entry.internal) continue;
      const ip = entry.address;
      if (
        ip.startsWith("10.") ||
        ip.startsWith("192.168.") ||
        /^172\.(1[6-9]|2\d|3[0-1])\./.test(ip)
      ) {
        return ip;
      }
    }
  }
  return null;
}

function resolveApiBaseUrl(rawUrl?: string): string | undefined {
  if (!rawUrl) return undefined;
  try {
    const url = new URL(rawUrl);
    if (url.hostname === "localhost" || url.hostname === "127.0.0.1") {
      const lanIp = getLanIPv4();
      if (lanIp) {
        url.hostname = lanIp;
      }
    }
    return url.toString().replace(/\/+$/, "");
  } catch {
    return rawUrl;
  }
}

const resolvedApiBaseUrl = resolveApiBaseUrl(appUrl);

if (resolvedApiBaseUrl) {
  process.env.EXPO_PUBLIC_API_URL = resolvedApiBaseUrl;
}
process.env.EXPO_PUBLIC_API_PREFIX = apiPrefix;

export default (): ExpoConfig => {
  return {
    ...appJson.expo,
    extra: {
      ...(appJson.expo.extra ?? {}),
      apiBaseUrl: resolvedApiBaseUrl,
      apiPrefix,
    },
  };
};
