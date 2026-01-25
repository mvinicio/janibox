import React, { useState } from 'react';

interface GiftCardsProps {
  onBack: () => void;
  onHome: () => void;
  onShop: () => void;
  onProfile: () => void;
}

const GiftCards: React.FC<GiftCardsProps> = ({ onBack, onHome, onShop, onProfile }) => {
  const [selectedAmount, setSelectedAmount] = useState('$50');

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark font-display animate-in fade-in slide-in-from-right-10 duration-300">
      {/* TopAppBar */}
      <header className="sticky top-0 z-50 flex items-center bg-white/80 dark:bg-background-dark/80 backdrop-blur-md p-4 pb-2 justify-between border-b border-gray-100 dark:border-gray-800">
        <button 
          onClick={onBack}
          className="text-[#181112] dark:text-white flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined">arrow_back_ios_new</span>
        </button>
        <h1 className="text-[#181112] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-10">
          Tarjetas y Cupones
        </h1>
      </header>

      <main className="flex flex-col gap-2 pb-24">
        {/* Buy Gift Cards Section */}
        <section>
          <div className="px-4 pt-6">
            <h2 className="text-[#181112] dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em]">Comprar Tarjetas Digitales</h2>
            <p className="text-[#896168] dark:text-gray-400 text-sm mt-1">Envía una dulce sorpresa a alguien especial</p>
          </div>
          
          {/* Carousel */}
          <div className="flex overflow-x-auto no-scrollbar pb-2">
            <div className="flex items-stretch p-4 gap-4">
              {/* Card 1 */}
              <div className="flex h-full flex-1 flex-col gap-3 rounded-xl min-w-64 bg-white dark:bg-[#2d1a1d] p-3 shadow-sm border border-gray-100 dark:border-gray-800 transition-transform active:scale-95 cursor-pointer hover:shadow-md">
                <div 
                  className="w-full bg-center bg-no-repeat aspect-[4/3] bg-cover rounded-lg flex flex-col shadow-inner" 
                  style={{ backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuBnDl1Wtt6yjU2PxjiYm4pmf8q8MqOh-zc84X5BcwqCC-KBq9qsF34dwziaf5b0Tx5C5kwBfqEq0eL7LwR7qZ1nGK7UYYOl-0PEPOzUpKXoER0gC5SfVJM4TPFLksd1M51n3Z9mYAy7GKXU75U28v9CDv0a5Q436jxPNJkayg_nMlqBHVZONmUmzm25ERgNMmSGdXyKN5hMLQWk2SFirSGPRuMgJcj5uVJnVTrTu4ycJyDb9wmzwnVga5i3pd755kFk00Ir8W3C8w")` }}
                >
                </div>
                <div className="px-1">
                  <p className="text-[#181112] dark:text-white text-base font-bold leading-tight">Galaxia de Ositos</p>
                  <p className="text-[#896168] dark:text-gray-400 text-xs font-normal leading-normal">Para amantes del color</p>
                </div>
              </div>
              
              {/* Card 2 */}
              <div className="flex h-full flex-1 flex-col gap-3 rounded-xl min-w-64 bg-white dark:bg-[#2d1a1d] p-3 shadow-sm border border-gray-100 dark:border-gray-800 transition-transform active:scale-95 cursor-pointer hover:shadow-md">
                <div 
                  className="w-full bg-center bg-no-repeat aspect-[4/3] bg-cover rounded-lg flex flex-col shadow-inner" 
                  style={{ backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuDQErvgcXH-gb_fN08CcjpISHudC0PhrV-mKYo5ghKVHzhtgEptGpBz3qAnlAOx7pY8WTINsP1rL96JebZP-vY_6kKq2K8vC5g0f710CIbJT0JIKMp3P-ne4avOPTC7Zw8VxWLD0muVY31pSyQAjPGk_xgT1w0xqCY8XKSThddHQXDCydM33cVTYWXssOduvXjOYesTNpWUpt2E8dp4AUwctzNKB7ofqG0M1m-O2DhCO3G-N5JzOdS6b5LjZy2T43E2acLmULztlw")` }}
                >
                </div>
                <div className="px-1">
                  <p className="text-[#181112] dark:text-white text-base font-bold leading-tight">Lujo de Chocolate</p>
                  <p className="text-[#896168] dark:text-gray-400 text-xs font-normal leading-normal">Experiencia rica en cacao</p>
                </div>
              </div>

              {/* Card 3 */}
              <div className="flex h-full flex-1 flex-col gap-3 rounded-xl min-w-64 bg-white dark:bg-[#2d1a1d] p-3 shadow-sm border border-gray-100 dark:border-gray-800 transition-transform active:scale-95 cursor-pointer hover:shadow-md">
                <div 
                  className="w-full bg-center bg-no-repeat aspect-[4/3] bg-cover rounded-lg flex flex-col shadow-inner" 
                  style={{ backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuDXjAV6s3JIJTjbjhSYrfNJSx1u-xPf7mHvaTnfcKySOqmP5qTwtw1m5V-FKXCB6oBDMgSb5fLmXn0Uwe4oEpl-ywmpqerayyzKw1RXmyCEDKxrSGTVVhC670qqlylAFEnHR2_JoWeUUdZeBlq52pAGeWQEkzmtuE1SJm1V8TI6RhL7yfoTTOvjFMBnWTNbfDQxLkLFqJmqvHmGvb4vGJ2Jwqhu30SFFUaxMtra_17St7st8GnaCiM5S7L6fiILuvuEZB_tmZRXJA")` }}
                >
                </div>
                <div className="px-1">
                  <p className="text-[#181112] dark:text-white text-base font-bold leading-tight">Caramelo Vintage</p>
                  <p className="text-[#896168] dark:text-gray-400 text-xs font-normal leading-normal">Un dulce nostálgico</p>
                </div>
              </div>
            </div>
          </div>

          {/* Headline + SegmentedButtons */}
          <div className="px-4">
            <h3 className="text-[#181112] dark:text-white tracking-tight text-lg font-bold leading-tight pt-2">Seleccionar Monto</h3>
            <div className="flex py-4">
              <div className="flex h-12 flex-1 items-center justify-center rounded-full bg-white dark:bg-gray-800 p-1.5 shadow-sm border border-gray-100 dark:border-gray-700">
                {['$20', '$50', '$100', 'Otro'].map((amount) => (
                  <label key={amount} className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-full px-2 text-sm font-bold leading-normal transition-all ${selectedAmount === amount ? 'bg-primary text-white shadow-sm' : 'text-[#896168] dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                    <span className="truncate">{amount}</span>
                    <input 
                      type="radio" 
                      name="amount" 
                      value={amount} 
                      className="invisible w-0" 
                      checked={selectedAmount === amount}
                      onChange={() => setSelectedAmount(amount)}
                    />
                  </label>
                ))}
              </div>
            </div>
            <button className="w-full bg-primary text-white py-4 rounded-xl font-bold shadow-lg shadow-primary/20 active:scale-[0.98] transition-all hover:bg-primary-dark">
              Comprar Tarjeta de Regalo
            </button>
          </div>
        </section>

        {/* Coupon Wallet Section */}
        <section className="pb-8">
          <div className="px-4 pt-8 pb-4 flex justify-between items-end">
            <div>
              <h2 className="text-[#181112] dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em]">Cuponera</h2>
              <p className="text-[#896168] dark:text-gray-400 text-sm">Tus descuentos activos</p>
            </div>
            <button className="text-primary text-sm font-bold hover:underline">Ver Historial</button>
          </div>
          
          <div className="flex flex-col px-4 gap-4">
            {/* Coupon 1 */}
            <div className="relative overflow-hidden bg-white dark:bg-[#2d1a1d] rounded-xl border border-dashed border-primary/40 p-5 flex items-center justify-between group shadow-sm">
              {/* Half Circles for Ticket Look */}
              <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-background-light dark:bg-background-dark rounded-full"></div>
              <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-background-light dark:bg-background-dark rounded-full"></div>
              
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">celebration</span>
                </div>
                <div>
                  <h4 className="text-base font-bold text-[#181112] dark:text-white leading-tight">10% Bienvenida</h4>
                  <p className="text-xs text-[#896168] dark:text-gray-400">Primer pedido de ramos</p>
                  <p className="text-[10px] font-bold text-primary mt-1 uppercase tracking-wider">Expira en 28 días</p>
                </div>
              </div>
              <button className="bg-primary text-white px-5 py-2 rounded-full text-sm font-bold shadow-md shadow-primary/10 hover:bg-primary/90 transition-colors">
                Aplicar
              </button>
            </div>

            {/* Coupon 2 */}
            <div className="relative overflow-hidden bg-white dark:bg-[#2d1a1d] rounded-xl border border-dashed border-primary/40 p-5 flex items-center justify-between shadow-sm">
              <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-background-light dark:bg-background-dark rounded-full"></div>
              <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-background-light dark:bg-background-dark rounded-full"></div>
              
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">local_shipping</span>
                </div>
                <div>
                  <h4 className="text-base font-bold text-[#181112] dark:text-white leading-tight">Envío Gratis</h4>
                  <p className="text-xs text-[#896168] dark:text-gray-400">En pedidos de +$50</p>
                  <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-wider">Sin Expiración</p>
                </div>
              </div>
              <button className="bg-primary/10 text-primary px-5 py-2 rounded-full text-sm font-bold hover:bg-primary/20 transition-colors">
                Aplicar
              </button>
            </div>

            {/* Coupon 3 (Applied/Expired style) */}
            <div className="relative overflow-hidden bg-white dark:bg-[#2d1a1d] rounded-xl border border-dashed border-gray-200 dark:border-gray-700 p-5 flex items-center justify-between opacity-70">
              <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-background-light dark:bg-background-dark rounded-full border-r border-gray-100 dark:border-gray-800"></div>
              <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-background-light dark:bg-background-dark rounded-full border-l border-gray-100 dark:border-gray-800"></div>
              
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500">
                  <span className="material-symbols-outlined">timer</span>
                </div>
                <div>
                  <h4 className="text-base font-bold text-gray-500 leading-tight">Dulzura de Primavera</h4>
                  <p className="text-xs text-gray-400">$5 Descuento</p>
                  <p className="text-[10px] font-bold text-red-400 mt-1 uppercase tracking-wider">Expira hoy</p>
                </div>
              </div>
              <button className="bg-gray-100 dark:bg-gray-800 text-gray-500 px-5 py-2 rounded-full text-sm font-bold cursor-default">
                Aplicado
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Bottom Tab Bar (Local Navigation to match requested screen) */}
      <nav className="fixed bottom-0 w-full max-w-[500px] mx-auto bg-white/90 dark:bg-background-dark/90 backdrop-blur-lg border-t border-gray-100 dark:border-gray-800 pb-8 pt-3 flex justify-around items-center z-50">
        <button onClick={onHome} className="flex flex-col items-center gap-1 text-gray-400 hover:text-primary transition-colors w-16">
          <span className="material-symbols-outlined">home</span>
          <span className="text-[10px] font-medium">Inicio</span>
        </button>
        <button onClick={onShop} className="flex flex-col items-center gap-1 text-gray-400 hover:text-primary transition-colors w-16">
          <span className="material-symbols-outlined">redeem</span>
          <span className="text-[10px] font-medium">Tienda</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-primary w-16">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>confirmation_number</span>
          <span className="text-[10px] font-bold">Cupones</span>
        </button>
        <button onClick={onProfile} className="flex flex-col items-center gap-1 text-gray-400 hover:text-primary transition-colors w-16">
          <span className="material-symbols-outlined">person</span>
          <span className="text-[10px] font-medium">Perfil</span>
        </button>
      </nav>
    </div>
  );
};

export default GiftCards;