import { Request, Response } from "express";
import prisma from "../../Utils/prisma";

const generateSlug = () => {
  return Math.random().toString(36).substring(2, 8);
  //only number
};

const create = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId as string;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const data = req.body;

  await prisma.todo.create({
    data: {
      ...data,
      userId,
      slug: generateSlug(),
    },
  });

  res.sendStatus(201);
};

const get = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId as string;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const todos = await prisma.todo.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  res.status(200).json(todos);
};

const update = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId as string | undefined;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const todoId = req.params.id;
  const data = req.body;
  try {
    await prisma.todo.update({
      where: {
        id: todoId,
        userId,
      },
      data: {
        ...data,
      },
    });

    res.sendStatus(200);
  } catch (error) {
    res.status(400).json({ message: "Something went wrong" });
  }
};

const remove = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId as string;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const todoId = req.params.id;
  try {
    await prisma.todo.delete({
      where: {
        id: todoId,
        userId,
      },
    });

    res.sendStatus(200);
  } catch (error) {
    res.status(400).json({ message: "Something went wrong" });
  }
};

const duplicate = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId as string;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const todoId = req.params.id;
  try {
    const todo = await prisma.todo.findUnique({
      where: {
        id: todoId,
        userId,
      },
    });
    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    const { id, createdAt, updatedAt, slug, ...rest } = todo;
    await prisma.todo.create({
      data: {
        ...rest,
        userId,

        slug: generateSlug(),
      },
    });

    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Something went wrong" });
  }
};

export default { create, get, update, remove, duplicate };
