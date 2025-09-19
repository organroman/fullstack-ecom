import "dotenv/config";
import { ExpoConfig } from "@expo/config-types";

const defineConfig = (): ExpoConfig => ({
  name: "Ecom Demo",
  slug: "ecom-demo",
  version: "1.0.0",
  scheme: "ecomdemo",
  owner: "organroman",
  orientation: "portrait",
  userInterfaceStyle: "automatic",
  icon: "./assets/icon.png",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  ios: {
    supportsTablet: true,
    userInterfaceStyle: "automatic",
    bundleIdentifier: "com.organroman.ecomdemo",
    buildNumber: "1",
  },
  android: {
    package: "com.organroman.ecomdemo",
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
    versionCode: 1,
  },
  web: {
    bundler: "metro",
    favicon: "./assets/favicon.png",
  },

  plugins: ["expo-router"],
  platforms: ["ios", "android", "web"],

  extra: {
    apiUrl: process.env.EXPO_PUBLIC_API_URL,
    eas: { projectId: "f86f9d4f-0621-4270-9689-1362967451b9" },
  },
});

export default defineConfig;
