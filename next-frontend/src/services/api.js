import axios from "axios";
const API = axios.create({
  baseURL: "http://localhost:5000/api",
  // baseURL: "https://mern-bookstore-backend-o6qf.onrender.com/api",
  withCredentials: true,
});

// ===============================
// 🔁 Refresh token handling
// ===============================

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error = null) => {
  failedQueue.forEach((p) => {
    error ? p.reject(error) : p.resolve();
  });
  failedQueue = [];
};

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Do NOT try to refresh for these
    if (
      error.response?.status !== 401 ||
      originalRequest._retry ||
      originalRequest.url.includes("/auth/refresh-token")
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then(() => API(originalRequest));
    }

    isRefreshing = true;

    try {
      await API.post("/auth/refresh-token");
      processQueue();
      return API(originalRequest);
    } catch (err) {
      processQueue(err);
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  },
);

export default API;
