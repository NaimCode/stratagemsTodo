import { object, string } from "zod";

const registerSchema = object({
  name: string().min(3).max(255),
  email: string().email(),
  password: string().min(6),
});

const loginSchema = object({
  email: string().email(),
  password: string().min(6),
});

export default { registerSchema, loginSchema };
