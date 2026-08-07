import { Request, Response } from "express";

import {
  signUp as SignUpService,
  login as loginService,
} from "./auth.service.js";

export async function signUp(req: Request, res: Response) {
  try {
    const newUser = await SignUpService(req.cleanBody);

    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error in signUp controller:", error);
    res.status(500).send({ message: "Something went wrong" });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.cleanBody;
    const result = await loginService(email, password);

    if (!result) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const { token, user } = result;
    res.status(200).json({ token, user });
  } catch (error) {
    console.error("Error in login controller:", error);
    res.status(500).send({ message: "Something went wrong" });
  }
}
