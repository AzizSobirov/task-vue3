import axios from "axios";
import { useCookie } from "@/composables/useCookie";

const { setCookie, getCookie, deleteCookie } = useCookie();

// Access the base URL from environment variables
const baseURL = import.meta.env.VITE_API_BASE_URL;

// Create an Axios instance with the base URL from .env
const axiosInstance = axios.create({
  baseURL: baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Dynamically set the Authorization header before each request
axiosInstance.interceptors.request.use((config) => {
  const accessToken = getCookie("accessToken");
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

// Response interceptor to handle token refresh and errors
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 403) {
      originalRequest._retry = true;

      try {
        // Refresh the token
        const refreshToken = getCookie("refreshToken");
        const response = await axiosInstance.post("/auth/refresh/", {
          refresh: refreshToken,
        });

        setCookie("accessToken", response.data.accessToken, 1);
        setCookie("refreshToken", response.data.refreshToken, 7);

        // Retry the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;

        // Retry the original request with the new token
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        deleteCookie("accessToken");
        deleteCookie("refreshToken");

        window.location.href = "/auth";
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
