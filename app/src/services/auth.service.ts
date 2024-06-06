import api from "@/lib/api";
import useAuthStore from "@/state/auth";

const logout = async () =>
  api.post("/auth/logout").then(() => {
    useAuthStore.getState().clear();
  });

const register = ({
  data,
}: {
  data: {
    email: string;
    name: string;
    password: string;
  };
}) => {
  return api.post<{ token: string }>(`/auth/register`, data).then((res) => {
    if (res.data?.token) {
      useAuthStore.getState().setToken(res.data.token);
    }
  });
};

const login = ({ email, password }: { email: string; password: string }) => {
  return api
    .post<{ token: string }>(`/auth/login`, { email, password })
    .then((res) => {
      if (res.data?.token) {
        useAuthStore.getState().setToken(res.data.token);
      }
    });
};

export default { logout, register, login };
