import React, { useState } from 'react';

interface Treat {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
}

interface BuildYourOwnTreatsProps {
  onBack: () => void;
  onNext: () => void;
}

const treatsData: Treat[] = [
  {
    id: '1',
    name: 'Trufas de Cacao Oscuro',
    price: 4.50,
    description: 'Orgánico 70% Cacao',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDnHQiReXl_hzbkqoqem8wvQKHnu42UrlgyY31CpCrGHixSwdld_Wqlg2trxxnRvydY3YKn-q9n7KpCtXNhfGkUmXsSLig4RGjPxMuXSdkxvwvJC_e26ymgEDbvIgzjdJR6R1tNux369EGlOYOWOEIcy-kBHQ3jj6MyBAuqNG6jVaaBS5r_p11IOBjtF_0oD4FLBsCruzmxocgytDUd9PEW5M4kw7nP5O9PwktLWUZYgTnHbWlVc-fwVKef02IsoPPH7CcQdJ5lXw',
    category: 'Chocolates'
  },
  {
    id: '2',
    name: 'Gusanitos Neón Ácidos',
    price: 2.50,
    description: 'Cítricos y Masticables',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB2nOXPPVmEc264X3xH9cLcmEkJWa8nun5BiBQz4lD5cJaeEExMY0UAaIlj4FfRdEBbare2y32nzXKlKyYMdjnF4qUSVZyC526sCe7c1a5kOxUQ01DVUf3ftA0OGSXcgGUKr2Q3PwM-H1jKaolfFIwf2O_tJG-LdchEfrG3YIaedrCEK6MCxSNrEx7KGqxQtthM0udfx0cKTXQx8SemEJ7fNhCGx-un6igfykgyKh-mlA6oslglH5spWeue1ZKb3_GbOhcCSjnhgQ',
    category: 'Gummies'
  },
  {
    id: '3',
    name: 'Caramelo Salado',
    price: 4.00,
    description: 'Dulce y Salado',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDWw3iJ8EeswnDTDJODYA45e8nC0NCpn38RhQIUSTlM_XjQ-7Z2pLrVfl99vPwI9TFTnnRXV0a39a7fYoeJkeMiOFGx87VBJYzrXyYnFMDs7hRlkf2DeWerLHIYj9uZc64txOlgF3-GCJoH1qC22wD3oR7H5QtPYr7qld-Dej9k5Pofmcx8rkKtcRtOtmMZVC0Mzg24cNyToFEyV4rwpNwd5fuFsdcSH_mdHMKVv-wSOCmounQEtCFHtCsMMcouOfspP9LEykxCjQ',
    category: 'Salty Snacks'
  },
  {
    id: '4',
    name: 'Gotas Frutales SF',
    price: 3.00,
    description: 'Endulzado con Stevia',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB1-TKoRh2j6Lcu3iuW-Mp2L_bS4LRpLPk7Uq_c7WbXEO6ETD1RJcfSBvZrq5dgpHpdSgPDM5P2gABl7MXxhntn4EDibeZbtxnSFACmydmvcSQz_Xj_hy1QXY64seaezs5JyhYlXkdV4-hIBMPh3huZ05R-6bR4ItBRMQiUpBJNVjgeNloky6ft6FlbMgj9fdA4ABul0eIxfRQbdZZLA_3S5mwVPinJOFNWdYXl-3AsAA_9K7KFXy-Ox1i8FPm3CSO_effhwpR3WQ',
    category: 'Sugar-Free'
  }
];

const categories = [
  { id: 'Chocolates', icon: 'bakery_dining', label: 'Chocolates' },
  { id: 'Gummies', icon: 'auto_awesome', label: 'Gomitas' },
  { id: 'Salty Snacks', icon: 'lunch_dining', label: 'Salados' },
  { id: 'Sugar-Free', icon: 'health_and_safety', label: 'Sin Azúcar' }
];

const BuildYourOwnTreats: React.FC<BuildYourOwnTreatsProps> = ({ onBack, onNext }) => {
  const [selectedCategory, setSelectedCategory] = useState('Chocolates');
  const [cart, setCart] = useState<Record<string, number>>({'1': 2});
  const [search, setSearch] = useState('');

  const addItem = (id: string) => {
    setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);
  const totalPrice = Object.entries(cart).reduce((sum, [id, qty]) => {
    const item = treatsData.find(t => t.id === id);
    return sum + (item ? item.price * qty : 0);
  }, 0);

  const filteredTreats = treatsData.filter(t => 
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark font-display animate-in fade-in slide-in-from-right-10 duration-300">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-white dark:bg-[#171112] border-b border-[#e5dcdd] dark:border-[#3d2e30]">
        <div className="flex items-center p-4 justify-between max-w-md mx-auto">
          <button 
            onClick={onBack}
            className="text-[#171112] dark:text-white flex size-10 shrink-0 items-center justify-center cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back_ios_new</span>
          </button>
          <div className="flex flex-col items-center">
            <span className="text-[10px] uppercase tracking-widest text-[#87646a] font-bold">Paso 2 de 3</span>
            <h2 className="text-[#171112] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">Elige tus Dulces</h2>
          </div>
          <div className="size-10 flex items-center justify-center">
            <button className="text-[#171112] dark:text-white hover:text-primary transition-colors">
              <span className="material-symbols-outlined">help_outline</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-md mx-auto w-full pb-32">
        {/* Page Progress Indicators */}
        <div className="flex w-full flex-row items-center justify-center gap-3 py-6">
          <div className="h-1.5 w-8 rounded-full bg-[#e5dcdd] dark:bg-[#3d2e30]"></div>
          <div className="h-1.5 w-12 rounded-full bg-primary shadow-[0_0_10px_rgba(238,43,75,0.4)]"></div>
          <div className="h-1.5 w-8 rounded-full bg-[#e5dcdd] dark:bg-[#3d2e30]"></div>
        </div>

        {/* Search Bar */}
        <div className="px-4 pb-4">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#87646a]">search</span>
            <input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white dark:bg-[#2a1a1c] border-none rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-primary/50 text-[#171112] dark:text-white placeholder-[#87646a] shadow-sm" 
              placeholder="Buscar dulces..." 
              type="text"
            />
          </div>
        </div>

        {/* Category Chips */}
        <div className="flex gap-3 px-4 pb-4 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-xl px-4 transition-all active:scale-95 ${
                selectedCategory === cat.id
                  ? 'bg-primary text-white shadow-md shadow-primary/20'
                  : 'bg-white dark:bg-[#2a1a1c] border border-[#e5dcdd] dark:border-[#3d2e30] text-[#171112] dark:text-white hover:bg-gray-50 dark:hover:bg-[#3d2e30]'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">{cat.icon}</span>
              <p className="text-sm font-semibold">{cat.label}</p>
            </button>
          ))}
        </div>

        {/* Grid Items */}
        <div className="grid grid-cols-2 gap-4 p-4">
          {filteredTreats.map((treat) => {
            const qty = cart[treat.id] || 0;
            return (
              <div 
                key={treat.id}
                className="flex flex-col gap-2 relative bg-white dark:bg-[#1a0d0f] rounded-xl p-2 border border-transparent shadow-sm hover:shadow-md transition-all group"
              >
                <div 
                  className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-lg shadow-sm" 
                  style={{ backgroundImage: `url("${treat.image}")` }}
                ></div>
                
                {qty > 0 && (
                  <div className="absolute top-4 right-4 bg-primary text-white text-[10px] font-bold px-2 py-1 rounded-full animate-in zoom-in duration-200 shadow-sm">
                    {qty} EN CESTA
                  </div>
                )}

                <div className="px-1 flex flex-col grow">
                  <p className="text-[#171112] dark:text-white text-sm font-bold leading-tight line-clamp-1">{treat.name}</p>
                  <p className="text-primary text-xs font-bold mt-1">${treat.price.toFixed(2)}</p>
                  <p className="text-[#87646a] text-[11px] font-normal leading-normal line-clamp-1">{treat.description}</p>
                </div>

                <button 
                  onClick={() => addItem(treat.id)}
                  className={`mt-2 w-full rounded-lg py-2 flex items-center justify-center gap-1 transition-all active:scale-95 ${
                    qty > 0 
                      ? 'bg-primary/10 hover:bg-primary/20 text-primary' 
                      : 'bg-background-light dark:bg-[#2a1a1c] border border-[#e5dcdd] dark:border-[#3d2e30] text-[#171112] dark:text-white hover:bg-gray-200 dark:hover:bg-[#3d2e30]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">add</span>
                  <span className="text-xs font-bold uppercase">{qty > 0 ? 'AGREGAR MÁS' : 'AGREGAR'}</span>
                </button>
              </div>
            );
          })}
        </div>
      </main>

      {/* Floating Action Panel Footer */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 dark:bg-[#171112]/80 backdrop-blur-lg border-t border-[#e5dcdd] dark:border-[#3d2e30] z-50">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between gap-4 rounded-xl bg-white dark:bg-[#2a1a1c] p-4 shadow-xl border border-[#e5dcdd] dark:border-[#3d2e30]">
            <div className="flex flex-col gap-0.5">
              <p className="text-[#171112] dark:text-white text-lg font-extrabold leading-tight">
                Total: ${(totalPrice + 15).toFixed(2)} <span className="text-xs font-normal text-gray-500">(inc. base)</span>
              </p>
              <p className="text-primary text-xs font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">shopping_bag</span>
                {totalItems} items seleccionados
              </p>
            </div>
            <button 
              onClick={onNext}
              disabled={totalItems === 0}
              className="flex min-w-[120px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-6 bg-primary text-white text-sm font-bold leading-normal shadow-lg shadow-primary/30 active:scale-95 transition-all hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="truncate">Siguiente</span>
              <span className="material-symbols-outlined ml-2 text-[20px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuildYourOwnTreats;