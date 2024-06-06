/* eslint-disable @typescript-eslint/no-explicit-any */

import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import prisma from "../../Utils/prisma";

const register = async (req: Request, res: Response) => {
  const { email, password, name } = req.body;
  //get all info like browser, ip, etc
  const userAgent = req.get("user-agent");
  const ip = req.ip;

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    return res.status(400).send("USER_ALREADY_EXISTS");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: {
        email: email,
        password: hashedPassword,
        name: name,
      },
    });
    const sessionDuration = process.env.SESSION_DURATION || "7";
    const session = await prisma.session.create({
      data: {
        userId: user.id,
        expiresAt: new Date(
          Date.now() + 1000 * 60 * 60 * 24 * parseInt(sessionDuration)
        ),
        data: {
          agent: userAgent,
          ip: ip,
        },
      },
    });

    const token = jwt.sign(
      {
        sessionId: session.id,
        userId: user.id,
      },
      process.env.JWT_SECRET as string
    );

    res.status(200).json({
      token,
    });
  } catch (error) {
    res.status(400).send("Error while registering");
  }
};

const logout = async (req: Request, res: Response) => {
  const sessionId = (req as any).user.sessionId;
  try {
    await prisma.session.update({
      where: {
        id: sessionId,
      },
      data: {
        isActive: false,
      },
    });
    res.status(200).json({ message: "LOGOUT" });
  } catch (error) {
    res.status(500).send("Error while logging out");
  }
};

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const userAgent = req.get("user-agent");
  const ip = req.ip;

  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(404).send("USER_NOT_FOUND");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(404).send("INVALID_PASSWORD");
    }

    const multiSession = process.env.MULTI_SESSIONS == "true";
    if (!multiSession) {
      await prisma.session.updateMany({
        where: {
          userId: user.id,
        },
        data: {
          isActive: false,
        },
      });
    }
    const sessionDuration = process.env.SESSION_DURATION || "7";

    const session = await prisma.session.create({
      data: {
        userId: user.id,
        expiresAt: new Date(
          Date.now() + 1000 * 60 * 60 * 24 * parseInt(sessionDuration)
        ),
        data: {
          agent: userAgent,
          ip: ip,
        },
      },
    });
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        lastLoggedIn: new Date(),
      },
    });
    const token = jwt.sign(
      {
        sessionId: session.id,
        userId: user.id,
      },
      process.env.JWT_SECRET as string
    );

    res.status(200).json({
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error while logging in");
  }
};

export default { register, logout, login };
