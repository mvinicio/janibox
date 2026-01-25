import React from 'react';

interface OrderConfirmationProps {
  onHome: () => void;
  onTrack: () => void;
}

const OrderConfirmation: React.FC<OrderConfirmationProps> = ({ onHome, onTrack }) => {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-white dark:bg-background-dark animate-in fade-in slide-in-from-right-10 duration-300 font-display">
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-50 flex items-center bg-white/80 dark:bg-background-dark/80 backdrop-blur-md p-4 pb-2 justify-between border-b border-gray-100 dark:border-gray-800">
        <div className="flex size-12 shrink-0 items-center justify-start">
          <span className="material-symbols-outlined text-primary text-2xl">check_circle</span>
        </div>
        <h2 className="text-[#171112] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">
          Pedido Confirmado
        </h2>
      </div>

      <main className="flex-1 pb-32">
        {/* Headline Section */}
        <div className="px-4 py-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-4 animate-bounce" style={{ animationDuration: '2s' }}>
            <span className="material-symbols-outlined text-primary text-4xl">celebration</span>
          </div>
          <h1 className="text-[#171112] dark:text-white tracking-tight text-[32px] font-bold leading-tight pb-2">¡Muchas Gracias!</h1>
          <p className="text-[#87646a] dark:text-gray-400 text-base font-normal leading-normal px-6">
            Hemos recibido tu pedido y estamos preparando tu dulce sorpresa.
          </p>
        </div>

        {/* Order Summary Card */}
        <div className="px-4 mb-6">
          <div className="flex flex-col gap-4 rounded-xl bg-white dark:bg-gray-800 p-5 shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-gray-50 dark:border-gray-700/50">
            <div className="flex justify-between items-start">
              <div className="flex flex-col gap-1">
                <p className="text-xs font-bold text-primary uppercase tracking-wider">Número de Orden</p>
                <p className="text-[#171112] dark:text-white text-lg font-bold leading-tight">#CS-8829</p>
              </div>
              <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                <span className="size-1.5 rounded-full bg-green-500 animate-pulse"></span>
                Procesando
              </div>
            </div>
            <div className="flex gap-4 items-center border-t border-gray-50 dark:border-gray-700/50 pt-4">
              <div 
                className="w-16 h-16 bg-center bg-no-repeat bg-cover rounded-lg shrink-0 shadow-sm" 
                style={{ backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuCpJZqMIh0p9UEJsLjJPvgyjNKA0cQ8DHQG_ba6els2VZqug38r1P09NVxKNS2-1UJiYVdIYH4-rjb4rY7uwDiBWzvoUMBf9pBb1rT97-TGcRgWb-R9EXD2ifT3eeZRcgEBMiwX_mZGFryligCDqa435dmo8VOomeFCDplwXlWReWxH8-wl24M1i5Tp2zHrbRwqJFE79QsHdVRE_Li48LS1gJMsS3Z0lWCVQF2tjI6FYKn9_5SZP6iKPFYyM4YZrlhUXC1FQItlYg")` }}
              >
              </div>
              <div className="flex flex-col">
                <p className="text-[#171112] dark:text-white text-sm font-bold">Ramo Sunshine de Dulces</p>
                <p className="text-[#87646a] dark:text-gray-400 text-xs">Mix Deluxe de Celebración</p>
              </div>
            </div>
            <button className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-background-light dark:bg-gray-700/50 text-[#171112] dark:text-white gap-2 text-sm font-semibold leading-normal transition-colors active:scale-95 hover:bg-gray-100 dark:hover:bg-gray-700">
              <span className="truncate">Ver Detalles</span>
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </div>
        </div>

        {/* Delivery Details Section */}
        <div className="px-4 mb-8">
          <h3 className="text-[#171112] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] pb-3 pt-4">
            Detalles de Entrega
          </h3>
          <div className="flex items-start gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-50 dark:border-gray-700/50">
            <span className="material-symbols-outlined text-gray-400">local_shipping</span>
            <div className="flex flex-col">
              <p className="text-sm font-bold text-[#171112] dark:text-white">Llegada Estimada</p>
              <p className="text-sm text-[#87646a] dark:text-gray-400">Miércoles, 25 Oct • 2:00 PM - 5:00 PM</p>
            </div>
          </div>
        </div>

        {/* Our Safety Promise Section */}
        <div className="px-4 mb-8">
          <div className="bg-primary/5 dark:bg-primary/10 rounded-2xl p-6 border border-primary/10">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-primary font-bold">verified_user</span>
              <h3 className="text-[#171112] dark:text-white text-lg font-bold leading-tight">Promesa de Seguridad</h3>
            </div>
            <p className="text-[#87646a] dark:text-gray-300 text-sm leading-relaxed mb-6">
              Tu regalo está siendo preparado con los estándares de higiene más altos para asegurar que llegue seguro y delicioso.
            </p>
            <div className="grid grid-cols-3 gap-2">
              <div className="flex flex-col items-center text-center gap-2">
                <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center shadow-sm text-primary">
                  <span className="material-symbols-outlined text-xl">masks</span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-tighter text-[#171112] dark:text-white">Mascarillas</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center shadow-sm text-primary">
                  <span className="material-symbols-outlined text-xl">clean_hands</span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-tighter text-[#171112] dark:text-white">Desinfectado</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center shadow-sm text-primary">
                  <span className="material-symbols-outlined text-xl">pan_tool_alt</span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-tighter text-[#171112] dark:text-white">Guantes</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Sticky Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 p-4 pb-8 bg-white/90 dark:bg-background-dark/90 backdrop-blur-lg border-t border-gray-100 dark:border-gray-800 flex flex-col gap-3 max-w-[500px] mx-auto z-50">
        <button 
          onClick={onTrack}
          className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/25 flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
        >
          <span className="material-symbols-outlined">location_on</span>
          Rastrear Pedido
        </button>
        <button 
          onClick={onHome}
          className="w-full bg-transparent hover:bg-gray-100 dark:hover:bg-white/5 text-[#87646a] dark:text-gray-400 font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
        >
          Volver al Inicio
        </button>
      </div>
    </div>
  );
};

export default OrderConfirmation;