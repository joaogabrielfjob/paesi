import type { OrderStatus } from '@/enums/order_status';

export type SignInRequest = {
  email: string;
  password: string;
};

export type AuthResponse = {
  token: string;
};

export type SignUpRequest = {
  name: string;
  email: string;
  password: string;
};

export type FetchProductsResponse = {
  products: ProductResponse[];
};

export type ProductResponse = {
  id: number;
  name: string;
  company: string;
  price: number;
};

export type StoredCart = {
  products: CartProduct[];
};

export type CartProduct = {
  product: ProductResponse;
  quantity: number;
};

export type OrderResponse = {
  id: number;
  code: string;
  status: OrderStatus;
  createdAt: Date;
  estimatedDeliveryIn?: Date;
  deliveredAt?: Date;
  deletedAt?: Date;
};

export type FetchOrdersResponse = {
  orders: OrderResponse[];
};

export type FetchUserResponse = {
  user: UserResponse;
};

export type UserResponse = {
  name: string;
  email: string;
  phone: string;
};

export type UpdateUserRequest = {
  name?: string;
  phone?: string;
};

export type AddressResponse = {
  address?: {
    postalCode: string;
    country: string;
    state: string;
    city: string;
    street: string;
    neighborhood: string;
    number: string;
    complement?: string;
  }
};

export type UpsertAddressRequest = {
  postalCode: string;
  country: string;
  state: string;
  city: string;
  street: string;
  neighborhood: string;
  number: string;
  complement?: string;
};

export type BrasilAPIPostalCodeResponse = {
  cep: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
  service: string;
};

export type CreateOrderProduct = {
  productId: number;
  quantity: number;
};

export type CreateOrderRequest = {
  products: CreateOrderProduct[];
};
