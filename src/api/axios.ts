import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to automatically attach JWT token if stored
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for automatic logout on 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check if error is 401 Unauthorized
    if (error.response && error.response.status === 401) {
      // Prevent infinite redirect loops by checking current path
      const currentPath = window.location.pathname;
      
      // Don't redirect if already on login or public routes
      const isPublicRoute = 
        currentPath === "/" || 
        currentPath === "/login" || 
        currentPath === "/register" || 
        currentPath.startsWith("/forgot-password") || 
        currentPath.startsWith("/reset-password");
      
      // Only clear auth if not on public route
      if (!isPublicRoute) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        // Redirect to login (router will handle navigation when component mounts)
        // Don't do window.location here to let React Router handle it
      }
    }
    return Promise.reject(error);
  }
);

export default api;
