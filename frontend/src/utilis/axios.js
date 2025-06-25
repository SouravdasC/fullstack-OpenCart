import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: '',
  withCredentials: true, // ✅ ensures cookies (like JWT) are sent
});

export default axiosInstance;
