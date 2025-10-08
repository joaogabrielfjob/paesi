export const OrderStatus = {
  CREATED: 'CREATED',
  CONFIRMED: 'CONFIRMED',
  IN_DELIVERY_ROUTE: 'IN_DELIVERY_ROUTE',
  FINISHED: 'FINISHED',
  CANCELED: 'CANCELED'
} as const;

export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];
