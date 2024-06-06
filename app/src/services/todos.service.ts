/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "@/lib/api";
import { Todo } from "@/type";

export default {
  create: (data: any) => api.post<void>("/todos", data),
  get: () => api.get<Todo[]>("/todos").then((res) => res.data),
  update: ({ id, data }: { id: string; data: any }) =>
    api.put<void>(`/todos/${id}`, data),
  remove: (id: string) => api.delete<void>(`/todos/${id}`),
  duplicate: (id: string) => api.post<void>(`/todos/${id}/duplicate`),
};
