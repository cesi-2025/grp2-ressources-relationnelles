// apps/mobile/src/theme.ts
const theme = {
    colors: {
        background: "#ffffff",
        foreground: "#1D3A6D",

        // Palette primaire
        primary: "#1D3A6D",
        primaryLight: "#2D4A7D",
        primaryDark: "#0D2A5D",

        // Palette secondaire
        secondary: "#4CAF50",
        secondaryLight: "#66BB6A",
        secondaryDark: "#388E3C",

        // Accent
        accent: "#FFC107",
        accentLight: "#FFD54F",
        accentDark: "#FFA000",

        // Grays
        gray50: "#F9FAFB",
        gray100: "#F3F4F6",
        gray200: "#E5E7EB",
        gray300: "#D1D5DB",
        gray400: "#9CA3AF",
        gray500: "#6B7280",
        gray600: "#4B5563",
        gray700: "#374151",
        gray800: "#1F2937",
        gray900: "#111827",
    },

    fonts: {
        sans: "Inter",
        mono: "Menlo",
    },

    radius: {
        sm: 6,
        md: 8,
        lg: 12,
        xl: 16,
    },
} as const;

export default theme;
