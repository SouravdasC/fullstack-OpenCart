import axios from 'axios';

export default axios.create({
  baseURL: 'https://fullstack-opencart.onrender.com',
  withCredentials: true, // ✅ required to send cookies
});

// import axios from 'axios';

// const instance = axios.create({
//   baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000',
//   withCredentials: true, // only if you use cookies/auth
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// export default instance;
