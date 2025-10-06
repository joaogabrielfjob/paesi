import type { CartProduct } from '@/services/types';

interface CartProductCardProps {
  cartProduct: CartProduct;
  image: string;
  onQuantityChange: (productId: number, quantity: number) => void;
}

export function CartProductCard({
  cartProduct,
  image,
  onQuantityChange,
}: CartProductCardProps) {
  const { product, quantity } = cartProduct;

  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(product.price * quantity);

  const handleDecrease = () => {
    onQuantityChange(product.id, quantity - 1);
  };

  const handleIncrease = () => {
    onQuantityChange(product.id, quantity + 1);
  };

  return (
    <div className='w-full max-w-none bg-white rounded-lg border border-gray-200 p-3 flex items-center gap-3'>
      <div className='w-16 h-16 rounded-md flex items-center justify-center flex-shrink-0'>
        {image ? (
          <img
            src={image}
            alt={product.name}
            className='w-full h-full object-contain rounded-md'
          />
        ) : (
          <div className='text-gray-400 text-xs'>Sem imagem</div>
        )}
      </div>

      <div className='flex-1 min-w-0'>
        <h3 className='font-medium text-gray-900 text-sm leading-tight truncate'>
          {product.name}
        </h3>
        <p className='text-gray-500 text-xs truncate'>{product.company}</p>
        <p className='text-gray-900 font-semibold text-sm mt-1'>
          {formattedPrice}
        </p>
      </div>

      <div className='flex items-center gap-3 flex-shrink-0'>
        <button
          onClick={handleDecrease}
          className='w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors'
        >
          <span className='text-lg font-medium'>-</span>
        </button>

        <span className='text-lg font-medium text-gray-900 min-w-[2ch] text-center'>
          {quantity}
        </span>

        <button
          onClick={handleIncrease}
          className='w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors'
        >
          <span className='text-lg font-medium'>+</span>
        </button>
      </div>
    </div>
  );
}
