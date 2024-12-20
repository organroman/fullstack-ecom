import config from "@/tailwind.config";
import { Theme } from "@/types/types";
import resolveConfig from "tailwindcss/resolveConfig";

const tailwind = resolveConfig(config);
export const STATUS_COLOR = {
  New: "text-gray-500",
  Delivered: "text-green-500",
  Cancelled: "text-red-500",
};

export const SEARCH_BAR_TEXT_COLOR = tailwind.theme.colors.zinc[700];

export const BORDER_COLOR = tailwind.theme.colors.blue[500];

export const BAR_TINT_COLOR = tailwind.theme.colors.zinc[300];

export const BG_COLOR = (theme: Theme) =>
  theme === "dark" ? tailwind.theme.colors.black : tailwind.theme.colors.white;

export const BG_ACCENT_COLOR = (theme: Theme) =>
  theme === "dark"
    ? tailwind.theme.colors.zinc[800]
    : tailwind.theme.colors.neutral[200];

export const TEXT_COLOR = (theme: Theme) =>
  theme === "dark"
    ? tailwind.theme.colors.zinc[300]
    : tailwind.theme.colors.zinc[700];
