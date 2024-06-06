import express from "express";
import authMiddleware from "../auth/auth.middleware";
import { validateSchema } from "../common/common.middleware";
import todosController from "./todos.controller";
import todosValidator from "./todos.validator";
const router = express.Router();

const { authenticateJWT } = authMiddleware;

router.post(
  "/",
  authenticateJWT,
  validateSchema(todosValidator.create),
  todosController.create
);
router.get("/", authenticateJWT, todosController.get);
router.put(
  "/:id",
  authenticateJWT,
  validateSchema(todosValidator.update),
  todosController.update
);
router.delete("/:id", authenticateJWT, todosController.remove);
router.post("/:id/duplicate", authenticateJWT, todosController.duplicate);

const todosRouter = router;
export default todosRouter;
