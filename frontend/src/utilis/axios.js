import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://fullstack-opencart.onrender.com',
  withCredentials: true, // ✅ ensures cookies (like JWT) are sent
});

export default axiosInstance;

// import axios from 'axios';

// const instance = axios.create({
//   baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000',
//   withCredentials: true, // only if you use cookies/auth
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// export default instance;
