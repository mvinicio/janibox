import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import BestSellers from './components/BestSellers';
import Features from './components/Features';
import Footer from './components/Footer';
import ChatWidget from './components/ChatWidget';
import Quiz from './components/Quiz';
import ProductDetail from './components/ProductDetail';
import DeliverySchedule from './components/DeliverySchedule';
import Checkout from './components/Checkout';
import BuildYourOwnBase from './components/BuildYourOwnBase';
import BuildYourOwnTreats from './components/BuildYourOwnTreats';
import BuildYourOwnDecor from './components/BuildYourOwnDecor';
import OrderConfirmation from './components/OrderConfirmation';
import OrderTracking from './components/OrderTracking';
import Profile from './components/Profile';
import HygieneSafety from './components/HygieneSafety';
import GiftCards from './components/GiftCards';
import Shop from './components/Shop';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<'home' | 'quiz' | 'product' | 'delivery' | 'checkout' | 'build-base' | 'build-treats' | 'build-decor' | 'confirmation' | 'tracking' | 'profile' | 'hygiene' | 'gift-cards' | 'shop'>('home');
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark group/design-root overflow-x-hidden font-display">
      {/* Main Content Container centered for larger screens */}
      <div className="mx-auto w-full max-w-[500px] bg-background-light dark:bg-background-dark min-h-screen shadow-2xl relative">
        {currentScreen === 'home' && (
          <>
            <Navbar 
              onCartClick={() => setCurrentScreen('checkout')} 
              onSearchClick={() => setCurrentScreen('shop')}
            />
            <main>
              <Hero onBuildClick={() => setCurrentScreen('build-base')} />
              <BestSellers 
                onProductClick={() => setCurrentScreen('product')} 
                onViewAllClick={() => setCurrentScreen('shop')}
              />
              <Features onStartQuiz={() => setCurrentScreen('quiz')} />
            </main>
            <Footer 
              onHomeClick={() => setCurrentScreen('home')}
              onProfileClick={() => setCurrentScreen('profile')}
              onShopClick={() => setCurrentScreen('shop')}
              onCustomClick={() => setCurrentScreen('build-base')}
              activeTab="home"
            />
            <ChatWidget isOpen={isChatOpen} onToggle={() => setIsChatOpen(!isChatOpen)} />
          </>
        )}
        
        {currentScreen === 'shop' && (
          <>
            <Shop
              onHome={() => setCurrentScreen('home')}
              onProfile={() => setCurrentScreen('profile')}
              onProductClick={() => setCurrentScreen('product')}
              onCustom={() => setCurrentScreen('build-base')}
              onCartClick={() => setCurrentScreen('checkout')}
            />
            <ChatWidget isOpen={isChatOpen} onToggle={() => setIsChatOpen(!isChatOpen)} />
          </>
        )}

        {currentScreen === 'quiz' && (
          <Quiz onBack={() => setCurrentScreen('home')} />
        )}

        {currentScreen === 'product' && (
          <ProductDetail 
            onBack={() => setCurrentScreen('home')} 
            onNext={() => setCurrentScreen('delivery')}
            onHygieneClick={() => setCurrentScreen('hygiene')}
          />
        )}

        {currentScreen === 'hygiene' && (
          <HygieneSafety 
            onBack={() => setCurrentScreen('product')}
            onChatClick={() => setIsChatOpen(true)}
          />
        )}
        
        {/* Render chat on hygiene screen too, but it needs to be over the content */}
        {currentScreen === 'hygiene' && (
          <ChatWidget isOpen={isChatOpen} onToggle={() => setIsChatOpen(!isChatOpen)} />
        )}

        {currentScreen === 'delivery' && (
          <DeliverySchedule 
            onBack={() => setCurrentScreen('product')} 
            onConfirm={() => setCurrentScreen('checkout')}
          />
        )}

        {currentScreen === 'checkout' && (
          <Checkout
            onBack={() => setCurrentScreen('delivery')}
            onPay={() => setCurrentScreen('confirmation')}
          />
        )}

        {currentScreen === 'confirmation' && (
          <OrderConfirmation
            onHome={() => setCurrentScreen('home')}
            onTrack={() => setCurrentScreen('tracking')}
          />
        )}

        {currentScreen === 'tracking' && (
          <OrderTracking
            onBack={() => setCurrentScreen('confirmation')}
          />
        )}

        {currentScreen === 'build-base' && (
          <BuildYourOwnBase 
            onBack={() => setCurrentScreen('home')}
            onNext={() => setCurrentScreen('build-treats')}
          />
        )}

        {currentScreen === 'build-treats' && (
          <BuildYourOwnTreats 
            onBack={() => setCurrentScreen('build-base')}
            onNext={() => setCurrentScreen('build-decor')}
          />
        )}

        {currentScreen === 'build-decor' && (
          <BuildYourOwnDecor
            onBack={() => setCurrentScreen('build-treats')}
            onFinish={() => setCurrentScreen('delivery')}
          />
        )}

        {currentScreen === 'profile' && (
          <Profile
            onHome={() => setCurrentScreen('home')}
            onTrackOrder={() => setCurrentScreen('tracking')}
            onRedeem={() => setCurrentScreen('gift-cards')}
            onShop={() => setCurrentScreen('shop')}
            onCustom={() => setCurrentScreen('build-base')}
          />
        )}

        {currentScreen === 'gift-cards' && (
          <GiftCards
            onBack={() => setCurrentScreen('profile')}
            onHome={() => setCurrentScreen('home')}
            onShop={() => setCurrentScreen('shop')}
            onProfile={() => setCurrentScreen('profile')}
          />
        )}
      </div>
    </div>
  );
};

export default App;