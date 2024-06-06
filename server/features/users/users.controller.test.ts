import express from "express";
import request from "supertest";
//@ts-ignore
import bodyParser from "body-parser";
import prisma from "../../Utils/prisma"; // Adjust the import path
import { mockAuthMiddleware } from "../../mocks/mockAuthMiddleware";
import usersController from "./users.controller";

const app = express();
app.use(bodyParser.json());

jest.mock("../../Utils/prisma", () => ({
  user: {
    findUnique: jest.fn(),
    update: jest.fn(),
  },
}));

// Apply middleware to mock user authentication
app.get("/me", mockAuthMiddleware, usersController.me);
app.put("/update", mockAuthMiddleware, usersController.update);

describe("User Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  const mockUserId = "12345";
  const mockUser = {
    id: mockUserId,
    name: "Test User",
    email: "test@example.com",
  };
  describe("GET /me", () => {
    it("should return user information", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const response = await request(app)
        .get("/me")
        .set("Authorization", "Bearer mockToken")
        .send();

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUser);
    });

    it("should return 500 if an error occurs", async () => {
      (prisma.user.findUnique as jest.Mock).mockRejectedValue(
        new Error("Database error")
      );

      const response = await request(app)
        .get("/me")
        .set("user", JSON.stringify({ userId: mockUserId }))
        .send();

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: "Something went wrong" });
    });
  });

  describe("PUT /update", () => {
    it("should update user information", async () => {
      const mockUserId = "12345";
      const mockUpdatedData = {
        name: "Updated User",
        email: "updated@example.com",
      };

      (prisma.user.update as jest.Mock).mockResolvedValue({ id: mockUserId });

      const response = await request(app)
        .put("/update")
        .set("user", JSON.stringify({ userId: mockUserId }))
        .send(mockUpdatedData);

      expect(response.status).toBe(200);
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: mockUserId },
        data: mockUpdatedData,
      });
    });

    it("should return 500 if an error occurs", async () => {
      const mockUpdatedData = {
        name: "Updated User",
        email: "updated@example.com",
      };

      (prisma.user.update as jest.Mock).mockRejectedValue(
        new Error("Database error")
      );

      const response = await request(app)
        .put("/update")
        .set("user", JSON.stringify({ userId: mockUserId }))
        .send(mockUpdatedData);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: "Something went wrong" });
    });
  });
});
