import { useState } from 'react';
import Navbar from '../../components/public/Navbar';
import Hero from '../../components/public/Hero';
import ProductCard from '../../components/public/ProductCard';
import { useSupabaseData } from '../../hooks/useSupabaseData';
import { motion } from 'framer-motion';
import { JaniboxLogo } from '../../components/shared/Logos';
import ProductDetailModal from '../../components/public/ProductDetailModal';
import CartDrawer from '../../components/public/CartDrawer';
import ChatWidget from '../../components/public/ChatWidget';
import { Link } from 'react-router-dom';
import { Sparkles, ChevronRight } from 'lucide-react';

const Home = () => {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);

    const { data: products, loading: productsLoading } = useSupabaseData('products', {
        select: '*, categories(name)',
        order: { column: 'created_at', ascending: false }
    });

    const { data: categories } = useSupabaseData('categories', {
        filters: [{ column: 'type', operator: 'eq', value: 'product' }]
    });

    const bestSellers = products.filter(p => p.is_best_seller).slice(0, 4);

    const { data: homeSections, loading: sectionsLoading } = useSupabaseData('home_sections', {
        order: { column: 'order_index', ascending: true }
    });

    const handleProductClick = (product: any) => {
        setSelectedProduct(product);
        setIsDetailOpen(true);
    };

    return (
        <div className="bg-white min-h-screen font-inter overflow-x-hidden">
            <Navbar />
            <Hero />

            {/* Intro Text */}
            <section className="py-24 max-w-2xl mx-auto px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <p className="text-spaced text-primary mb-6">Colección Destacada</p>
                    <h2 className="text-3xl md:text-5xl font-extralight tracking-[0.2em] uppercase text-gray-900 mb-8">
                        Regalos de San Valentín
                    </h2>
                    <div className="w-12 h-px bg-gray-300 mx-auto mb-8"></div>
                </motion.div>
            </section>

            {/* Products Grid */}
            <section className="pb-24 max-w-[1440px] mx-auto px-6 lg:px-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
                    {productsLoading ? (
                        [...Array(4)].map((_, i) => (
                            <div key={i} className="aspect-square bg-gray-50 animate-pulse" />
                        ))
                    ) : (
                        bestSellers.map(product => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                onClick={handleProductClick}
                            />
                        ))
                    )}
                </div>

                <div className="mt-20 text-center">
                    <button className="border-b-2 border-primary pb-2 text-spaced hover:text-primary transition-colors">
                        Explorar Toda la Colección
                    </button>
                </div>
            </section>

            {/* Lifestyle Sections */}
            <section className="grid md:grid-cols-3 gap-1">
                {sectionsLoading ? (
                    [...Array(3)].map((_, i) => (
                        <div key={i} className="aspect-square bg-gray-50 animate-pulse" />
                    ))
                ) : (
                    homeSections.map((item: any, idx: number) => (
                        <div key={idx} className="relative aspect-square group overflow-hidden cursor-pointer">
                            <img
                                src={item.image_url}
                                alt={item.title}
                                className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000"
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex flex-col items-center justify-end pb-16 px-8 text-center">
                                <h3 className="text-white text-xl tracking-[0.2em] uppercase mb-8 leading-tight">
                                    {item.title}
                                </h3>
                                <button className="btn-minimal !bg-transparent border border-white/50 hover:border-white opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all">
                                    Ver Productos
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </section>

            {/* Category Filter Catalog */}
            <section id="catalogo" className="py-24 max-w-[1440px] mx-auto px-6 lg:px-12 bg-[#FBFBFB]">
                <div className="text-center mb-16">
                    <h2 className="text-spaced text-gray-400 mb-4">Nuestra Selección</h2>
                    <h3 className="text-4xl font-extralight tracking-[0.2em] uppercase mb-12">Todo el Catálogo</h3>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-block"
                    >
                        <Link to="/quiz" className="group relative block">
                            <motion.div
                                className="absolute -inset-4 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity"
                                animate={{
                                    scale: [1, 1.05, 1],
                                }}
                                transition={{
                                    duration: 4,
                                    repeat: Infinity,
                                }}
                            />
                            <div className="relative flex flex-col items-center gap-4 bg-white/50 backdrop-blur-sm border border-primary/10 px-12 py-8 rounded-[2.5rem] shadow-sm group-hover:shadow-xl group-hover:border-primary/20 transition-all duration-500">
                                <div className="flex items-center gap-3 text-primary">
                                    <span className="w-8 h-px bg-primary/30"></span>
                                    <Sparkles size={20} className="animate-pulse" />
                                    <span className="w-8 h-px bg-primary/30"></span>
                                </div>
                                <span className="text-primary text-sm font-black uppercase tracking-[0.3em] group-hover:scale-110 transition-transform duration-500">
                                    ¿No sabes qué elegir?
                                </span>
                                <span className="text-gray-400 text-xs font-light tracking-[0.2em] uppercase">
                                    Resuelve nuestro test exclusivo
                                </span>
                                <div className="mt-2 flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-widest border-b border-primary/20 group-hover:border-primary pb-1 transition-all">
                                    Comenzar ahora
                                    <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                </div>

                <div className="flex flex-wrap justify-center gap-12 mb-20">
                    <button
                        onClick={() => setSelectedCategory('all')}
                        className={`text-spaced border-b-2 transition-all ${selectedCategory === 'all' ? 'border-primary text-gray-900' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                    >
                        Todos
                    </button>
                    {categories.map((cat: any) => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`text-spaced border-b-2 transition-all ${selectedCategory === cat.id ? 'border-primary text-gray-900' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
                    {productsLoading ? (
                        [...Array(8)].map((_, i) => (
                            <div key={i} className="aspect-square bg-white animate-pulse" />
                        ))
                    ) : (
                        products
                            .filter(p => selectedCategory === 'all' || p.category_id === selectedCategory)
                            .map(product => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    onClick={handleProductClick}
                                />
                            ))
                    )}
                </div>
            </section>

            {/* Product Detail Modal */}
            <ProductDetailModal
                isOpen={isDetailOpen}
                onClose={() => setIsDetailOpen(false)}
                product={selectedProduct}
            />

            {/* Shopping Cart Drawer */}
            <CartDrawer />

            {/* Chat Widget */}
            <ChatWidget />

            {/* Simple Footer */}
            <footer className="bg-white border-t border-gray-100 py-24">
                <div className="max-w-7xl mx-auto px-6 text-center text-gray-800 flex flex-col items-center">
                    <JaniboxLogo className="w-12 h-12 text-primary mb-4" />
                    <div className="text-2xl font-light tracking-[0.4em] uppercase mb-12">
                        JANI<span className="font-semibold text-primary">BOX</span>
                    </div>
                    <div className="flex justify-center gap-12 mb-16 text-spaced text-gray-400">
                        <a href="#" className="hover:text-primary transition-colors">Instagram</a>
                        <a href="#" className="hover:text-primary transition-colors">Facebook</a>
                        <a href="#" className="hover:text-primary transition-colors">Pinterest</a>
                    </div>
                    <p className="text-gray-300 text-[10px] tracking-widest uppercase mb-4">
                        © 2026 Janibox. Celebra cada momento.
                    </p>
                    <a href="/admin/login" className="text-gray-200 hover:text-primary transition-colors text-[9px] uppercase tracking-widest">
                        Acceso Administrativo
                    </a>
                </div>
            </footer>
        </div>
    );
};

export default Home;
