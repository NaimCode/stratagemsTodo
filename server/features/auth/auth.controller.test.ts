import express from "express";
import request from "supertest";

import bcrypt from "bcrypt";
//@ts-ignore
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";
import prisma from "../../Utils/prisma"; // Adjust the import path
import { mockAuthMiddleware } from "../../mocks/mockAuthMiddleware";
import authController from "./auth.controller";

const app = express();
app.use(bodyParser.json());

jest.mock("../../Utils/prisma", () => ({
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  session: {
    create: jest.fn(),
    updateMany: jest.fn(),
    update: jest.fn(),
  },
  token: {
    create: jest.fn(),
    delete: jest.fn(),
  },
}));

jest.mock("bcrypt", () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
}));

jest.mock("../../Utils/nodeMailer", () => ({
  sendEmail: jest.fn(),
}));

// Apply mockAuthMiddleware to protect routes
app.post("/register", authController.register);
app.post("/logout", mockAuthMiddleware, authController.logout);
app.post("/login", authController.login);

describe("Auth Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /register", () => {
    it("should register a new user and return a token", async () => {
      const mockUser = {
        id: "1",
        email: "test@example.com",
        password: "hashedPassword",
        name: "Test User",
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword");
      (prisma.user.create as jest.Mock).mockResolvedValue(mockUser);
      (prisma.session.create as jest.Mock).mockResolvedValue({
        id: "session1",
        userId: "1",
      });
      (jwt.sign as jest.Mock).mockReturnValue("token");

      const response = await request(app).post("/register").send({
        email: "test@example.com",
        password: "password123",
        name: "Test User",
      });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ token: "token" });
    });

    it("should return 400 if the user already exists", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        email: "test@example.com",
      });

      const response = await request(app).post("/register").send({
        email: "test@example.com",
        password: "password123",
        name: "Test User",
      });

      expect(response.status).toBe(400);
      expect(response.text).toBe("USER_ALREADY_EXISTS");
    });
  });

  describe("POST /login", () => {
    it("should log in a user and return a token", async () => {
      const mockUser = {
        id: "1",
        email: "test@example.com",
        password: "hashedPassword",
        name: "Test User",
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (prisma.session.create as jest.Mock).mockResolvedValue({
        id: "session1",
        userId: "1",
      });
      (jwt.sign as jest.Mock).mockReturnValue("token");

      const response = await request(app).post("/login").send({
        email: "test@example.com",
        password: "password123",
      });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ token: "token" });
    });

    it("should return 404 if the user is not found", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      const response = await request(app).post("/login").send({
        email: "test@example.com",
        password: "password123",
      });

      expect(response.status).toBe(404);
      expect(response.text).toBe("USER_NOT_FOUND");
    });

    it("should return 404 if the password is incorrect", async () => {
      const mockUser = {
        id: "1",
        email: "test@example.com",
        password: "hashedPassword",
        name: "Test User",
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const response = await request(app).post("/login").send({
        email: "test@example.com",
        password: "wrongPassword",
      });

      expect(response.status).toBe(404);
      expect(response.text).toBe("INVALID_PASSWORD");
    });
  });

  describe("POST /logout", () => {
    it("should log out the user and deactivate the session", async () => {
      const mockSessionId = "session1";
      (prisma.session.update as jest.Mock).mockResolvedValue({});

      const response = await request(app)
        .post("/logout")
        .set("Authorization", `Bearer mockToken`)
        .send();

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: "LOGOUT" });
    });
  });
});
