import Constants from "expo-constants";

// export const API_URL = process.env.EXPO_PUBLIC_API_URL;
export const API_URL = Constants.expoConfig?.extra?.apiUrl;
