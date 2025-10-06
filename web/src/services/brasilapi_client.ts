import axios from 'axios';

export const brasilAPIClient = axios.create({
  baseURL: import.meta.env.VITE_BRASILAPI_URL,
  headers: { 'Content-Type': 'application/json' },
});
