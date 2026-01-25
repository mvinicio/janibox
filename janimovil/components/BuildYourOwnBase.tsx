import React, { useState } from 'react';

interface BaseOption {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
}

interface BuildYourOwnBaseProps {
  onBack: () => void;
  onNext: () => void;
}

const baseOptions: BaseOption[] = [
  {
    id: 'box',
    name: 'Caja de Regalo Elegante',
    description: 'Elegante, resistente y perfecta para envíos.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDJqae6h6_iITlRAxeJOY5Az8mSSO7qnctFKW0Hmt5H7l8LXT1Gv7Pc1H6hWh2MkcwBoyQaD4hBb7_YNReoB3v4Cae9nyxen2JlAKEcZKsMOq0FbYiTrHN4YFbMAVa0f9er2SK_QuOj9V-pBolZyqufrLfgwxc9H7aes5fLH7yNIybnbLhXJ2LG-12QxkUsJwQO5_uDvfR_hgv7udgMDzipppvH1mADCKtgpfctdhLT6umm6mb9c49ZtnsYeH1210zCC-rSSlYdag',
    price: 15.00
  },
  {
    id: 'basket',
    name: 'Cesta de Mimbre Clásica',
    description: 'La favorita tradicional para un toque rústico.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBio_n_uljq1F3Dx72sw6aH1CyG8fYjaeW_wmmysIhrt8bOrjRdFFF9XA9VaK-sB-KRaoO2EielOcGeBwp_n0-LpWUAmdMDkikANQr-OiufoHN_UPJou1a8WDOv4Q75gW8YYFqS0aGvntgwZ5PxhqodzE4_i7CzzAZ1jBWxi2TeHRCsdXZpXZPgChlNhojDiCLNrjQxdQJ3tgg5-n0bdGkauN5Vz6v4PKz4Pg-aOgks3XaqTj_dffVyZ4kuvBkHdm7d1OZ3JYdw4w',
    price: 18.00
  },
  {
    id: 'mug',
    name: 'Taza de Cerámica',
    description: 'Un regalo práctico que perdura.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDx2i8Gs7X7kMb6d4VAK4ibJ9tHB63CnvzLHF0PZxi_W-PhXbBZSwETTOj9p8g-f9HpCw9TimSjUODZunEcfrgQwAg44JlhTNFBB0hArrdXVYePtScdC_Ki4mc3ViwqVnyr7mVA5IcFdBO4UzERqLpnKjgwa-zLBbcijBm5-3S22ImiOW6DFvh4SVNAhD58ha4OQBETTBmDQMu51CXHGf8TEVji7Fp_X9FayU9w4cPRwRaOOWxRwi_1xgIZ75tuwJ32iRWliErgbg',
    price: 12.00
  },
  {
    id: 'bucket',
    name: 'Cubeta Vintage de Metal',
    description: 'Estilo industrial moderno y en tendencia.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCgpL9aAneDOiqmaLuyikuwDRc2_HSbgwgBtaefOT6b_8ixpcO31EW8Tl82IhkPLeMx0EFLka1LLiJnxcy4CBDtnBtOZ8lqG4Fw4SvPKEpI5y9L4a_tfWDr3AFPGmOwU9PoadZiTFPsp5F6OwB1ceC-hd9gCY5fSwydmAk2m2LpDTGjxzWHfoSRPSadvNSr7o_CMuL9w1zDHjkLIdIqXdoNvq4aFD5BzIryhxRDKRPMGIHH1Z5Hzpbr4mHtzcDGH9c7v4s0tJZpPw',
    price: 16.00
  }
];

const BuildYourOwnBase: React.FC<BuildYourOwnBaseProps> = ({ onBack, onNext }) => {
  const [selectedId, setSelectedId] = useState<string>(baseOptions[0].id);

  const selectedBase = baseOptions.find(b => b.id === selectedId) || baseOptions[0];

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark font-display animate-in fade-in slide-in-from-right-10 duration-300">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-10 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-gray-100 dark:border-white/5">
        <div className="flex items-center p-4 justify-between">
          <button 
            onClick={onBack}
            className="text-[#171112] dark:text-white flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back_ios_new</span>
          </button>
          <h2 className="text-[#171112] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">
            Diseña tu Ramo
          </h2>
          <div className="size-10"></div> {/* Spacer for alignment */}
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-32">
        {/* Page Indicators */}
        <div className="flex w-full flex-row items-center justify-center gap-3 py-4">
          <div className="h-2 w-8 rounded-full bg-primary transition-all"></div>
          <div className="h-2 w-2 rounded-full bg-primary/20 dark:bg-primary/10"></div>
          <div className="h-2 w-2 rounded-full bg-primary/20 dark:bg-primary/10"></div>
        </div>

        {/* Headline & Description */}
        <section className="px-4">
          <h2 className="text-[#171112] dark:text-white tracking-tight text-[28px] font-bold leading-tight text-center pt-2">
            Paso 1: Elige tu base
          </h2>
          <p className="text-[#171112]/70 dark:text-white/70 text-base font-normal leading-normal py-2 text-center">
            Selecciona la base perfecta para tu ramo personalizado de dulces y snacks
          </p>
        </section>

        {/* Selection Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 mt-4">
          {baseOptions.map((option) => (
            <div 
              key={option.id}
              onClick={() => setSelectedId(option.id)}
              className={`relative group cursor-pointer border-2 rounded-xl overflow-hidden bg-white dark:bg-[#2d1a1d] shadow-sm transition-all ${
                selectedId === option.id 
                  ? 'border-primary ring-1 ring-primary' 
                  : 'border-transparent hover:border-primary/30'
              }`}
            >
              {selectedId === option.id && (
                <div className="absolute top-3 right-3 z-10 bg-primary text-white rounded-full p-1 flex items-center justify-center animate-in zoom-in duration-200">
                  <span className="material-symbols-outlined text-sm">check</span>
                </div>
              )}
              <div 
                className="aspect-[4/3] w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105" 
                style={{ backgroundImage: `url('${option.image}')` }}
              ></div>
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-[#171112] dark:text-white text-lg font-bold">{option.name}</h3>
                  <span className="text-primary font-bold text-sm">${option.price.toFixed(2)}</span>
                </div>
                <p className="text-[#171112]/60 dark:text-white/60 text-sm mt-1">{option.description}</p>
              </div>
            </div>
          ))}
        </section>
      </main>

      {/* Sticky Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-[#221013]/90 backdrop-blur-xl border-t border-black/5 dark:border-white/5 p-4 pb-8 max-w-[500px] mx-auto z-20">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between px-2">
            <span className="text-sm font-medium text-[#171112]/60 dark:text-white/60 italic">
              Base seleccionada
            </span>
            <span className="text-base font-bold text-primary">
              ${selectedBase.price.toFixed(2)}
            </span>
          </div>
          <button 
            onClick={onNext}
            className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20 active:scale-[0.98] transition-all"
          >
            <span>Siguiente: Elige tus Dulces</span>
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>
      </footer>
    </div>
  );
};

export default BuildYourOwnBase;