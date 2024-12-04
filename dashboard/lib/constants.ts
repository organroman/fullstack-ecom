import { Roles } from "@/types/types";

export const USER_ROLES = [
  "All",
  ...Object.values(Roles).filter((role) => isNaN(Number(role))),
];
