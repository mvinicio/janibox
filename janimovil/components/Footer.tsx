import React from 'react';

interface FooterProps {
  onHomeClick?: () => void;
  onProfileClick?: () => void;
  onShopClick?: () => void;
  onCustomClick?: () => void;
  activeTab?: 'home' | 'shop' | 'custom' | 'profile';
}

const Footer: React.FC<FooterProps> = ({ 
  onHomeClick, 
  onProfileClick, 
  onShopClick,
  onCustomClick,
  activeTab = 'home'
}) => {
  return (
    <>
      {activeTab === 'home' && (
        <div className="px-6 py-8 flex flex-col items-center text-center gap-4 bg-white dark:bg-background-dark border-t border-gray-100 dark:border-gray-800">
          <div className="flex gap-4">
            <button className="p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-full transition-colors">
              <span className="material-symbols-outlined text-gray-400">social_leaderboard</span>
            </button>
            <button className="p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-full transition-colors">
              <span className="material-symbols-outlined text-gray-400">photo_camera</span>
            </button>
            <button className="p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-full transition-colors">
              <span className="material-symbols-outlined text-gray-400">alternate_email</span>
            </button>
          </div>
          <p className="text-[11px] text-gray-400 leading-relaxed uppercase tracking-widest font-medium">
            Hecho a mano con Amor desde 2024<br />Janibox Inc.
          </p>
        </div>
      )}
      
      {/* Spacer for Bottom Nav */}
      <div className="h-24"></div>

      {/* IOS Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around bg-white/80 dark:bg-background-dark/80 backdrop-blur-lg border-t border-gray-100 dark:border-gray-800 pb-8 pt-3 px-2 max-w-[500px] mx-auto w-full">
        <button 
          onClick={onHomeClick}
          className={`flex flex-col items-center gap-1 w-16 transition-colors ${activeTab === 'home' ? 'text-primary' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
        >
          <span className={`material-symbols-outlined ${activeTab === 'home' ? 'filled' : ''}`}>home</span>
          <span className={`text-[10px] ${activeTab === 'home' ? 'font-bold' : 'font-medium'}`}>Inicio</span>
        </button>
        <button 
          onClick={onShopClick}
          className={`flex flex-col items-center gap-1 w-16 transition-colors ${activeTab === 'shop' ? 'text-primary' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
        >
          <span className={`material-symbols-outlined ${activeTab === 'shop' ? 'filled' : ''}`}>grid_view</span>
          <span className={`text-[10px] ${activeTab === 'shop' ? 'font-bold' : 'font-medium'}`}>Tienda</span>
        </button>
        <button 
          onClick={onCustomClick}
          className={`flex flex-col items-center gap-1 w-16 transition-colors ${activeTab === 'custom' ? 'text-primary' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
        >
          <span className={`material-symbols-outlined ${activeTab === 'custom' ? 'filled' : ''}`}>auto_fix_high</span>
          <span className={`text-[10px] ${activeTab === 'custom' ? 'font-bold' : 'font-medium'}`}>Custom</span>
        </button>
        <button 
          onClick={onProfileClick}
          className={`flex flex-col items-center gap-1 w-16 transition-colors ${activeTab === 'profile' ? 'text-primary' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
        >
          <span className={`material-symbols-outlined ${activeTab === 'profile' ? 'filled' : ''}`}>person</span>
          <span className={`text-[10px] ${activeTab === 'profile' ? 'font-bold' : 'font-medium'}`}>Perfil</span>
        </button>
      </div>
    </>
  );
};

export default Footer;