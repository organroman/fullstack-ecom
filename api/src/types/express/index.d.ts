import { orderStatusEnum } from "../../db/schema/orders";
import { rolesEnum } from "../../db/schema/users";
import { Request } from "express";

export type RoleType = (typeof rolesEnum)["_type"];
export type OrderStatusType = (typeof orderStatusEnum)["enumValues"][number];

declare global {
  namespace Express {
    export interface Request {
      userId?: number;
      cleanBody?: any;
      role: RoleType;
    }
  }
}
