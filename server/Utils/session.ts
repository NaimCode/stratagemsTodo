/* eslint-disable @typescript-eslint/no-var-requires */
const session = require("express-session");
// @ts-ignore
import * as dotenv from "dotenv";
import { RequestHandler } from "express";
dotenv.config();
const sessionDuration = process.env.SESSION_DURATION || "7";
const sessionConfig = {
  secret: process.env.SESSION_SECRET,

  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * parseInt(sessionDuration),
    secure: false,
  },
};

export const sessionMiddleware: RequestHandler = session(sessionConfig);
