import { useTheme } from "@/components/ui/ThemeProvider";
import config from "@/tailwind.config";
import { Theme, ThemeContextType } from "@/types/types";
import resolveConfig from "tailwindcss/resolveConfig";

const tailwind = resolveConfig(config);
export const STATUS_COLOR = {
  New: "text-gray-500",
  Delivered: "text-green-500",
  Cancelled: "text-red-500",
};

export const bgColor = (theme: Theme) =>
  theme === "dark"
    ? tailwind.theme.colors.zinc[900]
    : tailwind.theme.colors.zinc[100];

export const safeAreaViewBg = (theme: Theme) =>
  theme === "dark" ? "bg-zinc-100" : "bg-zinc-900";

export const barTintColor = (theme: Theme) =>
  theme === "dark"
    ? tailwind.theme.colors.zinc[500]
    : tailwind.theme.colors.zinc[100];

export const borderColor = tailwind.theme.colors.blue[500];

export const headerColorText = (theme: Theme) =>
  theme === "dark"
    ? tailwind.theme.colors.zinc[200]
    : tailwind.theme.colors.zinc[700];

export const tabBarColor = (theme: Theme) =>
  theme === "dark"
    ? tailwind.theme.colors.zinc[400]
    : tailwind.theme.colors.zinc[700];

export const tabBarColorActive = tailwind.theme.colors.blue[500];

