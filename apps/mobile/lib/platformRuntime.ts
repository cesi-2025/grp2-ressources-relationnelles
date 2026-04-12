let platformOverride: string | null = null;

export function setPlatformOverrideForTests(os: string | null): void {
  platformOverride = os;
}

export function getPlatformOS(): string {
  if (platformOverride) return platformOverride;

  try {
    // Use runtime require to avoid hard dependency in test environment.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const rn = require("react-native");
    const os = rn?.Platform?.OS;
    if (typeof os === "string") return os;
  } catch {
    // Fall through to safe defaults.
  }

  if (typeof navigator !== "undefined" && /Android/i.test(navigator.userAgent)) {
    return "android";
  }

  if (typeof navigator !== "undefined") {
    return "web";
  }

  return "ios";
}
