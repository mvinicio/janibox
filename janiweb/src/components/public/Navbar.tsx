import { useState, useEffect } from 'react';
import { ShoppingBag, Search, User, Menu, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { JaniboxLogo } from '../shared/Logos';
import { useCart } from '../../context/CartContext';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { itemsCount, setIsCartOpen } = useCart();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="fixed w-full z-50">
            {/* Promo Bar */}
            <div className="bg-primary text-white py-2 text-[10px] font-bold tracking-[0.2em] uppercase flex items-center justify-center gap-8">
                <ChevronLeft size={12} strokeWidth={3} className="opacity-50" />
                <span>Envío gratis en pedidos mayores a $100</span>
                <ChevronRight size={12} strokeWidth={3} className="opacity-50" />
            </div>

            <nav className={`transition-all duration-300 ${isScrolled ? 'bg-white shadow-sm py-4' : 'bg-white py-6'}`}>
                <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
                    <div className="flex justify-between items-center">
                        {/* Logo */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex-1"
                        >
                            <a href="/" className="flex items-center gap-3">
                                <JaniboxLogo className="w-10 h-10 text-primary" />
                                <span className="text-xl font-medium tracking-[0.2em] uppercase text-gray-900 hidden sm:inline">
                                    JANI<span className="text-primary">BOX</span>
                                </span>
                            </a>
                        </motion.div>

                        {/* Desktop Menu */}
                        <div className="hidden lg:flex items-center justify-center gap-10 flex-[2]">
                            {['Productos', 'Más Vendidos', 'Nosotros', 'Preguntas', 'Blog'].map((item) => (
                                <a
                                    key={item}
                                    href="#"
                                    className="text-spaced text-gray-800 hover:text-primary transition-colors border-b border-transparent hover:border-primary pb-1"
                                >
                                    {item}
                                </a>
                            ))}
                        </div>

                        {/* Icons */}
                        <div className="flex-1 flex justify-end items-center gap-6 text-gray-800">
                            <button className="hover:text-primary transition-colors hidden sm:block">
                                <Search size={20} strokeWidth={1.5} />
                            </button>
                            <a href="/admin/login" className="hover:text-primary transition-colors hidden sm:block">
                                <User size={20} strokeWidth={1.5} />
                            </a>
                            <button
                                onClick={() => setIsCartOpen(true)}
                                className="hover:text-primary transition-colors relative"
                            >
                                <ShoppingBag size={20} strokeWidth={1.5} />
                                {itemsCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-primary text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                                        {itemsCount}
                                    </span>
                                )}
                            </button>
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="lg:hidden p-1"
                            >
                                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        className="fixed inset-0 bg-white z-[60] p-8 lg:hidden"
                    >
                        <div className="flex justify-end mb-12">
                            <button onClick={() => setIsMobileMenuOpen(false)}>
                                <X size={32} strokeWidth={1} />
                            </button>
                        </div>
                        <div className="flex flex-col gap-8 text-center mt-12">
                            {['Productos', 'Más Vendidos', 'Nosotros', 'Preguntas', 'Blog'].map((item) => (
                                <a key={item} href="#" className="text-xl font-light tracking-[0.25em] uppercase border-b border-gray-100 pb-4">
                                    {item}
                                </a>
                            ))}
                            <a href="/admin/login" className="text-spaced text-primary mt-8">Panel Admin</a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Navbar;
