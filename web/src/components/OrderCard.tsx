import type { OrderResponse } from '@/services/types';
import { OrderStatusIcon } from './OrderStatusIcon';

interface OrderCardProps {
  order: OrderResponse;
}

export function OrderCard({ order }: OrderCardProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className='bg-white rounded-2xl shadow-md p-4 flex gap-4'>
      <OrderStatusIcon status={order.status} />

      <div className='flex flex-col justify-between'>
        <div>
          <p className='text-gray-900 font-medium text-base max-h-5'>
            Pedido{' '}
            <span className='text-blue-600 font-semibold text-base'>
              #{order.code}
            </span>
          </p>

          <p className='text-gray-900 font-medium text-sm'>
            Criado em:{' '}
            <span className='font-medium'>{formatDate(order.createdAt)}</span>
          </p>
        </div>

        {order.estimatedDeliveryIn && (
          <p className='text-gray-600 text-sm'>
            Entrega estimada:{' '}
            <span className='font-medium'>
              {formatDate(order.estimatedDeliveryIn)}
            </span>
          </p>
        )}

        {order.deliveredAt && (
          <p className='text-gray-600 text-sm'>
            Entregue em:{' '}
            <span className='font-medium'>
              {formatDate(order.deliveredAt)}
            </span>
          </p>
        )}

        {order.deletedAt && (
          <p className='text-gray-600 text-sm'>
            Cancelado em:{' '}
            <span className='font-medium'>
              {formatDate(order.deletedAt)}
            </span>
          </p>
        )}
      </div>
    </div>
  );
}
