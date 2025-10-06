import axios from 'axios';
import { tokenInterceptor } from '@/interceptors/token_interceptor';
import { authInterceptor } from '@/interceptors/auth_interceptor';
import { transformDates } from '@/interceptors/date_parser_interceptor';

// Main API client (Go server)
export const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:7777',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
  transformResponse: [
    transformDates,
    ...(axios.defaults.transformResponse as []),
  ],
});

client.interceptors.request.use(tokenInterceptor);
client.interceptors.response.use((response) => response, authInterceptor);

// Auth client (Bun server)
export const authClient = axios.create({
  baseURL: import.meta.env.VITE_AUTH_URL || 'http://localhost:3000',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
  transformResponse: [
    transformDates,
    ...(axios.defaults.transformResponse as []),
  ],
});

authClient.interceptors.request.use(tokenInterceptor);
authClient.interceptors.response.use((response) => response, authInterceptor);
