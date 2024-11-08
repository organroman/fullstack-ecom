import { Request } from "express";

declare global {
  namespace Express {
    export interface Request {
      userId?: number;
      cleanBody?: any;
      role: string;
    }
  }
}
