import jwt, { JwtPayload } from "jsonwebtoken";
import { Response, Request, NextFunction } from "express";
import { rolesEnum } from "../db/schema/users";
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
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
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

export function verifySelfOrElevated(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const targetId = Number(req.params.id);

  if (ALLOWED_ROLES.includes(req.role) || req.userId === targetId) {
    return next();
  }

  res.status(403).json({ error: "Access denied" });
}

export function verifyAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.role === "ADMIN") {
    return next();
  }

  res.status(403).json({ error: "Access denied" });
}

