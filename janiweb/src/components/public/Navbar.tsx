import { useState, useEffect } from 'react';
import { ShoppingBag, Search, User, Menu, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { JaniboxLogo } from '../shared/Logos';
import { useCart } from '../../context/CartContext';
import { supabase } from '../../lib/supabaseClient';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { itemsCount, setIsCartOpen } = useCart();
    const [user, setUser] = useState<any>(null);
    const navigate = useNavigate();

    // Search State
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
            setIsSearchOpen(false);
            setSearchQuery('');
            // Scroll to catalog
            setTimeout(() => {
                document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);

        // Check current session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => {
            window.removeEventListener('scroll', handleScroll);
            subscription.unsubscribe();
        };
    }, []);

    const getAvatarUrl = () => {
        if (user?.user_metadata?.avatar_url) return user.user_metadata.avatar_url;
        const name = user?.user_metadata?.full_name || '';
        const isFemale = name.toLowerCase().endsWith('a') || name.toLowerCase().includes('maria');
        return `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}&gender=${isFemale ? 'female' : 'male'}&backgroundColor=F4F4F4`;
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        navigate('/');
    };

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
                            <Link to="/search" className="text-spaced text-gray-800 hover:text-primary transition-colors border-b border-transparent hover:border-primary pb-1">Productos</Link>
                            <Link to="/search?sort=best_seller" className="text-spaced text-gray-800 hover:text-primary transition-colors border-b border-transparent hover:border-primary pb-1">Más Vendidos</Link>
                            <Link to="/nosotros" className="text-spaced text-gray-800 hover:text-primary transition-colors border-b border-transparent hover:border-primary pb-1">Nosotros</Link>
                        </div>

                        {/* Icons */}
                        <div className="flex-1 flex justify-end items-center gap-6 text-gray-800">

                            {/* Search Input */}
                            <div className="relative hidden sm:block">
                                <form
                                    onSubmit={handleSearch}
                                    className={`flex items-center transition-all duration-300 ${isSearchOpen ? 'w-48 border-b border-primary' : 'w-8 border-transparent'}`}
                                >
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (isSearchOpen && searchQuery) handleSearch({ preventDefault: () => { } } as any);
                                            else setIsSearchOpen(!isSearchOpen);
                                        }}
                                        className="hover:text-primary transition-colors"
                                    >
                                        <Search size={20} strokeWidth={1.5} />
                                    </button>
                                    <input
                                        type="text"
                                        placeholder="Buscar..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className={`bg-transparent outline-none text-xs ml-2 w-full ${isSearchOpen ? 'visible opacity-100' : 'invisible opacity-0 w-0'}`}
                                        autoFocus={isSearchOpen}
                                    />
                                    {isSearchOpen && searchQuery && (
                                        <button
                                            type="submit"
                                            className="text-primary hover:text-pink-600 transition-colors ml-1"
                                        >
                                            <ChevronRight size={16} />
                                        </button>
                                    )}
                                </form>
                            </div>

                            {user ? (
                                <div className="relative group">
                                    <button className="flex items-center gap-2 hover:text-primary transition-colors">
                                        <div className="w-8 h-8 rounded-full border border-gray-100 overflow-hidden bg-gray-50 flex items-center justify-center">
                                            <img
                                                src={getAvatarUrl()}
                                                className="w-full h-full object-cover"
                                                alt="Avatar"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${user?.user_metadata?.full_name || 'User'}&background=CC6677&color=fff`;
                                                }}
                                            />
                                        </div>
                                        <span className="text-[10px] font-bold uppercase tracking-widest hidden xl:inline">
                                            {user.user_metadata?.full_name?.split(' ')[0] || 'Mi Cuenta'}
                                        </span>
                                    </button>

                                    <div className="absolute right-0 top-full mt-2 w-48 bg-white shadow-xl rounded-2xl border border-gray-100 py-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                                        <Link to="/profile" className="block px-6 py-2 text-xs font-bold text-gray-700 hover:text-primary hover:bg-gray-50 uppercase tracking-widest">
                                            Mi Perfil
                                        </Link>
                                        <Link to="/profile#compras" className="block px-6 py-2 text-xs font-bold text-gray-700 hover:text-primary hover:bg-gray-50 uppercase tracking-widest">
                                            Mis Compras
                                        </Link>
                                        <div className="h-px bg-gray-50 my-2 mx-4"></div>
                                        <button
                                            onClick={handleSignOut}
                                            className="w-full text-left px-6 py-2 text-xs font-bold text-red-500 hover:bg-red-50 uppercase tracking-widest"
                                        >
                                            Cerrar Sesión
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <Link to="/login" className="hover:text-primary transition-colors flex items-center gap-2">
                                    <User size={20} strokeWidth={1.5} />
                                    <span className="text-[10px] font-bold uppercase tracking-widest hidden xl:inline">Ingresar</span>
                                </Link>
                            )}
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
                            <Link to="/search" className="text-xl font-light tracking-[0.25em] uppercase border-b border-gray-100 pb-4">Productos</Link>
                            <Link to="/nosotros" className="text-xl font-light tracking-[0.25em] uppercase border-b border-gray-100 pb-4">Nosotros</Link>
                            <a href="/admin/login" className="text-spaced text-primary mt-8">Panel Admin</a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Navbar;
