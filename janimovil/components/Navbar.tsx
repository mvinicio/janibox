import React from 'react';
import { JaniboxLogo } from './Logos';

interface NavbarProps {
  onCartClick?: () => void;
  onSearchClick?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onCartClick, onSearchClick }) => {
  return (
    <div className="sticky top-0 z-40 flex items-center bg-white dark:bg-background-dark p-4 pb-2 justify-between border-b border-gray-100 dark:border-gray-800">
      <div className="flex items-center gap-2.5">
        <div className="text-[#181112] dark:text-white flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/5 dark:bg-white/5">
           <JaniboxLogo className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-[#181112] dark:text-white text-xl font-bold leading-tight tracking-[-0.015em] font-display">
          Janibox
        </h2>
      </div>
      <div className="flex gap-2 items-center justify-end">
        <button 
          onClick={onSearchClick}
          className="flex size-10 items-center justify-center rounded-full bg-transparent text-[#181112] dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <span className="material-symbols-outlined">search</span>
        </button>
        <button 
          onClick={onCartClick}
          className="relative flex size-10 items-center justify-center rounded-full bg-transparent text-[#181112] dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <span className="material-symbols-outlined">shopping_cart</span>
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-white font-bold shadow-sm">
            2
          </span>
        </button>
      </div>
    </div>
  );
};

export default Navbar;