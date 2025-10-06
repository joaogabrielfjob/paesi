import type { ProductResponse } from '@/services/types';

interface ProductCardProps {
  image: string;
  product: ProductResponse;
  onAdd: (product: ProductResponse) => void;
}

export function ProductCard({ image, product, onAdd }: ProductCardProps) {
  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(product.price);

  const handleAddClick = () => {
    if (onAdd) {
      onAdd(product);
    }
  };

  return (
    <div
      data-product-card
      className='bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300 w-full'
    >
      <div className='w-full h-25 bg-gray-100 flex items-center justify-center p-2'>
        {image ? (
          <img
            src={image}
            alt={product.name}
            className='w-full h-full object-contain max-w-[120px] max-h-[100px]'
            data-product-image
          />
        ) : (
          <div className='text-gray-400 text-xs'>Sem imagem</div>
        )}
      </div>

      <div className='p-2 sm:p-3 space-y-1'>
        <div>
          <p className='font-semibold text-gray-900 text-sm leading-tight min-h-[2.5rem]'>
            <span className='line-clamp-1'>{product.name}</span>
            <span className='text-xs'>{product.company}</span>
          </p>
        </div>

        <p className='text-gray-500 text-base truncate'>{formattedPrice}</p>

        <button
          onClick={handleAddClick}
          className='w-full p-2 bg-[#17A17F] text-white font-bold text-sm rounded-md tracking-[.025em]'
        >
          ADICIONAR
        </button>
      </div>
    </div>
  );
}
