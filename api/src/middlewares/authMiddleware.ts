import jwt, { JwtPayload } from "jsonwebtoken";
import { Response, Request, NextFunction } from "express";
import { rolesEnum } from "../db/usersSchema";
import { ALLOWED_ROLES } from "../utils/constants";

export interface TokenPayload extends JwtPayload {
  userId: string;
  role: typeof rolesEnum;
}

export function verifyToken(req: Request, res: Response, next: NextFunction) {
  const token = req.header("Authorization");

  if (!token) {
    res.status(401).json({ error: "Access denied" });

    return;
  }

  try {
    const decoded = jwt.verify(token, "your-secret") as TokenPayload;
    if (!decoded?.userId) {
      res.status(401).json({ error: "Access denied" });
      return;
    }

    req.userId = Number(decoded.userId);
    req.role = decoded.role;

    next();
  } catch (e) {
    res.status(401).json({ error: "Access denied" });
  }
}

export function verifySeller(req: Request, res: Response, next: NextFunction) {
  const role = req.role;

  if (!ALLOWED_ROLES.includes(role)) {
    res.status(401).json({
      error: "Access denied",
      message: `Role '${role}' is not authorized to perform this action.`,
    });

    return;
  }

  next();
}
