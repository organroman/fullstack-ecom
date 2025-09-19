import "dotenv/config";
import { ExpoConfig } from "@expo/config-types";

const defineConfig = (): ExpoConfig => ({
  name: "Ecom Demo",
  slug: "ecom-demo",
  version: "1.0.0",
  scheme: "ecomdemo",
  owner: "organroman",
  orientation: "portrait",
  userInterfaceStyle: "automatic", // ✅ fixes warning
  icon: "./assets/icon.png",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  ios: {
    supportsTablet: true,
    userInterfaceStyle: "automatic", // optional, can mirror global
  },
  android: {
    package: "com.yourname.ecomdemo",
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
  },
  web: {
    bundler: "metro",
    favicon: "./assets/favicon.png",
  },
  plugins: ["expo-router"],
  extra: {
    apiUrl: process.env.EXPO_PUBLIC_API_URL,
    eas: { projectId: "f86f9d4f-0621-4270-9689-1362967451b9" },
  },
});

export default defineConfig;
