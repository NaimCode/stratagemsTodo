import express from "express";
import authMiddleware from "../auth/auth.middleware";
import usersController from "./users.controller";
const router = express.Router();

const { authenticateJWT } = authMiddleware;

router.put("/", authenticateJWT, usersController.update);
router.get("/me", authenticateJWT, usersController.me);

const usersRouter = router;
export default usersRouter;
