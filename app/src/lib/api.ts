import axios from "axios";
import { toast } from "sonner";
import useAuthStore from "../state/auth";

const url = import.meta.env.VITE_API_URL as string;

const api = axios.create({
  baseURL: url,
  timeout: 10000,
  // headers: {
  //   "x-api-key": import.meta.env.VITE_API_KEY as string,
  //   "Content-Type": "application/json",
  // },
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;
      if (status === 401) {
        useAuthStore.setState({ token: null });
        document.location.href = "/auth/login";
        //  toast.error("You have been logged out");
      } else if (status === 403) {
        toast.error("You are not allowed to access this resource");
      } else {
        console.error(error.response.data);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
