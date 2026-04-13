import { Platform } from "react-native";

let platformOverride: string | null = null;

export function setPlatformOverrideForTests(os: string | null): void {
  platformOverride = os;
}

export function getPlatformOS(): string {
  if (platformOverride) return platformOverride;

  const os = Platform.OS;
  if (typeof os === "string") return os;

  if (
    typeof navigator !== "undefined" &&
    /Android/i.test(navigator.userAgent)
  ) {
    return "android";
  }

  if (typeof navigator !== "undefined") {
    return "web";
  }

  return "ios";
}
