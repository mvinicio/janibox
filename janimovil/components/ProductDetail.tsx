import React, { useState } from 'react';

interface ProductDetailProps {
  onBack: () => void;
  onNext: () => void;
  onHygieneClick?: () => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ onBack, onNext, onHygieneClick }) => {
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [message, setMessage] = useState('');

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-white dark:bg-background-dark animate-in fade-in slide-in-from-bottom-10 duration-300 font-display">
      {/* TopAppBar */}
      <div className="sticky top-0 z-50 flex items-center bg-white/80 dark:bg-background-dark/80 backdrop-blur-md p-4 pb-2 justify-between border-b border-transparent dark:border-gray-800/50">
        <button onClick={onBack} className="text-[#181112] dark:text-white flex size-12 shrink-0 items-center justify-start cursor-pointer hover:opacity-70 transition-opacity">
          <span className="material-symbols-outlined">arrow_back_ios</span>
        </button>
        <h2 className="text-[#181112] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">
          Detalle del Producto
        </h2>
        <div className="flex w-12 items-center justify-end">
          <button className="flex cursor-pointer items-center justify-center rounded-xl h-12 bg-transparent text-[#181112] dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <span className="material-symbols-outlined">share</span>
          </button>
        </div>
      </div>

      <main className="flex-1 pb-32">
        {/* HeaderImage / Gallery */}
        <div className="@container">
          <div className="@[480px]:px-4 @[480px]:py-3">
            <div 
              className="bg-cover bg-center flex flex-col justify-end overflow-hidden bg-white dark:bg-zinc-800 @[480px]:rounded-xl min-h-96 shadow-sm relative group" 
              style={{ backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0) 25%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuCOyn1KH4iczjP69Pmr3q0Yy_pLuPJZxPCJGm0lO_-xK581r8t4jeIeLyUlaqRKsJBOC_vRgTqJ5zZt3fvY7YgUSgXgWIm__j0W-3ZqH1Xql5kOYuAhPXUcgGEhxLXsO42HyMrlzz1I3WNTphu-fhb14qUXYc9yQhUe8Dvjx4lEudm-a2D0b85eUMFr7bt0UjRnlJoZVTz9pxOwrgHgRBZTDI_3FC3ykgx3gjZ4N99Qwl6T04TEkD01pBrQlMiJKDNucl_cnBZDgw")` }}
            >
              <div className="flex justify-center gap-2 p-5">
                <div className="size-2 rounded-full bg-primary shadow-sm"></div>
                <div className="size-2 rounded-full bg-white/70 backdrop-blur-sm shadow-sm"></div>
                <div className="size-2 rounded-full bg-white/70 backdrop-blur-sm shadow-sm"></div>
                <div className="size-2 rounded-full bg-white/70 backdrop-blur-sm shadow-sm"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Headline */}
        <div className="flex flex-col px-4 pt-6">
          <div className="flex justify-between items-start gap-4">
            <h1 className="text-[#181112] dark:text-white tracking-tight text-[32px] font-bold leading-tight flex-1">
              Ramo de Snacks Picantes
            </h1>
            <button 
              onClick={() => setIsFavorite(!isFavorite)}
              className={`mt-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all active:scale-90 ${isFavorite ? 'text-primary' : 'text-gray-400'}`}
            >
              <span className={`material-symbols-outlined text-3xl ${isFavorite ? 'filled' : ''}`}>favorite</span>
            </button>
          </div>
          <h2 className="text-primary tracking-tight text-[28px] font-bold leading-tight pt-2">$35.00</h2>
        </div>

        {/* BodyText Description */}
        <div className="px-4 pt-4">
          <p className="text-[#181112]/70 dark:text-white/70 text-base font-normal leading-relaxed">
            Una mezcla audaz de snacks enchilados, frituras saladas y dulces de tamarindo, bellamente arreglados para cualquier amante del picante. Perfecto para cumpleaños, aniversarios o solo para decir "Estoy pensando en ti".
          </p>
        </div>

        {/* Hygiene Section */}
        <div className="px-4 pt-8">
          <div 
            onClick={onHygieneClick}
            className="bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-xl p-4 flex gap-4 items-center cursor-pointer hover:bg-primary/10 transition-colors active:scale-[0.98]"
          >
            <div className="bg-primary text-white p-3 rounded-full flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-[28px]">health_and_safety</span>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-[#181112] dark:text-white text-base">Higiene Garantizada</h3>
              <p className="text-sm text-[#181112]/80 dark:text-white/80 leading-snug pt-1">
                Preparado con redes para el cabello, guantes y superficies 100% desinfectadas. <span className="text-primary font-bold underline">Leer más</span>
              </p>
            </div>
          </div>
        </div>

        {/* Customization Section */}
        <div className="px-4 pt-8">
          <h3 className="text-lg font-bold text-[#181112] dark:text-white mb-4">Personaliza tu regalo</h3>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[#181112]/60 dark:text-white/60 px-1">Mensaje para tu Tarjeta de Dedicatoria</label>
            <textarea 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-[#181112] dark:text-white focus:border-primary focus:ring-primary p-4 min-h-[120px] resize-none transition-shadow outline-none focus:ring-2" 
              placeholder="Escribe aquí tu mensaje especial..."
              maxLength={200}
            />
            <p className="text-right text-xs text-[#181112]/40 dark:text-white/40">{message.length} / 200 caracteres</p>
          </div>
        </div>

        {/* Quantity Selector */}
        <div className="px-4 pt-6 flex items-center justify-between">
          <span className="font-bold text-lg text-[#181112] dark:text-white">Cantidad</span>
          <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-full p-1 border border-gray-200 dark:border-gray-700">
            <button 
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="size-10 flex items-center justify-center text-gray-500 hover:text-primary transition-colors disabled:opacity-50"
              disabled={quantity <= 1}
            >
              <span className="material-symbols-outlined">remove</span>
            </button>
            <span className="w-12 text-center font-bold text-lg text-[#181112] dark:text-white">{quantity}</span>
            <button 
              onClick={() => setQuantity(quantity + 1)}
              className="size-10 flex items-center justify-center text-gray-500 hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined">add</span>
            </button>
          </div>
        </div>
      </main>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-background-dark/95 backdrop-blur-md border-t border-gray-100 dark:border-gray-800 p-4 pb-8 z-50 max-w-[500px] mx-auto">
        <div className="flex gap-4">
          <button 
            onClick={onNext}
            className="flex-1 bg-primary text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20 active:scale-[0.98] transition-transform hover:bg-primary-dark"
          >
            <span className="material-symbols-outlined">local_shipping</span>
            Continuar a Entrega
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;