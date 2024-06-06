/* eslint-disable @typescript-eslint/no-explicit-any */
import jwt from "jsonwebtoken";

import { NextFunction, Request, RequestHandler, Response } from "express";
import { StatusCodes } from "http-status-codes";
import prisma from "../../Utils/prisma";

const validateName: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const name = req.body.name;
  const field = "name";
  if (!/^[a-zA-Z ]+$/.test(name)) {
    return res.status(400).json({
      field,
      message: "Name can only contain letters and spaces",
    });
  }
  next();
};

const validateEmail: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const email = req.body.email;
  const field = "email";
  if (!/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({
      field,
      message: "Email is invalid",
    });
  }
  next();
};

const validatePassword: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const password = req.body.password;
  const field = "password";

  if (!/[A-Z]/.test(password)) {
    return res.status(400).json({
      field,
      message: "Password must include at least one uppercase letter",
    });
  }

  if (!/[a-z]/.test(password)) {
    return res.status(400).json({
      field,
      message: "Password must include at least one lowercase letter",
    });
  }

  if (password.length < 8) {
    return res.status(400).json({
      field,
      message: "Password must be at least 8 characters long",
    });
  }

  next();
};

const checkUniqueFields: RequestHandler = async (req, res, next) => {
  const { email, name } = req.body;

  try {
    const existingEmail = await prisma.user.count({
      where: { email },
    });

    if (existingEmail !== 0) {
      return res.status(400).json({
        field: "email",
        message: "Email is already in use",
      });
    }

    const existingName = await prisma.user.count({
      where: { name },
    });

    if (existingName) {
      return res.status(400).json({
        field: "name",
        message: "Name is already taken",
      });
    }

    next();
  } catch (error) {
    res.status(500).send("Error while checking uniqueness");
  }
};

const authenticateJWT: RequestHandler = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "PRIVATE_RESOURCES" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET as string, (err: any, user) => {
    if (err) {
      return res.status(403).json({ message: "Forbidden" });
    }
    (req as any).user = user;
    next();
  });
};

const userExists: RequestHandler = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res
        .status(404)
        .json({ message: "Email not associated with any account" });
    }

    next();
  } catch (error) {
    res.status(500).send("Error while checking user existence");
  }
};

const validateTokenResetPassword: RequestHandler = async (req, res, next) => {
  const tokenId = req.body.token;

  if (!tokenId) {
    return res.status(400).json({ message: "Token is required" });
  }
  try {
    const token = await (prisma as any).token.findUnique({
      where: {
        id: tokenId,
        type: "RESET_PASSWORD",
      },
      include: {
        user: true,
      },
    });

    if (!token) {
      return res.status(404).json({ message: "Token not found" });
    }

    if (token.expiredAt < new Date()) {
      return res.status(400).json({ message: "Token expired" });
    }

    (req as any).user = token.user;

    next();
  } catch (error) {
    console.log("error", error);
    res.status(500).send("Error while validating token");
  }
};

export default {
  validateName,
  validateEmail,
  validatePassword,
  checkUniqueFields,
  authenticateJWT,
  userExists,
  validateTokenResetPassword,
};
