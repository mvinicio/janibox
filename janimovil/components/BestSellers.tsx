import React from 'react';

interface BestSellersProps {
  onProductClick?: () => void;
  onViewAllClick?: () => void;
}

const products = [
  {
    id: 1,
    name: "Delicia Clásica de Chocolate",
    price: "$45.00",
    rating: "4.9",
    reviews: "120",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA4IhpDdH7q2pCd261z_Od-8L1nw5i4h9ktKJ-SQRGKayPBI8R5N5xvFt3ZD0zUiU4rcKQWs9nqU5EeNLdoP8Nmn5VmSkvocbaYTkTESDttYbvjFpzKCn5gYv8sIdgfbG-3mlFPs5rmWzR6ijlzFXkGh0OLxQfE538ixwIwud_LDTV_Y2EB1LZi9bQxpJDMZsD9fJA62Ok5XeXbtttxwRPL-OoK_ftsnBaMQr0qAhh6El_HU9aE1y7kOYSdyQPmbsTKB0uPdweG7A",
    favoriteColor: "text-primary"
  },
  {
    id: 2,
    name: "Mezcla Picante de Tamarindo",
    price: "$32.00",
    rating: "4.7",
    reviews: "85",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBDSWyhph1T4zc9C3JY76xCMxo_oLLS9L0RMQL1y4kaKI6bZdhfYsohQrAE6u2y1aiSC6F-eG-4HSWEhW4YRTiIuwshFTEXXTZYoViJhzAtppCdVESN8KowuqNFfu5419XKq-vhNiIQZz1mS3Wfu1peo-pBCozmGr8IpF2WMa5RpKDrMH54q7byKQyzJGKhTC7FwMWMfrbmIZzpdRGt0efDGApFItnNhElxeSaypNn6FJGZLKjNvyjmSXjcDknZYs6MHMK5QwYaXQ",
    favoriteColor: "text-[#181112] dark:text-white"
  }
];

const BestSellers: React.FC<BestSellersProps> = ({ onProductClick, onViewAllClick }) => {
  return (
    <div>
      <div className="flex items-center justify-between px-4 pb-1 pt-6">
        <h2 className="text-[#181112] dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] font-display">
          Más Vendidos
        </h2>
        <button onClick={onViewAllClick} className="text-primary text-sm font-bold hover:underline">Ver todo</button>
      </div>

      <div className="flex overflow-x-auto no-scrollbar pb-4">
        <div className="flex items-stretch p-4 gap-4 min-w-full">
          {products.map((product) => (
            <div 
              key={product.id} 
              onClick={onProductClick}
              className="flex h-full flex-1 flex-col gap-3 rounded-xl min-w-[260px] w-[260px] bg-white dark:bg-gray-800 p-2 shadow-sm border border-gray-100 dark:border-gray-800/50 hover:shadow-md transition-all cursor-pointer group active:scale-[0.98]"
            >
              <div 
                className="w-full bg-center bg-no-repeat aspect-[4/5] bg-cover rounded-lg flex flex-col relative" 
                style={{ backgroundImage: `url("${product.image}")` }}
              >
                <div className="absolute top-2 right-2 flex items-center justify-center bg-white/90 dark:bg-black/50 rounded-full p-1.5 backdrop-blur-sm cursor-pointer hover:scale-110 transition-transform z-10">
                  <span className={`material-symbols-outlined text-sm ${product.favoriteColor}`}>favorite</span>
                </div>
              </div>
              <div className="px-2 pb-2">
                <p className="text-[#181112] dark:text-white text-base font-bold leading-normal font-display truncate group-hover:text-primary transition-colors">
                  {product.name}
                </p>
                <div className="flex items-center gap-1 my-1">
                  <span className="material-symbols-outlined text-xs text-yellow-400 filled">star</span>
                  <span className="text-xs text-gray-500 font-medium">{product.rating} ({product.reviews} reseñas)</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-primary text-lg font-bold leading-normal font-display">{product.price}</p>
                  <button className="flex size-8 items-center justify-center rounded-full bg-primary text-white hover:bg-primary-dark transition-colors active:scale-95 shadow-sm">
                    <span className="material-symbols-outlined text-xl">add</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BestSellers;