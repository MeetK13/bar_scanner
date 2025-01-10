import axios from 'axios';
import {API_URL} from './config';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  response => response,
  error => {
    return Promise.reject(error);
  },
);

export default api;
