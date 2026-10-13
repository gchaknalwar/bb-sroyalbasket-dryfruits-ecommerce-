import axios from "axios";

// Reads VITE_API_URL from Frontend/.env (restart `npm run dev` after changing it)
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5001/api",
  timeout: 15000,
});

// Turns any axios error into a message that is safe to show customers
export const getErrorMessage = (error, fallback = "Something went wrong.") => {
  if (error.response?.data?.message) return error.response.data.message;

  if (error.code === "ECONNABORTED") {
    return "The server took too long to respond. Please try again.";
  }

  if (error.request && !error.response) {
    return "We can't reach the server right now. Check your connection and try again.";
  }

  return fallback;
};

export default api;
