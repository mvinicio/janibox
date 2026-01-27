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
                {[
                    { title: 'Arreglos de Autor', img: 'https://images.unsplash.com/photo-1575224300306-1b8da36134b4?auto=format&fit=crop&q=80&w=800' },
                    { title: 'Ramos de Chocolate', img: 'https://images.unsplash.com/photo-1548231580-062e718b5327?auto=format&fit=crop&q=80&w=800' },
                    { title: 'Eventos Gala', img: 'https://images.unsplash.com/photo-1511910849309-0dffb8c83742?auto=format&fit=crop&q=80&w=800' }
                ].map((item, idx) => (
                    <div key={idx} className="relative aspect-square group overflow-hidden cursor-pointer">
                        <img
                            src={item.img}
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
                ))}
            </section>

            {/* Category Filter Catalog */}
            <section id="catalogo" className="py-24 max-w-[1440px] mx-auto px-6 lg:px-12 bg-[#FBFBFB]">
                <div className="text-center mb-16">
                    <h2 className="text-spaced text-gray-400 mb-4">Nuestra Selección</h2>
                    <h3 className="text-4xl font-extralight tracking-[0.2em] uppercase mb-4">Todo el Catálogo</h3>
                    <Link to="/quiz" className="text-primary text-xs font-black uppercase tracking-[0.2em] border-b border-primary/20 hover:border-primary pb-1 transition-all">
                        ¿No sabes qué elegir? Haz nuestro test ✨
                    </Link>
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
