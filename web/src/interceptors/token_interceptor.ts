import type { AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';

export function tokenInterceptor(
  config: AxiosRequestConfig,
): InternalAxiosRequestConfig {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  return config as InternalAxiosRequestConfig;
}
