import { EOrderStatus, Roles, Status } from "@/types/types";

export const USER_ROLES = [
  "All",
  ...Object.values(Roles).filter((role) => isNaN(Number(role))),
];

export const ORDER_STATUSES = [
  ...Object.keys(EOrderStatus).filter((status) => isNaN(Number(status))),
];

export const CATEGORY_STATUSES = [
  "All",
  ...Object.keys(Status).filter((status) => isNaN(Number(status))),
];
