import React from 'react';

interface HeroProps {
  onBuildClick?: () => void;
}

const Hero: React.FC<HeroProps> = ({ onBuildClick }) => {
  return (
    <div className="@container">
      <div className="@[480px]:px-4 @[480px]:py-3">
        <div 
          className="bg-cover bg-center flex flex-col justify-end overflow-hidden bg-white dark:bg-gray-800 @[480px]:rounded-xl min-h-[420px] shadow-sm relative group"
          style={{
            backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0) 40%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuBcK_2xsRVhLa0aCdUjEuJQ3CCbbPZd-SzTqqQqj0BsrUQQu3TYdZNu6lmOprDwXooI1ypQV5OHQm-ePva7sYhDwiSKaTP0bvuim7A1PD-fgpqXH5XYLH7OY5qB21oDKOZO8dAvqED651cSnXDuguC5J2L6HY5Z7-orxbRZUg8pcDhtQyDZQhu7OlI6j7PaLthhe4GfLxmtLm0S39zOEfMc7cyliCvD8dizlMg32iJy6SeDS1l74YFy0Cdhs0YuEk29P_ex_zTSnA")`
          }}
        >
          <div className="flex flex-col p-6 gap-4">
            <h1 className="text-white tracking-tight text-[32px] font-extrabold leading-tight font-display drop-shadow-md">
              Dulzura a Domicilio.<br />A Tu Manera.
            </h1>
            <p className="text-white/90 text-sm max-w-[280px] drop-shadow-sm font-medium">
              Ramos artesanales premium hechos con tus dulces favoritos.
            </p>
            <div className="flex py-2">
              <button 
                onClick={onBuildClick}
                className="flex min-w-[160px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 px-6 bg-primary hover:bg-primary-dark transition-all text-white text-base font-bold leading-normal tracking-[0.015em] shadow-lg shadow-primary/30 active:scale-95"
              >
                <span className="truncate">Diseña el tuyo</span>
                <span className="material-symbols-outlined ml-2 text-sm">auto_fix_high</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;