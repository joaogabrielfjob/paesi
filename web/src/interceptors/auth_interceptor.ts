import type { AxiosError, AxiosRequestConfig } from 'axios';

export async function authInterceptor(
  error: AxiosError
): Promise<AxiosRequestConfig | AxiosError> {
  if (error.response?.status === 401) {
    window.location.href = '/inicio';
    return Promise.reject(error);
  }

  return Promise.reject(error);
}
