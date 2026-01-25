import React from 'react';

interface ProfileProps {
  onHome: () => void;
  onTrackOrder: () => void;
  onRedeem?: () => void;
  onShop?: () => void;
  onCustom?: () => void;
}

const Profile: React.FC<ProfileProps> = ({ onHome, onTrackOrder, onRedeem, onShop, onCustom }) => {
  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display animate-in fade-in slide-in-from-right-10 duration-300">
      {/* Top App Bar */}
      <div className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-transparent dark:border-white/5">
        <div className="flex items-center p-4 pb-2 justify-between">
          <div className="text-primary flex size-12 shrink-0 items-center justify-start">
            <span className="material-symbols-outlined text-[28px]">account_circle</span>
          </div>
          <h2 className="text-[#171112] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">Mi Perfil</h2>
          <div className="flex w-12 items-center justify-end">
            <button className="flex cursor-pointer items-center justify-center rounded-xl h-12 bg-transparent text-[#171112] dark:text-white transition-colors hover:bg-black/5 dark:hover:bg-white/10">
              <span className="material-symbols-outlined text-[24px]">settings</span>
            </button>
          </div>
        </div>
      </div>

      <main className="flex-1 pb-24 max-w-md mx-auto w-full">
        {/* Profile Header */}
        <div className="flex p-4 flex-col gap-4 items-center">
          <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full ring-4 ring-primary/10 min-h-24 w-24 shadow-sm" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAA7ZGD3OoZMC_mx17zOtI_6X9KrzCnQ4QIFH7F8aOA8Z7ItOS_K0S5Ko9D45qZQof3WZZ7lIxdSbMTDONrtolA4IBFJ0L68V2X661N86fkk0cXypRKMNNq1Agj8PDXdxf3j0bJcyzdOfO1qNJoL8gSdvTLCAvg6CVyn3Kg-JOUBaacoLCtErO5XJeORSVqLtGsAttcS7c_608eV07Jmg9PMG6R5U-bciM5WZIdXP75Uf3pvtl-dEHvbWjXC_uMwcXD0K0SbcPrGw")' }}>
          </div>
          <div className="flex flex-col items-center justify-center">
            <p className="text-[#171112] dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] text-center">Alex Johnson</p>
            <p className="text-primary text-base font-medium leading-normal text-center">Entusiasta de lo Dulce</p>
            <p className="text-[#87646a] dark:text-[#a38a8e] text-sm font-normal leading-normal text-center">Miembro desde Marzo 2023</p>
          </div>
        </div>
        
        {/* Loyalty Rewards Card */}
        <div className="p-4 pt-0">
          <div className="flex flex-col items-stretch justify-start rounded-xl shadow-sm border border-primary/10 bg-white dark:bg-[#2d1a1e] overflow-hidden">
            <div className="p-4 flex flex-col gap-1">
              <p className="text-primary text-xs font-bold leading-normal tracking-wider uppercase">Recompensas Dulces</p>
              <div className="flex justify-between items-center">
                <p className="text-[#171112] dark:text-white text-2xl font-extrabold leading-tight tracking-[-0.015em]">540 Puntos</p>
                <button 
                  onClick={onRedeem}
                  className="flex min-w-[100px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 px-4 bg-primary text-white text-sm font-bold leading-normal hover:bg-primary-dark transition-colors"
                >
                  Canjear
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-2 p-4 pt-0">
              <div className="flex gap-6 justify-between items-center">
                <p className="text-[#87646a] dark:text-[#a38a8e] text-sm font-normal leading-normal">Siguiente: Ramo Gratis (600 pts)</p>
                <p className="text-[#171112] dark:text-white text-xs font-bold leading-normal">90%</p>
              </div>
              <div className="rounded-full bg-[#e5dcdd] dark:bg-[#3d2c2f] h-2 w-full overflow-hidden">
                <div className="h-full rounded-full bg-primary transition-all duration-1000 ease-out" style={{ width: '90%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Gift History Section */}
        <div className="flex items-center justify-between px-4 pt-4">
          <h2 className="text-[#171112] dark:text-white text-[20px] font-bold leading-tight tracking-[-0.015em]">Historial de Regalos</h2>
          <button className="text-primary text-sm font-semibold hover:underline">Ver Todo</button>
        </div>

        {/* Gift Cards List */}
        <div className="flex flex-col gap-4 p-4">
          {/* Gift Item 1 */}
          <div className="flex flex-col items-stretch justify-start rounded-xl shadow-sm bg-white dark:bg-[#2d1a1e] overflow-hidden border border-gray-100 dark:border-white/5">
            <div className="w-full bg-center bg-no-repeat aspect-[16/9] bg-cover" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAiDoFhGtdPntS-5EeVu7BaIXojw6D4sD3JjlFTbGAYCHNFjncaejcMlT1aq3J7oJJGIJg3M99dNV02CwVfRJh6sphggZSmar9_WnkNXXobZvHQrFQPgPOC4RN9CBlOdRukeFHjCtA7imbnbC1_hOweF4X2DHpRgwOtz_rXeElZCcDnHwCNa5SmeAtUB2znjWDYfGNRCVP__C4OMREH3FJnKrv3M3GZxIOPIAD1QAifrjzyJpE8h_rQXElXZPrX-hEMQX_BaH1AmQ")' }}></div>
            <div className="flex flex-col gap-3 p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[#171112] dark:text-white text-lg font-bold leading-tight">Extravagancia de Chocolate</p>
                  <p className="text-[#87646a] dark:text-[#a38a8e] text-sm font-normal">Para: Sarah Jenkins • 12 Oct, 2023</p>
                </div>
                <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider flex items-center gap-1">
                  <span className="material-symbols-outlined text-[10px] filled">check_circle</span>
                  Entregado
                </div>
              </div>
              <div className="flex gap-2 pt-3 border-t border-background-light dark:border-[#3d2c2f]">
                <button className="flex-1 flex cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold gap-2 hover:bg-primary-dark transition-colors">
                  <span className="material-symbols-outlined text-[18px]">reorder</span>
                  Pedir de Nuevo
                </button>
                <button className="w-10 flex cursor-pointer items-center justify-center rounded-lg h-10 bg-background-light dark:bg-[#3d2c2f] text-[#171112] dark:text-white hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">
                  <span className="material-symbols-outlined text-[20px]">favorite</span>
                </button>
              </div>
            </div>
          </div>

          {/* Gift Item 2 */}
          <div className="flex flex-col items-stretch justify-start rounded-xl shadow-sm bg-white dark:bg-[#2d1a1e] overflow-hidden border border-gray-100 dark:border-white/5">
            <div className="w-full bg-center bg-no-repeat aspect-[16/9] bg-cover" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuB2vWkM6QlhB_3XeKwvPI-H_OGZ0QSaUHvjxIJuinFQoTr3F-_eU89F_4Bf5EY1rL2wK8_xoEiqpbLZ3YB-aLBQRdha7mUjUZ4BH1G7jIhVVCTYeoUmO-50PESmj1ZgggwC0DjhN6l3HHOmxkxmUV-LMiRxJElAkD6m-rMJsBzsrnSNBC7NhFaTshBOsgL7hXvofQTggYacfT4iM_CMnRCansxDnV7WwB_hpEtzihOjbKkgVQjrMymrb7zJ9htVCsxi13Pei4f6XA")' }}></div>
            <div className="flex flex-col gap-3 p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[#171112] dark:text-white text-lg font-bold leading-tight">Delicia Neón Ácida</p>
                  <p className="text-[#87646a] dark:text-[#a38a8e] text-sm font-normal">Para: Michael K. • 20 Sep, 2023</p>
                </div>
                <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider flex items-center gap-1">
                  <span className="material-symbols-outlined text-[10px] filled">check_circle</span>
                  Entregado
                </div>
              </div>
              <div className="flex gap-2 pt-3 border-t border-background-light dark:border-[#3d2c2f]">
                <button className="flex-1 flex cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold gap-2 hover:bg-primary-dark transition-colors">
                  <span className="material-symbols-outlined text-[18px]">reorder</span>
                  Pedir de Nuevo
                </button>
                <button className="w-10 flex cursor-pointer items-center justify-center rounded-lg h-10 bg-background-light dark:bg-[#3d2c2f] text-[#171112] dark:text-white hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">
                  <span className="material-symbols-outlined text-[20px]">favorite</span>
                </button>
              </div>
            </div>
          </div>

          {/* Gift Item 3 (In Transit) */}
          <div className="flex flex-col items-stretch justify-start rounded-xl shadow-sm bg-white dark:bg-[#2d1a1e] overflow-hidden border border-gray-100 dark:border-white/5">
            <div className="w-full bg-center bg-no-repeat aspect-[16/9] bg-cover" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCBjwNXiMW-6mvzSwB4MsmeuQW6SUv9hJ3YEQLHMhJGdEPfTMecu5ORK1V3Zx0lqCe4ELOH997XjXD1AvloVGVx1CdwPrqRal3y_2PSinS5DpWTf4RhGM1Sddb_9-CB3hxcJhe7P9q80lzxRmC2K85ZH3V7H9xt2PWn-UH-DzC6XZe3U2sBAyOpaW3lHvydViTv9dMT7yR7e35THfINh1qP2sPsFNCr5QlhfEJEHUBIV3ohDuKjagaFchEGBrx2L7cg9rS6noYjcw")' }}></div>
            <div className="flex flex-col gap-3 p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[#171112] dark:text-white text-lg font-bold leading-tight">Caja Artesanal Salada</p>
                  <p className="text-[#87646a] dark:text-[#a38a8e] text-sm font-normal">Para: Emma Williams • Hoy</p>
                </div>
                <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider flex items-center gap-1">
                  <span className="material-symbols-outlined text-[10px] animate-spin">sync</span>
                  En Tránsito
                </div>
              </div>
              <div className="flex gap-2 pt-3 border-t border-background-light dark:border-[#3d2c2f]">
                <button 
                  onClick={onTrackOrder}
                  className="flex-1 flex cursor-pointer items-center justify-center rounded-lg h-10 px-4 border border-primary text-primary text-sm font-bold gap-2 hover:bg-primary/5 transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">location_on</span>
                  Rastrear Pedido
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Navigation Bar (iOS Style - Local to Profile for visual match) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-background-dark/80 backdrop-blur-lg border-t border-background-light dark:border-[#3d2c2f] pb-6 pt-2 px-6 z-50 max-w-[500px] mx-auto">
        <div className="flex justify-between items-center">
          <button onClick={onHome} className="flex flex-col items-center gap-1 text-[#87646a] dark:text-[#a38a8e] w-16 hover:text-primary transition-colors">
            <span className="material-symbols-outlined">home</span>
            <span className="text-[10px] font-medium">Inicio</span>
          </button>
          <button onClick={onShop} className="flex flex-col items-center gap-1 text-[#87646a] dark:text-[#a38a8e] w-16 hover:text-primary transition-colors">
            <span className="material-symbols-outlined">grid_view</span>
            <span className="text-[10px] font-medium">Tienda</span>
          </button>
          <button onClick={onCustom} className="flex flex-col items-center gap-1 text-[#87646a] dark:text-[#a38a8e] w-16 hover:text-primary transition-colors">
            <span className="material-symbols-outlined">auto_fix_high</span>
            <span className="text-[10px] font-medium">Custom</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-primary w-16">
            <span className="material-symbols-outlined filled">person</span>
            <span className="text-[10px] font-bold">Perfil</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;