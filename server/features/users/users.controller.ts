import { Request, Response } from "express";
import prisma from "../../Utils/prisma";

const me = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

const update = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId as string;

  const data = req.body;
  try {
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...data,
      },
    });

    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export default { me, update };
