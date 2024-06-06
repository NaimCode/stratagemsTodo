// @ts-ignore
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
// @ts-ignore
import dotenv from "dotenv";
import express, { Express } from "express";
// @ts-ignore
import helmet from "helmet";
import hpp from "hpp";
import { sessionMiddleware } from "./Utils/session";
import authRouter from "./features/auth/auth.route";
import { errorHandler } from "./features/common/common.middleware";
import todosRouter from "./features/todo/todos.router";
import usersRouter from "./features/users/users.route";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(hpp());
app.use(bodyParser.json());
app.use(errorHandler);
// app.use(apiKeyMiddleware);

const corsOptions = {
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  meathods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  // optionsSuccessStatus: 200,
  // credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(express.json());

app.use(cookieParser());
app.use(sessionMiddleware);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

app.use("/auth", authRouter);
app.use("/users", usersRouter);
app.use("/todos", todosRouter);
