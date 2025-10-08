import { ShoppingCart } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

interface CartButtonProps {
  itemCount?: number;
  onClick?: () => void;
  className?: string;
}

export function CartButton({
  itemCount = 0,
  onClick,
  className = ''
}: CartButtonProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [prevCount, setPrevCount] = useState(itemCount);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (itemCount > prevCount) {
      setIsAnimating(true);

      const timer = setTimeout(() => setIsAnimating(false), 800);
      return () => clearTimeout(timer);
    }
    setPrevCount(itemCount);
  }, [itemCount, prevCount]);

  return (
    <button
      ref={buttonRef}
      data-cart-button
      onClick={onClick}
      className={`fixed bottom-6 right-6 w-14 h-14 bg-[#13425C] hover:bg-[#13425C]/90 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-30 ${
        isAnimating ? 'animate-wiggle' : ''
      } ${className}`}
    >
      <div className='relative'>
        <ShoppingCart
          size={24}
          className={`transition-transform duration-200 ${isAnimating ? 'scale-110' : 'scale-100'}`}
        />

        {itemCount > 0 && (
          <div
            className={`absolute -top-2 -right-2 min-w-[20px] h-5 bg-[#17A17F] text-white text-xs font-bold rounded-full flex items-center justify-center px-1 transition-all duration-300 ${
              isAnimating ? 'animate-bounce-up scale-125' : 'scale-100'
            }`}
          >
            <span className='transition-all duration-200'>
              {itemCount > 99 ? '99+' : itemCount}
            </span>
          </div>
        )}
      </div>
    </button>
  );
}
