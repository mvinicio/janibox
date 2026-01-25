import React, { useState } from 'react';
import Footer from './Footer';

interface ShopProps {
  onHome: () => void;
  onProfile: () => void;
  onProductClick: () => void;
  onCustom: () => void;
  onCartClick?: () => void;
}

interface Product {
  id: string;
  name: string;
  price: number;
  rating: number;
  image: string;
  category: string;
  isNew?: boolean;
}

const categories = [
  { id: 'all', label: 'Todos', icon: 'grid_view' },
  { id: 'chocolate', label: 'Chocolate', icon: 'cookie' },
  { id: 'spicy', label: 'Picante', icon: 'whatshot' },
  { id: 'gummies', label: 'Gomitas', icon: 'icecream' },
  { id: 'gift', label: 'Regalos', icon: 'redeem' },
];

const products: Product[] = [
  {
    id: '1',
    name: 'Ramo Clásico Chocolate',
    price: 45.00,
    rating: 4.9,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA4IhpDdH7q2pCd261z_Od-8L1nw5i4h9ktKJ-SQRGKayPBI8R5N5xvFt3ZD0zUiU4rcKQWs9nqU5EeNLdoP8Nmn5VmSkvocbaYTkTESDttYbvjFpzKCn5gYv8sIdgfbG-3mlFPs5rmWzR6ijlzFXkGh0OLxQfE538ixwIwud_LDTV_Y2EB1LZi9bQxpJDMZsD9fJA62Ok5XeXbtttxwRPL-OoK_ftsnBaMQr0qAhh6El_HU9aE1y7kOYSdyQPmbsTKB0uPdweG7A',
    category: 'chocolate'
  },
  {
    id: '2',
    name: 'Explosión de Tamarindo',
    price: 32.00,
    rating: 4.8,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDSWyhph1T4zc9C3JY76xCMxo_oLLS9L0RMQL1y4kaKI6bZdhfYsohQrAE6u2y1aiSC6F-eG-4HSWEhW4YRTiIuwshFTEXXTZYoViJhzAtppCdVESN8KowuqNFfu5419XKq-vhNiIQZz1mS3Wfu1peo-pBCozmGr8IpF2WMa5RpKDrMH54q7byKQyzJGKhTC7FwMWMfrbmIZzpdRGt0efDGApFItnNhElxeSaypNn6FJGZLKjNvyjmSXjcDknZYs6MHMK5QwYaXQ',
    category: 'spicy',
    isNew: true
  },
  {
    id: '3',
    name: 'Ositos Cariñosos',
    price: 28.50,
    rating: 4.7,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBnDl1Wtt6yjU2PxjiYm4pmf8q8MqOh-zc84X5BcwqCC-KBq9qsF34dwziaf5b0Tx5C5kwBfqEq0eL7LwR7qZ1nGK7UYYOl-0PEPOzUpKXoER0gC5SfVJM4TPFLksd1M51n3Z9mYAy7GKXU75U28v9CDv0a5Q436jxPNJkayg_nMlqBHVZONmUmzm25ERgNMmSGdXyKN5hMLQWk2SFirSGPRuMgJcj5uVJnVTrTu4ycJyDb9wmzwnVga5i3pd755kFk00Ir8W3C8w',
    category: 'gummies'
  },
  {
    id: '4',
    name: 'Caja Premium Trufas',
    price: 55.00,
    rating: 5.0,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDnHQiReXl_hzbkqoqem8wvQKHnu42UrlgyY31CpCrGHixSwdld_Wqlg2trxxnRvydY3YKn-q9n7KpCtXNhfGkUmXsSLig4RGjPxMuXSdkxvwvJC_e26ymgEDbvIgzjdJR6R1tNux369EGlOYOWOEIcy-kBHQ3jj6MyBAuqNG6jVaaBS5r_p11IOBjtF_0oD4FLBsCruzmxocgytDUd9PEW5M4kw7nP5O9PwktLWUZYgTnHbWlVc-fwVKef02IsoPPH7CcQdJ5lXw',
    category: 'chocolate'
  },
  {
    id: '5',
    name: 'Mix Salado & Dulce',
    price: 38.00,
    rating: 4.6,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCBjwNXiMW-6mvzSwB4MsmeuQW6SUv9hJ3YEQLHMhJGdEPfTMecu5ORK1V3Zx0lqCe4ELOH997XjXD1AvloVGVx1CdwPrqRal3y_2PSinS5DpWTf4RhGM1Sddb_9-CB3hxcJhe7P9q80lzxRmC2K85ZH3V7H9xt2PWn-UH-DzC6XZe3U2sBAyOpaW3lHvydViTv9dMT7yR7e35THfINh1qP2sPsFNCr5QlhfEJEHUBIV3ohDuKjagaFchEGBrx2L7cg9rS6noYjcw',
    category: 'gift'
  },
  {
    id: '6',
    name: 'Fantasía Frutal',
    price: 30.00,
    rating: 4.5,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB1-TKoRh2j6Lcu3iuW-Mp2L_bS4LRpLPk7Uq_c7WbXEO6ETD1RJcfSBvZrq5dgpHpdSgPDM5P2gABl7MXxhntn4EDibeZbtxnSFACmydmvcSQz_Xj_hy1QXY64seaezs5JyhYlXkdV4-hIBMPh3huZ05R-6bR4ItBRMQiUpBJNVjgeNloky6ft6FlbMgj9fdA4ABul0eIxfRQbdZZLA_3S5mwVPinJOFNWdYXl-3AsAA_9K7KFXy-Ox1i8FPm3CSO_effhwpR3WQ',
    category: 'gummies'
  }
];

const Shop: React.FC<ShopProps> = ({ onHome, onProfile, onProductClick, onCustom, onCartClick }) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');

  const filteredProducts = products.filter(product => {
    const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display animate-in fade-in slide-in-from-right-10 duration-300">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-background-dark/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between p-4 pb-2">
          <div className="flex items-center gap-3">
            <h1 className="text-[#181112] dark:text-white text-xl font-bold leading-tight tracking-[-0.015em]">
              Tienda
            </h1>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={onCartClick}
              className="relative flex size-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-[#181112] dark:text-white transition-colors"
            >
              <span className="material-symbols-outlined">shopping_cart</span>
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-white font-bold shadow-sm">
                2
              </span>
            </button>
          </div>
        </div>
        
        {/* Search Bar */}
        <div className="px-4 pb-4">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
            <input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-gray-100 dark:bg-gray-800/50 border-none rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary text-[#181112] dark:text-white placeholder-gray-400 transition-all" 
              placeholder="Buscar ramos, dulces..." 
              type="text"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-2 px-4 pb-3 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex h-9 shrink-0 items-center gap-1.5 rounded-full px-4 text-xs font-bold transition-all active:scale-95 border ${
                activeCategory === cat.id
                  ? 'bg-primary text-white border-primary shadow-md shadow-primary/20'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700'
              }`}
            >
              {activeCategory === cat.id && <span className="material-symbols-outlined text-[16px]">{cat.icon}</span>}
              {cat.label}
            </button>
          ))}
        </div>
      </header>

      <main className="flex-1 px-4 py-4 pb-32">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-bold text-[#181112] dark:text-white">
            {filteredProducts.length} Resultados
          </p>
          <button className="flex items-center gap-1 text-xs font-semibold text-gray-500">
            <span className="material-symbols-outlined text-[16px]">sort</span>
            Filtros
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {filteredProducts.map((product) => (
            <div 
              key={product.id}
              onClick={onProductClick}
              className="group flex flex-col bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700/50 hover:shadow-md transition-all cursor-pointer active:scale-[0.98]"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{ backgroundImage: `url("${product.image}")` }}
                />
                {product.isNew && (
                  <div className="absolute top-2 left-2 bg-primary text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm">
                    NUEVO
                  </div>
                )}
                <button className="absolute top-2 right-2 size-8 bg-white/90 dark:bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-400 hover:text-primary transition-colors shadow-sm">
                  <span className="material-symbols-outlined text-[18px]">favorite</span>
                </button>
              </div>
              
              <div className="p-3 flex flex-col gap-1">
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[12px] text-yellow-400 filled">star</span>
                  <span className="text-[10px] font-bold text-gray-500">{product.rating}</span>
                </div>
                <h3 className="text-sm font-bold text-[#181112] dark:text-white leading-tight line-clamp-2 min-h-[2.5em]">
                  {product.name}
                </h3>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-primary font-bold text-base">${product.price.toFixed(2)}</p>
                  <button className="size-7 bg-primary/10 text-primary rounded-lg flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-[18px]">add</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Reused Footer from Home */}
      <Footer 
        onHomeClick={onHome} 
        onProfileClick={onProfile}
        onShopClick={() => {}} // Already on shop
        onCustomClick={onCustom}
        activeTab="shop"
      />
    </div>
  );
};

export default Shop;