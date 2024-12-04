import { EOrderStatuses, Roles } from "@/types/types";

export const USER_ROLES = [
  "All",
  ...Object.values(Roles).filter((role) => isNaN(Number(role))),
];

export const ORDER_STATUSES = [
  "All",
  ...Object.keys(EOrderStatuses).filter((status) => isNaN(Number(status))),
];
