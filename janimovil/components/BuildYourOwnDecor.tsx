import React, { useState } from 'react';

interface BuildYourOwnDecorProps {
  onBack: () => void;
  onFinish: () => void;
}

const BuildYourOwnDecor: React.FC<BuildYourOwnDecorProps> = ({ onBack, onFinish }) => {
  const [selectedBalloon, setSelectedBalloon] = useState('Birthday');
  const [selectedRibbon, setSelectedRibbon] = useState('primary');
  const [message, setMessage] = useState('');

  const balloons = [
    { id: 'Birthday', label: 'Cumpleaños', icon: 'cake' },
    { id: 'Anniversary', label: 'Aniversario', icon: 'favorite' },
    { id: 'Love', label: 'Amor', icon: 'volunteer_activism' },
    { id: 'ThankYou', label: 'Gracias', icon: 'sentiment_satisfied' },
  ];

  const ribbons = [
    { id: 'primary', colorClass: 'bg-primary' },
    { id: 'pink', colorClass: 'bg-pink-300' },
    { id: 'yellow', colorClass: 'bg-yellow-400' },
    { id: 'blue', colorClass: 'bg-blue-400' },
    { id: 'white', colorClass: 'bg-gray-100' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark font-display animate-in fade-in slide-in-from-right-10 duration-300">
      {/* TopAppBar */}
      <div className="sticky top-0 z-20 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-gray-100 dark:border-white/5">
        <div className="flex items-center p-4 pb-2 justify-between max-w-md mx-auto">
          <button 
            onClick={onBack}
            className="text-[#171112] dark:text-white flex size-10 shrink-0 items-center justify-center cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back_ios_new</span>
          </button>
          <div className="flex flex-col items-center">
            <span className="text-[10px] uppercase tracking-widest text-[#87646a] font-bold">Paso 3 de 3</span>
            <h2 className="text-[#171112] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] text-center">
              Toques Finales
            </h2>
          </div>
          <div className="size-10"></div>
        </div>
        
        {/* PageIndicators */}
        <div className="flex w-full flex-row items-center justify-center gap-3 py-3">
          <div className="h-1.5 w-8 rounded-full bg-[#e5dcdd] dark:bg-[#3d2e30]"></div>
          <div className="h-1.5 w-8 rounded-full bg-[#e5dcdd] dark:bg-[#3d2e30]"></div>
          <div className="h-1.5 w-12 rounded-full bg-primary shadow-[0_0_10px_rgba(238,43,75,0.4)]"></div>
        </div>
      </div>

      <main className="flex-1 overflow-y-auto pb-40 max-w-md mx-auto w-full">
        {/* HeaderImage (Live Preview) */}
        <div className="px-4 py-3">
          <div 
            className="bg-cover bg-center flex flex-col justify-end overflow-hidden bg-white dark:bg-neutral-800 rounded-xl min-h-80 shadow-md border border-neutral-200 dark:border-neutral-700 relative group" 
            style={{ backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0) 40%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuBVG6mMeXfVWrzlz9EV05eD2K7f0bMurUQhWCwl8K49qXeH3CupLMsKlNM3gZvuEtmielifI1Ax5D0I6mG2MNKsIF4ayWORs8UKAMu6zu3yictgxdlCkARq-U3y4zivR-KYDDaWbBRCVwbYzblObsuKp1CqiP7yFjrorW_eanRhObLSJX9ZgN_FwHFacAJ-NbzaOnjX6YjAUmWn442jma5rFUPLxpd_IZfg6iuWzPUkavMzHJxIZlKwQNKy9ibm_97ihKSzKKNxXw")` }}
          >
            <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full border border-white/30">
              Vista Previa
            </div>
            <div className="flex p-6 flex-col">
              <p className="text-white tracking-light text-[24px] font-bold leading-tight drop-shadow-md">
                Personaliza tu Ramo
              </p>
              <p className="text-white/90 text-sm mt-1 font-medium">
                Agrega los detalles que lo hacen único
              </p>
            </div>
          </div>
        </div>

        {/* Balloon Section */}
        <div className="flex flex-col">
          <h3 className="text-[#171112] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-4">
            Tema del Globo
          </h3>
          <div className="flex gap-3 px-4 overflow-x-auto no-scrollbar pb-2">
            {balloons.map((balloon) => (
              <button
                key={balloon.id}
                onClick={() => setSelectedBalloon(balloon.id)}
                className={`flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-xl px-5 transition-all active:scale-95 ${
                  selectedBalloon === balloon.id
                    ? 'bg-primary text-white shadow-lg shadow-primary/25'
                    : 'bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-[#171112] dark:text-neutral-200 hover:bg-gray-50 dark:hover:bg-neutral-700'
                }`}
              >
                <span className="material-symbols-outlined text-sm">{balloon.icon}</span>
                <p className="text-sm font-semibold leading-normal">{balloon.label}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Ribbon Section */}
        <div className="flex flex-col mt-6">
          <h3 className="text-[#171112] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-3">
            Color del Listón
          </h3>
          <div className="flex gap-5 px-4 items-center">
            {ribbons.map((ribbon) => (
              <button
                key={ribbon.id}
                onClick={() => setSelectedRibbon(ribbon.id)}
                className={`relative rounded-full transition-transform active:scale-90 ${
                  selectedRibbon === ribbon.id 
                    ? 'ring-2 ring-offset-2 ring-primary ring-offset-background-light dark:ring-offset-background-dark scale-110' 
                    : 'hover:scale-110'
                }`}
              >
                <div className={`h-10 w-10 rounded-full ${ribbon.colorClass} border border-neutral-200 dark:border-neutral-600 shadow-sm`}></div>
                {selectedRibbon === ribbon.id && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`material-symbols-outlined text-sm ${ribbon.id === 'white' || ribbon.id === 'yellow' ? 'text-black/50' : 'text-white'}`}>check</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Personal Message Section */}
        <div className="flex flex-col mt-8 px-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-[#171112] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">
              Tarjeta Dedicatoria
            </h3>
            <span className={`text-xs font-medium ${message.length > 130 ? 'text-primary' : 'text-neutral-500'}`}>
              {message.length}/150
            </span>
          </div>
          <div className="relative group">
            <textarea 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={150}
              className="w-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-4 text-sm focus:ring-2 focus:ring-primary/50 focus:border-primary min-h-[120px] dark:text-white placeholder:text-neutral-400 resize-none transition-shadow group-hover:shadow-sm" 
              placeholder="Escribe un mensaje especial para el destinatario..."
            ></textarea>
          </div>
          <div className="mt-4 flex items-start gap-3 p-4 bg-primary/5 dark:bg-primary/10 rounded-xl border border-primary/10">
            <span className="material-symbols-outlined text-primary text-xl shrink-0">edit_note</span>
            <p className="text-xs text-primary/80 font-medium leading-relaxed">
              Tu mensaje será escrito a mano en una tarjeta premium de regalo, agregando ese toque personal perfecto.
            </p>
          </div>
        </div>
      </main>

      {/* Fixed Footer Action */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-xl border-t border-neutral-200 dark:border-neutral-800 z-50">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-4 px-2">
            <div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium uppercase tracking-wide">Total Estimado</p>
              <p className="text-xl font-bold text-[#171112] dark:text-white">$45.00</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-green-600 dark:text-green-400 font-bold bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-md">
                Paso 3 de 3 Completado
              </p>
            </div>
          </div>
          <button 
            onClick={onFinish}
            className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">shopping_cart_checkout</span>
            Finalizar y Comprar
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuildYourOwnDecor;