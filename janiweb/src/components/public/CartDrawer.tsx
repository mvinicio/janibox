import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Plus, Minus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const CartDrawer = () => {
    const {
        cart,
        isCartOpen,
        setIsCartOpen,
        updateQuantity,
        removeFromCart,
        cartTotal,
        itemsCount
    } = useCart();
    const navigate = useNavigate();

    const handleCheckout = () => {
        setIsCartOpen(false);
        navigate('/checkout');
    };

    return (
        <AnimatePresence>
            {isCartOpen && (
                <div className="fixed inset-0 z-[110] overflow-hidden">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsCartOpen(false)}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    />

                    <div className="fixed inset-y-0 right-0 max-w-full flex">
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="w-screen max-w-md bg-white shadow-2xl flex flex-col"
                        >
                            {/* Header */}
                            <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-white sticky top-0 z-10">
                                <div className="flex items-center gap-4">
                                    <ShoppingBag className="text-primary" size={24} />
                                    <div>
                                        <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Tu Carrito</h2>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{itemsCount} Artículos</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsCartOpen(false)}
                                    className="p-3 hover:bg-gray-50 rounded-full transition-colors"
                                >
                                    <X size={24} className="text-gray-400" />
                                </button>
                            </div>

                            {/* Cart Items */}
                            <div className="flex-grow overflow-y-auto p-8 space-y-8">
                                {cart.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
                                            <ShoppingBag size={32} className="text-gray-300" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900 mb-2">Tu carrito está vacío</h3>
                                            <p className="text-gray-400 text-sm max-w-[200px] mx-auto">
                                                ¡Parece que aún no has añadido nada especial!
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => setIsCartOpen(false)}
                                            className="text-primary font-bold text-sm border-b-2 border-primary pb-1"
                                        >
                                            Explorar catálogo
                                        </button>
                                    </div>
                                ) : (
                                    cart.map((item) => (
                                        <div key={item.id} className="flex gap-6 group">
                                            <div className="w-24 h-24 bg-gray-50 rounded-2xl overflow-hidden shadow-sm">
                                                <img
                                                    src={item.image_url}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                                />
                                            </div>
                                            <div className="flex-grow flex flex-col justify-between py-1">
                                                <div>
                                                    <div className="flex justify-between gap-4">
                                                        <h4 className="font-bold text-gray-900 tracking-tight leading-tight">{item.name}</h4>
                                                        <button
                                                            onClick={() => removeFromCart(item.id)}
                                                            className="text-gray-300 hover:text-red-500 transition-colors"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                    <p className="text-primary font-serif italic mt-1 text-lg">
                                                        ${item.price.toFixed(2)}
                                                    </p>
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center gap-2 border border-gray-100 rounded-lg p-1">
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                            className="p-1 hover:text-primary transition-colors text-gray-400"
                                                        >
                                                            <Minus size={14} />
                                                        </button>
                                                        <span className="w-6 text-center text-xs font-bold">{item.quantity}</span>
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                            className="p-1 hover:text-primary transition-colors text-gray-400"
                                                        >
                                                            <Plus size={14} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Footer */}
                            {cart.length > 0 && (
                                <div className="p-8 bg-gray-50 border-t border-gray-100 space-y-6">
                                    <div className="flex justify-between items-end">
                                        <span className="text-gray-400 uppercase text-[10px] font-bold tracking-widest">Subtotal Estimado</span>
                                        <span className="text-3xl font-serif italic text-gray-900">${cartTotal.toFixed(2)}</span>
                                    </div>
                                    <button
                                        onClick={handleCheckout}
                                        className="w-full bg-primary text-white py-4 rounded-2xl font-black uppercase tracking-[0.1em] text-sm shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                                    >
                                        Finalizar Compra
                                    </button>
                                    <p className="text-center text-[10px] text-gray-400 font-medium">
                                        Envío calculado en el siguiente paso.
                                    </p>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default CartDrawer;
