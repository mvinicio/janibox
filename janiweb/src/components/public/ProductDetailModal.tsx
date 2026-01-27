import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Info, Clock, ShieldCheck } from 'lucide-react';
import { useCart } from '../../context/CartContext';

interface ProductDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: any;
}

const ProductDetailModal = ({ isOpen, onClose, product }: ProductDetailModalProps) => {
    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useCart();

    if (!product) return null;

    const handleIncrement = () => setQuantity(prev => prev + 1);
    const handleDecrement = () => setQuantity(prev => prev > 1 ? prev - 1 : 1);

    const handleAddToCart = () => {
        addToCart(product, quantity);
        onClose();
        setTimeout(() => setQuantity(1), 300); // Reset quantity after animation
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-md"
                    ></motion.div>

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-5xl bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 z-10 p-2 bg-white/80 backdrop-blur rounded-full hover:bg-white transition-colors shadow-sm"
                        >
                            <X size={24} className="text-gray-900" />
                        </button>

                        {/* Image Section */}
                        <div className="md:w-1/2 bg-[#F9F9F9] relative group overflow-hidden">
                            <img
                                src={product.image_url}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                            />
                        </div>

                        {/* Info Section */}
                        <div className="md:w-1/2 p-8 md:p-12 overflow-y-auto flex flex-col">
                            <div className="mb-8">
                                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary mb-2 block">
                                    {product.categories?.name || 'Colección'}
                                </span>
                                <h2 className="text-3xl md:text-4xl font-extralight tracking-[0.1em] uppercase text-gray-900 mb-4">
                                    {product.name}
                                </h2>
                                <p className="text-2xl font-serif italic text-gray-500 mb-6 font-light">
                                    ${product.price.toFixed(2)}
                                </p>
                                <div className="w-12 h-px bg-gray-200 mb-8"></div>

                                {product.description && (
                                    <p className="text-gray-600 leading-relaxed mb-8">
                                        {product.description}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-8 flex-grow">
                                {/* Contenido */}
                                {product.content && (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 text-gray-900">
                                            <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center text-primary">
                                                <Info size={16} />
                                            </div>
                                            <h3 className="text-[11px] font-black tracking-[0.1em] uppercase">Contenido del Producto</h3>
                                        </div>
                                        <div className="text-gray-600 text-sm pl-10 whitespace-pre-line leading-relaxed">
                                            {product.content}
                                        </div>
                                    </div>
                                )}

                                {/* Tiempo de Entrega */}
                                {product.delivery_time && (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 text-gray-900">
                                            <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center text-primary">
                                                <Clock size={16} />
                                            </div>
                                            <h3 className="text-[11px] font-black tracking-[0.1em] uppercase">Tiempo de Entrega</h3>
                                        </div>
                                        <div className="text-gray-600 text-sm pl-10 whitespace-pre-line leading-relaxed">
                                            {product.delivery_time}
                                        </div>
                                    </div>
                                )}

                                {/* Políticas */}
                                {product.policies && (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 text-gray-900">
                                            <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center text-primary">
                                                <ShieldCheck size={16} />
                                            </div>
                                            <h3 className="text-[11px] font-black tracking-[0.1em] uppercase">Políticas de Empresa</h3>
                                        </div>
                                        <div className="text-gray-600 text-[13px] pl-10 whitespace-pre-line leading-relaxed opacity-80 italic">
                                            {product.policies}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Action Area */}
                            <div className="mt-12 pt-8 border-t border-gray-100 flex gap-4">
                                <div className="flex items-center border border-gray-200 rounded-full px-4 py-2">
                                    <button
                                        onClick={handleDecrement}
                                        className="text-gray-400 hover:text-gray-900 px-2 transition-colors text-xl font-light"
                                    >
                                        −
                                    </button>
                                    <span className="w-8 text-center font-bold select-none">{quantity}</span>
                                    <button
                                        onClick={handleIncrement}
                                        className="text-gray-400 hover:text-gray-900 px-2 transition-colors text-xl font-light"
                                    >
                                        +
                                    </button>
                                </div>
                                <button
                                    onClick={handleAddToCart}
                                    className="flex-grow bg-primary text-white px-8 py-4 rounded-full font-bold tracking-tight hover:bg-opacity-90 transition-all flex items-center justify-center gap-3 shadow-lg shadow-primary/20"
                                >
                                    <ShoppingCart size={20} />
                                    Añadir al Carrito
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ProductDetailModal;
