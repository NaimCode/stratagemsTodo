export type User = {
  id: number;
  email: string;
  name: string;
  registeredAt: Date;
  updatedAt?: Date;
};

export type TodoStatus =
  | "BACKLOG"
  | "TODO"
  | "IN_PROGRESS"
  | "DONE"
  | "CANCELED";
export type TodoLabel = "BUG" | "FEATURE" | "DOCUMENTATION";
export type TodoPriority = "LOW" | "MEDIUM" | "HIGH";
export type Todo = {
  id: string;
  slug: string;
  title: string;
  body: string;
  reminder?: string;
  status: TodoStatus;
  label: TodoLabel;
  priority: TodoPriority;
  userId: number;
  createdAt: Date;
  updatedAt?: Date;
};
