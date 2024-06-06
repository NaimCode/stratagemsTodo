import express from "express";
import { validateSchema } from "../common/common.middleware";
import authController from "./auth.controller";
import authMiddleware from "./auth.middleware";
import authValidator from "./auth.validator";
const router = express.Router();

const { authenticateJWT } = authMiddleware;

router.post(
  "/register",
  validateSchema(authValidator.registerSchema),
  authController.register
);

router.post("/login", authController.login);

router.post("/logout", authMiddleware.authenticateJWT, authController.logout);

const authRouter = router;
export default authRouter;
