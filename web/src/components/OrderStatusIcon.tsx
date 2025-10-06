import { Check, Package, PackageCheck, Truck, X } from 'lucide-react';
import { OrderStatus } from '@/enums/order_status';

interface OrderStatusIconProps {
  status: string;
}

export function OrderStatusIcon({ status }: OrderStatusIconProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case OrderStatus.CREATED:
        return {
          icon: Package,
          bgColor: 'bg-blue-100',
          iconColor: 'text-blue-600'
        };
      case OrderStatus.CONFIRMED:
        return {
          icon: Check,
          bgColor: 'bg-green-100',
          iconColor: 'text-green-600'
        };
      case OrderStatus.IN_DELIVERY_ROUTE:
        return {
          icon: Truck,
          bgColor: 'bg-purple-100',
          iconColor: 'text-purple-600'
        };
      case OrderStatus.FINISHED:
        return {
          icon: PackageCheck,
          bgColor: 'bg-emerald-100',
          iconColor: 'text-emerald-600'
        };
      case OrderStatus.CANCELED:
        return {
          icon: X,
          bgColor: 'bg-red-100',
          iconColor: 'text-red-600'
        };
      default:
        return {
          icon: Package,
          bgColor: 'bg-gray-100',
          iconColor: 'text-gray-600'
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <div
      className={`flex-shrink-0 w-16 h-16 rounded-xl flex items-center justify-center ${config.bgColor}`}
    >
      <Icon className={`w-8 h-8 ${config.iconColor}`} />
    </div>
  );
}
