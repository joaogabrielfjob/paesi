import type {
  SignInRequest,
  AuthResponse,
  SignUpRequest,
  FetchUserResponse,
  UpdateUserRequest,
} from './types';
import { authClient } from './client';

const basePath = '/auth';

const signIn = async (request: SignInRequest) => {
  return await authClient.post<AuthResponse>(`${basePath}/sign-in/email`, request);
};

const fetchToken = async () => {
  return await authClient.get<AuthResponse>(`${basePath}/token`);
};

const signUp = async (request: SignUpRequest) => {
  return await authClient.post<AuthResponse>(`${basePath}/sign-up/email`, request);
};

const signOut = async () => {
  return await authClient.post(`${basePath}/sign-out`);
};

const fetchUser = async () => {
  try {
    const { data } = await authClient.get<FetchUserResponse>(
      `${basePath}/get-session`,
    );

    return data.user;
  } catch (exception) {
    console.error('Failed to fetch user', exception);

    return;
  }
};

const updateUser = async (request: UpdateUserRequest) => {
  return await authClient.post(`${basePath}/update-user`, request);
};

const changeEmail = async (newEmail: string) => {
  return await authClient.post(`${basePath}/change-email`, { newEmail });
};

export {
  signIn,
  fetchToken,
  signUp,
  signOut,
  fetchUser,
  updateUser,
  changeEmail,
};
