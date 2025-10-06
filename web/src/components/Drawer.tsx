import * as React from 'react';
import { ArrowLeft, MessageCircle, Instagram, Mail } from 'lucide-react';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';
import { signOut } from '@/services/auth_service';

interface DrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

const Drawer: React.FC<DrawerProps> = ({ open, onOpenChange, children }) => {
  const navigate = useNavigate();

  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  const handleSignOut = async () => {
    try {
      await signOut();
      localStorage.removeItem('token');
      onOpenChange(false);
      navigate('/inicio');
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  const handleNavigate = (location: string) => {
    onOpenChange(false);
    navigate(location);
  };

  return (
    <>
      {children}

      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => onOpenChange(false)}
      />

      <div
        className={`fixed inset-y-0 left-0 z-50 w-80 bg-white shadow-xl flex flex-col transition-transform duration-300 ease-out ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className='flex flex-col items-start px-8 py-8'>
          <Button
            variant='ghost'
            size='icon'
            asChild
            onClick={() => onOpenChange(false)}
          >
            <ArrowLeft size={24} className='!w-6 !h-6' />
          </Button>
        </div>

        <div className='flex-1 px-8 flex flex-col justify-between'>
          <nav className='space-y-6 mt-4 flex flex-col items-start justify-between'>
            <Button
              variant='ghost'
              size='sm'
              className='text-lg text-gray-900 py-2 active:text-gray-600 transition-colors'
              onClick={() => handleNavigate('/minha-conta')}
            >
              Minha conta
            </Button>

            <Button
              variant='ghost'
              size='sm'
              className='text-lg text-gray-900 py-2 active:text-gray-600 transition-colors'
              onClick={() => handleNavigate('/endereco')}
            >
              Endereço
            </Button>

            <Button
              variant='ghost'
              size='sm'
              className='text-lg text-gray-900 py-2 active:text-gray-600 transition-colors'
              onClick={() => handleNavigate('/pedidos')}
            >
              Pedidos
            </Button>

            <Button
              variant='ghost'
              size='sm'
              onClick={handleSignOut}
              className='text-lg text-gray-900 py-2 active:text-gray-600 transition-colors'
            >
              Sair
            </Button>
          </nav>

          <div className='pb-8 space-y-4'>
            <p className='text-sm text-gray-500'>Entre em contato:</p>

            <div className='flex space-x-8'>
              <a
                href='https://wa.me/555195615601'
                target='_blank'
                rel='noopener noreferrer'
                className='p-3 rounded-full bg-gray-100 active:bg-gray-200 active:scale-95 transition-all'
              >
                <MessageCircle size={20} className='text-green-600' />
              </a>
              <a
                href='https://www.instagram.com/paesi_distribuidora/'
                target='_blank'
                rel='noopener noreferrer'
                className='p-3 rounded-full bg-gray-100 active:bg-gray-200 active:scale-95 transition-all'
              >
                <Instagram size={20} className='text-purple-600' />
              </a>
              <a
                href='mailto:paesidistribuidora@gmail.com'
                className='p-3 rounded-full bg-gray-100 active:bg-gray-200 active:scale-95 transition-all'
              >
                <Mail size={20} className='text-blue-600' />
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export { Drawer };
