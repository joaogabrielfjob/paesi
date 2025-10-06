import type {
  SignInRequest,
  AuthResponse,
  SignUpRequest,
  FetchUserResponse,
  UpdateUserRequest,
} from './types';
import { client } from './client';

const basePath = '/api/auth';

const signIn = async (request: SignInRequest) => {
  return await client.post<AuthResponse>(`${basePath}/sign-in/email`, request);
};

const fetchToken = async () => {
  return await client.get<AuthResponse>(`${basePath}/token`);
};

const signUp = async (request: SignUpRequest) => {
  return await client.post<AuthResponse>(`${basePath}/sign-up/email`, request);
};

const signOut = async () => {
  return await client.post(`${basePath}/sign-out`);
};

const fetchUser = async () => {
  try {
    const { data } = await client.get<FetchUserResponse>(
      `${basePath}/get-session`,
    );

    return data.user;
  } catch (exception) {
    console.error('Failed to fetch user', exception);

    return;
  }
};

const updateUser = async (request: UpdateUserRequest) => {
  return await client.post(`${basePath}/update-user`, request);
};

const changeEmail = async (newEmail: string) => {
  return await client.post(`${basePath}/change-email`, { newEmail });
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
