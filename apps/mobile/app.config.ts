import "dotenv/config";
import { ExpoConfig } from "@expo/config-types";

const defineConfig = (): ExpoConfig => ({
  name: "Ecom Demo",
  slug: "ecom-demo",
  version: "1.0.0",
  scheme: "ecomdemo",
  owner: "organroman",
  orientation: "portrait",
  extra: {
    apiUrl: process.env.EXPO_PUBLIC_API_URL,
    eas: { projectId: "f86f9d4f-0621-4270-9689-1362967451b9" },
  },
  ios: {
    supportsTablet: true,
  },
  android: {
    package: "com.yourname.ecomdemo",
  },
});

export default defineConfig;
