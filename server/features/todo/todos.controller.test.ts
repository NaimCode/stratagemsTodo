// @ts-ignore
import { PrismaClient } from "@prisma/client";
// @ts-ignore
import bodyParser from "body-parser";
import express from "express";
import request from "supertest";
import { mockAuthMiddleware } from "../../mocks/mockAuthMiddleware";
import todosController from "./todos.controller";

const app = express();
app.use(bodyParser.json());
const prisma = new PrismaClient();

jest.mock("@prisma/client", () => {
  const mockPrismaClient = {
    todo: {
      create: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findUnique: jest.fn(),
    },
  };
  return {
    PrismaClient: jest.fn(() => mockPrismaClient),
  };
});

app.post("/todos", mockAuthMiddleware, todosController.create);
app.get("/todos", mockAuthMiddleware, todosController.get);
app.put("/todos/:id", mockAuthMiddleware, todosController.update);
app.delete("/todos/:id", mockAuthMiddleware, todosController.remove);
app.post("/todos/:id/duplicate", mockAuthMiddleware, todosController.duplicate);

describe("Todo Controller", () => {
  const mockUserId = "12345";
  const mockTodoId = "67890";
  const mockTodo = {
    id: mockTodoId,
    title: "Test Todo",
    description: "This is a test todo",
    userId: mockUserId,
    slug: "test-todo",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /todos", () => {
    it("should create a new todo and return 201 status", async () => {
      const mockData = {
        title: "New Todo",
        description: "New todo description",
      };

      (prisma.todo.create as jest.Mock).mockResolvedValue({
        ...mockData,
        userId: mockUserId,
        slug: "new-todo",
      });

      const response = await request(app)
        .post("/todos")
        .set("user", JSON.stringify({ userId: mockUserId }))
        .send(mockData);

      expect(response.status).toBe(201);
      expect(prisma.todo.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          ...mockData,
          userId: mockUserId,
          slug: expect.any(String),
        }),
      });
    });
  });

  describe("GET /todos", () => {
    it("should return a list of todos and 200 status", async () => {
      (prisma.todo.findMany as jest.Mock).mockResolvedValue([mockTodo]);

      const response = await request(app)
        .get("/todos")
        .set("user", JSON.stringify({ userId: mockUserId }));

      expect(response.status).toBe(200);
      expect(response.body).toEqual([mockTodo]);
      expect(prisma.todo.findMany).toHaveBeenCalledWith({
        where: { userId: mockUserId },
        orderBy: { createdAt: "desc" },
      });
    });
  });

  describe("PUT /todos/:id", () => {
    it("should update a todo and return 200 status", async () => {
      const mockData = {
        title: "Updated Todo",
        description: "Updated description",
      };

      (prisma.todo.update as jest.Mock).mockResolvedValue({
        ...mockTodo,
        ...mockData,
      });

      const response = await request(app)
        .put(`/todos/${mockTodoId}`)
        .set("user", JSON.stringify({ userId: mockUserId }))
        .send(mockData);

      expect(response.status).toBe(200);
      expect(prisma.todo.update).toHaveBeenCalledWith({
        where: { id: mockTodoId, userId: mockUserId },
        data: expect.objectContaining(mockData),
      });
    });

    it("should return 400 status if update fails", async () => {
      (prisma.todo.update as jest.Mock).mockRejectedValue(
        new Error("Update failed")
      );

      const response = await request(app)
        .put(`/todos/${mockTodoId}`)
        .set("user", JSON.stringify({ userId: mockUserId }))
        .send({ title: "Failed Update" });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: "Something went wrong" });
    });
  });

  describe("DELETE /todos/:id", () => {
    it("should delete a todo and return 200 status", async () => {
      (prisma.todo.delete as jest.Mock).mockResolvedValue(mockTodo);

      const response = await request(app)
        .delete(`/todos/${mockTodoId}`)
        .set("user", JSON.stringify({ userId: mockUserId }));

      expect(response.status).toBe(200);
      expect(prisma.todo.delete).toHaveBeenCalledWith({
        where: { id: mockTodoId, userId: mockUserId },
      });
    });

    it("should return 400 status if delete fails", async () => {
      (prisma.todo.delete as jest.Mock).mockRejectedValue(
        new Error("Delete failed")
      );

      const response = await request(app)
        .delete(`/todos/${mockTodoId}`)
        .set("user", JSON.stringify({ userId: mockUserId }));

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: "Something went wrong" });
    });
  });

  describe("POST /todos/:id/duplicate", () => {
    it("should duplicate a todo and return 201 status", async () => {
      (prisma.todo.findUnique as jest.Mock).mockResolvedValue(mockTodo);
      (prisma.todo.create as jest.Mock).mockResolvedValue({
        ...mockTodo,
        id: "newId",
        slug: "duplicated-todo",
      });

      const response = await request(app)
        .post(`/todos/${mockTodoId}/duplicate`)
        .set("user", JSON.stringify({ userId: mockUserId }));

      expect(response.status).toBe(201);
      expect(prisma.todo.findUnique).toHaveBeenCalledWith({
        where: { id: mockTodoId, userId: mockUserId },
      });
    });

    it("should return 404 status if todo to duplicate is not found", async () => {
      (prisma.todo.findUnique as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .post(`/todos/${mockTodoId}/duplicate`)
        .set("user", JSON.stringify({ userId: mockUserId }));

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: "Todo not found" });
    });
  });
});
