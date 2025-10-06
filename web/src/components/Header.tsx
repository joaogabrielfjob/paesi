import { useState } from 'react';
import { Button } from './ui/button';
import { Drawer } from './Drawer';
import { ArrowLeft, Menu } from 'lucide-react';
import { NavLink, useMatches } from 'react-router-dom';

export function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const matches = useMatches();
  const current = matches[matches.length - 1];
  const handle = current.handle as {
    title: string;
    menu: boolean;
    back: boolean;
    location: string;
  };

  return (
    <>
      <header className='container mx-auto flex items-center justify-between px-6 py-6'>
        {handle.menu && (
          <Button
            variant='ghost'
            size='icon'
            onClick={() => setDrawerOpen(true)}
          >
            <Menu size={20} className='!w-5 !h-5' />
          </Button>
        )}

        {handle.back && (
          <Button variant='ghost' size='icon' asChild>
            <NavLink to={handle.location}>
              <ArrowLeft size={24} className='!w-6 !h-6' />
            </NavLink>
          </Button>
        )}

        {handle.title && (
          <h1 className='absolute left-1/2 -translate-x-1/2 text-lg font-medium'>
            {handle.title}
          </h1>
        )}

        <div className='w-10' />
      </header>

      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <div />
      </Drawer>
    </>
  );
}
