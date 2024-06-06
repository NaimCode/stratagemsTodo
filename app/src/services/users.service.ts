import api from "@/lib/api";
import { User } from "@/type";

export default {
  me: () => api.get<User>("/users/me").then((res) => res.data),
};
