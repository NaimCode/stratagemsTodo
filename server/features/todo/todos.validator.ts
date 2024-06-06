import { z } from "zod";

const todoStatus = z.enum([
  "BACKLOG",
  "TODO",
  "IN_PROGRESS",
  "DONE",
  "CANCELED",
]);
const todoLabel = z.enum(["BUG", "FEATURE", "DOCUMENTATION"]);
const todoPriority = z.enum(["LOW", "MEDIUM", "HIGH"]);

const create = z.object({
  title: z.string().min(3).max(255),
  body: z.string().min(3).max(255),
  reminder: z.string().optional(),
  status: todoStatus,
  label: todoLabel,
  priority: todoPriority,
});

const update = z.object({
  title: z.string().min(3).max(255).optional(),
  body: z.string().min(3).max(255).optional(),
  reminder: z.date().optional(),
  status: todoStatus.optional(),
  label: todoLabel.optional(),
  priority: todoPriority.optional(),
});

export default { create, update };
