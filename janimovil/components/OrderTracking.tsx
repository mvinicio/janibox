import React from 'react';

interface OrderTrackingProps {
  onBack: () => void;
}

const OrderTracking: React.FC<OrderTrackingProps> = ({ onBack }) => {
  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark animate-in fade-in slide-in-from-right-10 duration-300 font-display">
      {/* Top Navigation Bar (Absolute over map) */}
      <div className="absolute top-0 left-0 right-0 z-50 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-transparent dark:border-white/5">
        <div className="flex items-center p-4 pb-2 justify-between">
          <button 
            onClick={onBack}
            className="text-[#171112] dark:text-white flex size-12 shrink-0 items-center justify-start cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back_ios</span>
          </button>
          <div className="flex flex-col items-center">
            <h2 className="text-[#171112] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">Orden #CS-8821</h2>
            <span className="text-xs font-bold text-primary animate-pulse">Entrega en Curso</span>
          </div>
          <div className="flex w-12 items-center justify-end">
            <button className="flex size-10 cursor-pointer items-center justify-center rounded-full bg-white/50 dark:bg-zinc-800 text-[#171112] dark:text-white hover:bg-white dark:hover:bg-zinc-700 transition-colors">
              <span className="material-symbols-outlined">help</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col pt-16">
        {/* Map Section */}
        <div className="relative w-full h-[45vh] bg-gray-200 dark:bg-gray-800">
          <div 
            className="w-full h-full bg-center bg-no-repeat bg-cover grayscale-[0.2] contrast-[1.1] opacity-90" 
            style={{ backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuD_O121P29Lh16HcieeXVokJLoLO1oooCaJZDp6zEwJEBuDiMGgfUXnbxMnTUxrHfcmfoyL0-VOTNqp4Kg1BFej2zRi36CNhVUoiCgno3_SnPilaMW9u14Nsyh2RyOEssWwoYE14_n1DA5siaMhWm1QtYqWQe_Ql4R6DUQg9p9aEee-hGXJiiz51_alYM3S51vAwipv-FT2ovENMCoFQTJgZTE0_7gf52a3L4DyGqeZTJLC0Q1X8uxAMpYaDUHLEJWP7A5tkXzmFg")` }}
          >
          </div>
          
          {/* Map Overlay: Delivery Info Card */}
          <div className="absolute top-6 left-4 right-4 flex justify-center z-10">
            <div className="bg-white dark:bg-zinc-900 rounded-xl p-3 shadow-xl border border-primary/10 flex items-center gap-3 animate-in slide-in-from-top-4 duration-500">
              <div className="bg-primary/10 p-2 rounded-lg">
                <span className="material-symbols-outlined text-primary text-2xl">moped</span>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">Llegada Estimada</p>
                <p className="text-lg font-bold text-[#171112] dark:text-white leading-none">
                  10:15 AM <span className="text-sm font-normal text-zinc-500">(12 mins)</span>
                </p>
              </div>
            </div>
          </div>

          {/* Map Marker Placeholder (Center-ish) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0">
            <div className="relative group cursor-pointer">
              <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-25 duration-1000"></div>
              <div className="relative bg-primary text-white p-3 rounded-full shadow-2xl border-4 border-white dark:border-zinc-800 transform group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-xl block">location_on</span>
              </div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-black/50 w-4 h-1.5 rounded-[100%] blur-[2px]"></div>
            </div>
          </div>
        </div>

        {/* Bottom Sheet Interaction Area */}
        <div className="flex-1 bg-white dark:bg-background-dark rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] relative -mt-8 z-20 px-4 isolate">
          {/* Handle */}
          <div className="flex h-8 w-full items-center justify-center">
            <div className="h-1.5 w-12 rounded-full bg-zinc-200 dark:bg-zinc-700"></div>
          </div>

          <div className="pt-2 pb-8 overflow-y-auto max-h-[calc(55vh-2rem)]">
            <h3 className="text-[#171112] dark:text-white tracking-tight text-2xl font-bold leading-tight pb-6">Detalles del Rastreo</h3>

            {/* Driver Contact Section */}
            <div className="flex items-center justify-between p-4 bg-background-light dark:bg-zinc-800/50 border border-transparent dark:border-zinc-700 rounded-2xl mb-8 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="size-12 rounded-full bg-zinc-300 overflow-hidden ring-2 ring-white dark:ring-zinc-600">
                  <img 
                    alt="Driver" 
                    className="w-full h-full object-cover" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBIDbSr4BFG3ONAcDKrzsdKhTh3lX8sQ_qp6AiiApMsIeFaHlvyj7yHDQAAEuXgA9wZqSPCwL-3AkljEa6IX4Ic9QFPn9-7GIilVQKNhODeD8rt1e1b7N4s-3Y6EyyAofr7K1mEt5p8Yq---dh7FFl4gV2omuT8hpMr7o5vhPn1913J0AIHXBM5oLoL_jgGi9HVp4fQYAliG8wcBI8Z7w9arYyQP1ZtmF60bjXbaDjTKJi9Q8P9PJk6H-IUwJvec8ItfxIQ9mL5lw"
                  />
                </div>
                <div>
                  <p className="text-xs text-zinc-500 font-medium">Tu repartidor</p>
                  <p className="text-base font-bold text-[#171112] dark:text-white">Alex Johnson</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="size-10 flex items-center justify-center rounded-full bg-white dark:bg-zinc-700 text-primary border border-gray-100 dark:border-zinc-600 shadow-sm hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined">chat</span>
                </button>
                <button className="size-10 flex items-center justify-center rounded-full bg-primary text-white shadow-md shadow-primary/30 hover:scale-105 transition-transform hover:bg-primary-dark">
                  <span className="material-symbols-outlined">call</span>
                </button>
              </div>
            </div>

            {/* Timeline Component */}
            <div className="grid grid-cols-[48px_1fr] gap-x-2 relative">
              {/* Step 1: Received */}
              <div className="flex flex-col items-center gap-0">
                <div className="flex size-8 items-center justify-center rounded-full bg-green-500 text-white shadow-sm z-10">
                  <span className="material-symbols-outlined text-sm font-bold">check</span>
                </div>
                <div className="w-[2px] bg-green-500 h-12 -mt-1 -mb-1"></div>
              </div>
              <div className="flex flex-1 flex-col pb-6">
                <p className="text-[#171112] dark:text-white text-base font-bold leading-none">Orden Recibida</p>
                <p className="text-zinc-500 text-sm font-normal mt-1">Confirmado a las 8:30 AM</p>
              </div>

              {/* Step 2: Preparation */}
              <div className="flex flex-col items-center gap-0">
                <div className="flex size-8 items-center justify-center rounded-full bg-green-500 text-white shadow-sm z-10">
                  <span className="material-symbols-outlined text-sm font-bold">check</span>
                </div>
                <div className="w-[2px] bg-primary h-16 -mt-1 -mb-1"></div>
              </div>
              <div className="flex flex-1 flex-col pb-6">
                <div className="flex items-center gap-2">
                  <p className="text-[#171112] dark:text-white text-base font-bold leading-none">Preparación</p>
                  <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-full uppercase border border-primary/10">Safety First</span>
                </div>
                <p className="text-zinc-500 text-sm font-normal mt-1 italic">"Desinfectando superficies y herramientas"</p>
                <p className="text-zinc-400 text-xs mt-0.5">Completado a las 9:45 AM</p>
              </div>

              {/* Step 3: Out for Delivery (Active) */}
              <div className="flex flex-col items-center gap-0">
                <div className="flex size-8 items-center justify-center rounded-full bg-primary text-white shadow-[0_0_0_4px_rgba(230,76,102,0.2)] z-10 animate-pulse">
                  <span className="material-symbols-outlined text-sm">moped</span>
                </div>
                <div className="w-[2px] bg-zinc-200 dark:bg-zinc-700 h-14 -mt-1 -mb-1"></div>
              </div>
              <div className="flex flex-1 flex-col pb-6">
                <p className="text-primary text-base font-bold leading-none">En Camino</p>
                <p className="text-zinc-500 text-sm font-normal mt-1">¡Alex va en camino con tus snacks!</p>
                <p className="text-primary text-xs font-bold mt-1 bg-primary/5 w-fit px-2 py-0.5 rounded">Llegada: 10:15 AM</p>
              </div>

              {/* Step 4: Delivered */}
              <div className="flex flex-col items-center gap-0">
                <div className="flex size-8 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-400 border border-zinc-200 dark:border-zinc-700 z-10">
                  <span className="material-symbols-outlined text-sm">card_giftcard</span>
                </div>
              </div>
              <div className="flex flex-1 flex-col">
                <p className="text-zinc-400 text-base font-bold leading-none">Entregado</p>
                <p className="text-zinc-400 text-sm font-normal mt-1">Esperando entrega</p>
              </div>
            </div>

            {/* Footer Action */}
            <div className="mt-8 flex flex-col gap-4">
              <div className="p-4 bg-primary/5 border border-primary/10 rounded-xl">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary mt-0.5">info</span>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    Tu ramo incluye snacks perecederos (chocolate). Por favor asegura que alguien pueda recibirlo.
                  </p>
                </div>
              </div>
              <button className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 active:scale-[0.98]">
                <span className="material-symbols-outlined">share</span>
                Compartir Rastreo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;