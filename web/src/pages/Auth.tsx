import { NavLink } from 'react-router-dom';

import paesi from '../assets/paesi.svg';

export function Auth() {
  const buttonClass =
    'w-full py-4 px-10 text-center font-bold text-white text-lg rounded-lg shadow-lg transition-all hover:shadow-xl cursor-pointer';

  return (
    <div className='min-h-screen flex flex-col items-center px-4'>
      <div className='mt-[280px] mb-8'>
        <img src={paesi} className='max-w-full h-auto' alt='Paesi Logo' />
      </div>

      <div className='flex flex-col items-center space-y-4 max-w-sm mt-[120px]'>
        <NavLink to='/inicio/entrar' className={`${buttonClass} bg-[#13425C]`}>
          JÁ TEM UMA CONTA?
        </NavLink>
        <NavLink
          to='/inicio/criar-conta'
          className={`${buttonClass} bg-[#17A17F]`}
        >
          CRIAR UMA CONTA
        </NavLink>
      </div>
    </div>
  );
}
