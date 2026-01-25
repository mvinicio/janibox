import React, { useState } from 'react';

interface CheckoutProps {
  onBack: () => void;
  onPay: () => void;
}

const Checkout: React.FC<CheckoutProps> = ({ onBack, onPay }) => {
  const [selectedMethod, setSelectedMethod] = useState('credit_card');
  const [discountCode, setDiscountCode] = useState('');
  
  // Cart State
  const [isEditMode, setIsEditMode] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const basePrice = 45.00;
  const deliveryFee = 5.00;
  const discountAmount = 4.50; // Fixed for SWEET10 logic

  // Calculations
  const subtotal = basePrice * quantity;
  const total = quantity > 0 ? subtotal + deliveryFee - discountAmount : 0;

  const handleDelete = () => {
    if (window.confirm("¿Deseas eliminar este producto del carrito?")) {
        setQuantity(0);
        setIsEditMode(false);
        // In a real app, this would remove item from state. 
        // For this flow, we go back since cart is empty.
        setTimeout(onBack, 300); 
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-white dark:bg-background-dark animate-in fade-in slide-in-from-right-10 duration-300 font-display">
      {/* TopAppBar */}
      <div className="sticky top-0 z-10 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md px-4 py-4 flex items-center justify-between border-b border-gray-100 dark:border-white/5">
        <button 
          onClick={onBack}
          className="text-[#171112] dark:text-white flex size-10 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-white/10 cursor-pointer transition-colors"
        >
          <span className="material-symbols-outlined">arrow_back_ios_new</span>
        </button>
        <h2 className="text-[#171112] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-10">
          Checkout
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto pb-40">
        {/* Section: Order Summary Header */}
        <div className="flex items-center justify-between px-4 pt-6 pb-2">
          <h3 className="text-[#171112] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">Your Order</h3>
          <button 
            onClick={() => setIsEditMode(true)}
            className="text-primary text-sm font-semibold hover:underline"
          >
            Edit Cart
          </button>
        </div>

        {/* ListItem: Bouquet Details */}
        {quantity > 0 ? (
            <div className="flex items-center gap-4 bg-white dark:bg-background-dark px-4 py-4 justify-between border-b border-gray-50 dark:border-white/5">
            <div className="flex items-center gap-4">
                <div 
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-xl size-20 shadow-sm relative" 
                style={{ backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuCpJZqMIh0p9UEJsLjJPvgyjNKA0cQ8DHQG_ba6els2VZqug38r1P09NVxKNS2-1UJiYVdIYH4-rjb4rY7uwDiBWzvoUMBf9pBb1rT97-TGcRgWb-R9EXD2ifT3eeZRcgEBMiwX_mZGFryligCDqa435dmo8VOomeFCDplwXlWReWxH8-wl24M1i5Tp2zHrbRwqJFE79QsHdVRE_Li48LS1gJMsS3Z0lWCVQF2tjI6FYKn9_5SZP6iKPFYyM4YZrlhUXC1FQItlYg")` }}
                >
                {quantity > 1 && (
                    <div className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-bold size-5 flex items-center justify-center rounded-full shadow-sm">
                        {quantity}
                    </div>
                )}
                </div>
                <div className="flex flex-col justify-center">
                <p className="text-[#171112] dark:text-white text-base font-bold leading-normal line-clamp-1">Sunshine Candy Bouquet</p>
                <p className="text-[#87646a] dark:text-gray-400 text-sm font-normal leading-normal mt-1 flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">calendar_today</span>
                    Friday, Oct 25th
                </p>
                <p className="text-[#87646a] dark:text-gray-400 text-xs font-normal leading-normal mt-0.5">Custom Ribbon: Yellow</p>
                </div>
            </div>
            <div className="shrink-0 text-right">
                <p className="text-[#171112] dark:text-white text-base font-bold leading-normal">${subtotal.toFixed(2)}</p>
            </div>
            </div>
        ) : (
            <div className="p-8 text-center text-gray-400">
                Tu carrito está vacío.
            </div>
        )}

        {/* Promotions Section */}
        <div className="px-4 pt-6">
            <h3 className="text-[#171112] dark:text-white text-sm font-bold uppercase tracking-wider mb-3">Promotions</h3>
            <div className="flex flex-col gap-3">
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <input 
                            value={discountCode}
                            onChange={(e) => setDiscountCode(e.target.value)}
                            className="w-full bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-primary focus:border-primary dark:text-white outline-none border transition-colors placeholder-gray-400" 
                            placeholder="Discount code" 
                            type="text"
                        />
                    </div>
                    <button className="bg-[#171112] dark:bg-white dark:text-[#171112] text-white px-6 py-3 rounded-xl text-sm font-bold active:scale-95 transition-transform hover:opacity-90">Apply</button>
                </div>
                <button className="flex items-center justify-center gap-2 w-full py-3 px-4 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-xl text-[#87646a] dark:text-gray-400 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                    <span className="material-symbols-outlined text-lg">card_giftcard</span>
                    Use Gift Card
                </button>
            </div>
        </div>

        {/* Cost Summary */}
        <div className="p-4 mt-2">
          <div className="bg-background-light dark:bg-white/5 rounded-2xl p-4 space-y-3">
            <div className="flex justify-between gap-x-6">
              <p className="text-[#87646a] dark:text-gray-400 text-sm font-normal leading-normal">Subtotal</p>
              <p className="text-[#171112] dark:text-white text-sm font-medium leading-normal text-right">${subtotal.toFixed(2)}</p>
            </div>
            <div className="flex justify-between gap-x-6">
              <p className="text-[#87646a] dark:text-gray-400 text-sm font-normal leading-normal">Delivery Fee</p>
              <p className="text-[#171112] dark:text-white text-sm font-medium leading-normal text-right">${deliveryFee.toFixed(2)}</p>
            </div>
            {/* Applied Discount */}
            <div className="space-y-2 pt-1">
                <div className="flex justify-between items-center gap-x-6 bg-primary/10 dark:bg-primary/20 px-3 py-2 rounded-lg border border-primary/20">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-lg">local_offer</span>
                        <p className="text-primary text-sm font-bold uppercase tracking-tight">SWEET10</p>
                        <span className="text-[#87646a] dark:text-gray-400 text-xs">(-10%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <p className="text-primary text-sm font-bold">-${discountAmount.toFixed(2)}</p>
                        <button className="text-[#87646a] dark:text-gray-400 hover:text-primary transition-colors flex items-center justify-center"><span className="material-symbols-outlined text-sm">close</span></button>
                    </div>
                </div>
            </div>
            <div className="h-px bg-gray-200 dark:bg-white/10 my-1"></div>
            <div className="flex justify-between gap-x-6 pt-1">
              <p className="text-[#171112] dark:text-white text-base font-bold leading-normal">Total</p>
              <p className="text-primary dark:text-white text-xl font-bold leading-normal text-right">${total.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* SectionHeader: Payment Method */}
        <div className="px-4 pt-4">
          <h3 className="text-[#171112] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">Payment Method</h3>
          <p className="text-[#87646a] dark:text-gray-400 text-sm mt-1">Select your preferred payment option</p>
        </div>

        {/* RadioList: Payment Options */}
        <div className="flex flex-col gap-3 p-4">
          {/* Credit Card */}
          <div 
            onClick={() => setSelectedMethod('credit_card')}
            className={`flex items-center gap-4 rounded-xl p-[15px] cursor-pointer transition-all border-2 ${
              selectedMethod === 'credit_card' 
                ? 'border-primary bg-primary/5' 
                : 'border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5'
            }`}
          >
            <div className={`flex items-center justify-center size-5 rounded-full border-2 ${selectedMethod === 'credit_card' ? 'border-primary' : 'border-gray-300'}`}>
                {selectedMethod === 'credit_card' && <div className="size-2.5 bg-primary rounded-full" />}
            </div>
            <div className="flex grow flex-col">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#171112] dark:text-white">credit_card</span>
                <p className="text-[#171112] dark:text-white text-sm font-bold leading-normal">Credit Card</p>
              </div>
              <p className="text-[#87646a] dark:text-gray-400 text-xs font-normal leading-normal pl-8">Visa, Mastercard, AMEX</p>
            </div>
          </div>

          {/* PayPal */}
          <div 
            onClick={() => setSelectedMethod('paypal')}
            className={`flex items-center gap-4 rounded-xl p-[15px] cursor-pointer transition-all border-2 ${
              selectedMethod === 'paypal' 
                ? 'border-primary bg-primary/5' 
                : 'border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5'
            }`}
          >
             <div className={`flex items-center justify-center size-5 rounded-full border-2 ${selectedMethod === 'paypal' ? 'border-primary' : 'border-gray-300'}`}>
                {selectedMethod === 'paypal' && <div className="size-2.5 bg-primary rounded-full" />}
            </div>
            <div className="flex grow flex-col">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#171112] dark:text-white">account_balance_wallet</span>
                <p className="text-[#171112] dark:text-white text-sm font-medium leading-normal">PayPal</p>
              </div>
              <p className="text-[#87646a] dark:text-gray-400 text-xs font-normal leading-normal pl-8">Fast and secure checkout</p>
            </div>
          </div>

          {/* Bank Transfer */}
          <div 
            onClick={() => setSelectedMethod('bank')}
            className={`flex items-center gap-4 rounded-xl p-[15px] cursor-pointer transition-all border-2 ${
              selectedMethod === 'bank' 
                ? 'border-primary bg-primary/5' 
                : 'border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5'
            }`}
          >
             <div className={`flex items-center justify-center size-5 rounded-full border-2 ${selectedMethod === 'bank' ? 'border-primary' : 'border-gray-300'}`}>
                {selectedMethod === 'bank' && <div className="size-2.5 bg-primary rounded-full" />}
            </div>
            <div className="flex grow flex-col">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#171112] dark:text-white">account_balance</span>
                <p className="text-[#171112] dark:text-white text-sm font-medium leading-normal">Bank Transfer</p>
              </div>
              <p className="text-[#87646a] dark:text-gray-400 text-xs font-normal leading-normal pl-8">Direct wire from your bank</p>
            </div>
          </div>
        </div>

        {/* Trust Badge */}
        <div className="flex items-center justify-center gap-2 px-4 py-4 text-[#87646a] dark:text-gray-400 opacity-80">
          <span className="material-symbols-outlined text-base">lock</span>
          <p className="text-xs font-medium uppercase tracking-wider">Secure 256-bit SSL encrypted payment</p>
        </div>
      </div>

      {/* Bottom Fixed Action Button */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[500px] mx-auto bg-white/90 dark:bg-background-dark/90 backdrop-blur-lg p-4 pb-8 border-t border-gray-100 dark:border-white/5 z-50">
        <button 
          onClick={onPay}
          disabled={quantity === 0}
          className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/25 transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>Pay ${total.toFixed(2)}</span>
          <span className="material-symbols-outlined">chevron_right</span>
        </button>
        <p className="text-center text-[10px] text-[#87646a] dark:text-gray-500 mt-3">
          By clicking "Pay Now", you agree to our Terms and Conditions
        </p>
      </div>

      {/* Edit Cart Modal / Bottom Sheet */}
      {isEditMode && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center p-0 sm:p-4 animate-in fade-in duration-200">
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsEditMode(false)}
          ></div>
          <div className="relative w-full max-w-[500px] bg-white dark:bg-[#1a0e10] rounded-t-3xl sm:rounded-3xl shadow-2xl animate-in slide-in-from-bottom-full duration-300 overflow-hidden">
             <div className="flex justify-between items-center px-6 pt-6 pb-2">
                <h3 className="text-xl font-bold text-[#171112] dark:text-white tracking-tight">Edit Cart</h3>
                <button 
                    onClick={() => setIsEditMode(false)}
                    className="p-2 bg-gray-100 dark:bg-white/10 rounded-full hover:bg-gray-200 dark:hover:bg-white/20 transition-colors"
                >
                    <span className="material-symbols-outlined text-gray-500 dark:text-gray-300 text-xl">close</span>
                </button>
             </div>
             
             <div className="p-4">
                {/* Item Card Container - Matching Design */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-zinc-800/50">
                    <div className="flex items-center gap-4">
                        <div 
                          className="size-16 rounded-xl bg-cover bg-center shadow-sm"
                          style={{ backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuCpJZqMIh0p9UEJsLjJPvgyjNKA0cQ8DHQG_ba6els2VZqug38r1P09NVxKNS2-1UJiYVdIYH4-rjb4rY7uwDiBWzvoUMBf9pBb1rT97-TGcRgWb-R9EXD2ifT3eeZRcgEBMiwX_mZGFryligCDqa435dmo8VOomeFCDplwXlWReWxH8-wl24M1i5Tp2zHrbRwqJFE79QsHdVRE_Li48LS1gJMsS3Z0lWCVQF2tjI6FYKn9_5SZP6iKPFYyM4YZrlhUXC1FQItlYg")` }}
                        ></div>
                        <div className="flex flex-col gap-1">
                            <p className="text-sm font-bold text-[#171112] dark:text-white leading-tight">Sunshine Bouquet</p>
                            <p className="text-primary font-bold text-base leading-tight">${basePrice.toFixed(2)}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                         {/* Pill Shaped Counter */}
                         <div className="flex items-center bg-white dark:bg-black rounded-full border border-gray-200 dark:border-gray-700 h-10 shadow-sm px-1">
                             <button 
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="size-8 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800 rounded-full text-gray-600 dark:text-gray-300 transition-colors"
                             >
                                <span className="material-symbols-outlined text-sm">remove</span>
                             </button>
                             <span className="w-6 text-center text-sm font-bold text-[#171112] dark:text-white">{quantity}</span>
                             <button 
                                onClick={() => setQuantity(quantity + 1)}
                                className="size-8 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800 rounded-full text-gray-600 dark:text-gray-300 transition-colors"
                             >
                                <span className="material-symbols-outlined text-sm">add</span>
                             </button>
                         </div>
                         
                         {/* Delete Button */}
                         <button 
                            onClick={handleDelete}
                            className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full"
                            title="Remove Item"
                         >
                            <span className="material-symbols-outlined text-[22px]">delete</span>
                         </button>
                    </div>
                </div>

                <div className="mt-8 mb-4">
                    <button 
                        onClick={() => setIsEditMode(false)}
                        className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 active:scale-[0.98] transition-all text-base"
                    >
                        Save Changes
                    </button>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;