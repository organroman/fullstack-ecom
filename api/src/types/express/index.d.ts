import { rolesEnum } from "./../../db/usersSchema";
import { Request } from "express";

export type RoleType = (typeof rolesEnum)["_type"];

declare global {
  namespace Express {
    export interface Request {
      userId?: number;
      cleanBody?: any;
      role: RoleType;
    }
  }
}
