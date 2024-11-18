import axios from "axios";

//  Development Url
const baseURL = "http://localhost:8000/api/v1";

//  Production Url
// const baseURL = 'https://bestthaideal.elegantinternational.site/public/api/v1';

const http = axios.create({
  baseURL,
});

http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      config.baseURL = baseURL + "/";
    } else {
      config.baseURL = baseURL;
      delete config.headers.Authorization;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
http.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (
      error.response &&
      error.response.status === 401 &&
      error.response.data.message === "Unauthenticated."
    ) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/sign-in";
    }
    return Promise.reject(error);
  }
);

export default http;
