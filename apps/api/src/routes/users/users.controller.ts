import { Request, Response } from "express";

import { RoleType } from "../../types/express/index.js";
import {
  updateUser as updateUserService,
  createUser as createUserService,
  listUsers as listUsersService,
  getUserById as getUserByIdService,
  changePassword as changePasswordService,
} from "./users.service.js";
import { getErrorMessage, getStatusCode } from "../../utils/httpError.js";

export async function updateUser(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id);

    if (!Number.isInteger(Number(id))) {
      res.status(400).send({ message: "Invalid user id" });
      return;
    }

    const updatedUser = await updateUserService(id, req.cleanBody);

    if (!updatedUser) {
      res.status(404).send({ message: "User not found" });
      return;
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Something went wrong" });
  }
}

export async function createUser(req: Request, res: Response) {
  try {
    const user = await createUserService(req.cleanBody);
    if (!user) {
      res.status(400).send({ message: "User could not be created" });
      return;
    }
    res.status(201).json(user);
  } catch (e) {
    console.error(e);
    res.status(500).send({ message: "Something went wrong" });
  }
}

export async function changePassword(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id);
    let { oldPassword, password } = req.body;
    const updatedUserWithToken = await changePasswordService(
      id,
      oldPassword,
      password,
    );

    res.status(200).json(updatedUserWithToken);
  } catch (error) {
    console.error(`Error in changePassword controller:`, error);
    res.status(getStatusCode(error)).send({ message: getErrorMessage(error) });
  }
}

export async function listUsers(req: Request, res: Response) {
  try {
    const page = Math.max(1, Number(req.query.page as string) || 1);
    const limit = Math.min(
      100,
      Math.max(1, Number(req.query.limit as string) || 10),
    );

    const searchPhrase =
      typeof req.query.search === "string" ? req.query.search.trim() : "";

    const result = await listUsersService({
      page,
      limit,
      searchPhrase,
      filterRole: req.query.role as RoleType,
    });

    res.status(200).json(result);
  } catch (error) {
    console.error(`Error in listUsers controller:`, error);
    res.status(500).send({ message: "Something went wrong" });
  }
}

export async function getUserById(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id);

    if (!Number.isInteger(Number(id))) {
      res.status(400).send({ message: "Invalid user id" });
      return;
    }

    const user = await getUserByIdService(id);

    if (!user) {
      res.status(404).send({ message: "User not found" });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(`Error in getUserById controller:`, error);
    res.status(500).send({ message: "Something went wrong" });
  }
}
