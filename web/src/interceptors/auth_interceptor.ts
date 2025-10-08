import type { AxiosError, AxiosRequestConfig } from 'axios';
import { fetchToken } from '@/services/auth_service';

export async function authInterceptor(
  error: AxiosError,
): Promise<AxiosRequestConfig | AxiosError> {
  if (
    error.response?.status === 401 &&
    error.config?.url != '/auth/token'
  ) {
    try {
      const tokenResponse = await fetchToken();

      if (tokenResponse.data.token) {
        localStorage.setItem('token', tokenResponse.data.token);
        window.location.href = '/';
      } else {
        window.location.href = '/inicio';
        return Promise.reject(error);
      }
    } catch {
      window.location.href = '/inicio';
      return Promise.reject(error);
    }
  }

  return Promise.reject(error);
}
