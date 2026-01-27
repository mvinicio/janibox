import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Check, Plus, Package, Box as BoxIcon, Gift } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { JaniboxLogo } from '../../components/shared/Logos';
import { useSupabaseData } from '../../hooks/useSupabaseData';
import { useCart } from '../../context/CartContext';

const steps = [
    { title: 'Base', icon: <Package size={20} />, description: 'Elige la caja perfecta' },
    { title: 'Dulces', icon: <BoxIcon size={20} />, description: 'Añade tus favoritos' },
    { title: 'Resumen', icon: <Gift size={20} />, description: 'Revisa tu creación' }
];

const CustomBuilder = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [selectedBase, setSelectedBase] = useState<any>(null);
    const [selectedTreats, setSelectedTreats] = useState<any[]>([]);
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const { data: bases, loading: basesLoading } = useSupabaseData('bases');
    const { data: treats, loading: treatsLoading } = useSupabaseData('treats', {
        select: '*, categories(name)'
    });

    const isStepValid = () => {
        if (currentStep === 0) return !!selectedBase;
        if (currentStep === 1) return selectedTreats.length > 0;
        return true;
    };

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            const customProduct = {
                id: `custom-${Date.now()}`,
                name: `JaniBox Personalizada (${selectedBase.name})`,
                price: totalPrice,
                image_url: selectedBase.image_url,
                details: {
                    base: selectedBase,
                    treats: selectedTreats
                }
            };
            addToCart(customProduct, 1);
            navigate('/');
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        } else {
            navigate('/');
        }
    };

    const toggleTreat = (treat: any) => {
        setSelectedTreats(prev => {
            const existing = prev.find(t => t.id === treat.id);
            if (existing) {
                return prev.filter(t => t.id !== treat.id);
            }
            return [...prev, treat];
        });
    };

    const totalPrice = (selectedBase?.price || 0) + selectedTreats.reduce((sum, t) => sum + t.price, 0);

    return (
        <div className="min-h-screen bg-[#FBFBFB] flex flex-col font-inter overflow-x-hidden">
            {/* Nav */}
            <header className="fixed top-0 inset-x-0 h-24 bg-white/80 backdrop-blur-xl border-b border-gray-100 z-[100] px-8 flex items-center justify-between">
                <button onClick={handleBack} className="text-gray-400 hover:text-primary transition-colors">
                    <ChevronLeft size={24} />
                </button>
                <div className="flex items-center gap-3">
                    <JaniboxLogo className="w-8 h-8 text-primary" />
                    <span className="text-sm font-black tracking-[0.2em] uppercase">Personalizar</span>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                        <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Total</p>
                        <p className="text-primary font-serif italic font-light text-xl">${totalPrice.toFixed(2)}</p>
                    </div>
                </div>
            </header>

            {/* Stepper */}
            <div className="mt-32 max-w-[1440px] mx-auto w-full px-8">
                <div className="flex justify-center items-center gap-4 lg:gap-12 mb-16">
                    {steps.map((step, idx) => (
                        <div key={idx} className="flex items-center gap-4 lg:gap-6">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${idx <= currentStep ? 'bg-primary text-white shadow-xl shadow-primary/20 scale-110' : 'bg-white text-gray-300 border border-gray-100'
                                }`}>
                                {idx < currentStep ? <Check size={20} strokeWidth={3} /> : step.icon}
                            </div>
                            <div className="hidden md:block">
                                <p className={`text-[10px] uppercase font-black tracking-[0.2em] ${idx <= currentStep ? 'text-primary' : 'text-gray-300'}`}>Paso 0{idx + 1}</p>
                                <p className={`text-sm font-bold ${idx <= currentStep ? 'text-gray-900' : 'text-gray-200'}`}>{step.title}</p>
                            </div>
                            {idx < steps.length - 1 && (
                                <div className="h-px w-8 lg:w-20 bg-gray-100" />
                            )}
                        </div>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -30 }}
                        className="pb-32"
                    >
                        {/* Step 0: Base */}
                        {currentStep === 0 && (
                            <section className="space-y-12">
                                <div className="text-center">
                                    <h2 className="text-4xl font-extralight uppercase tracking-[0.1em] text-gray-900 mb-4">Elige tu Base</h2>
                                    <p className="text-gray-400 max-w-md mx-auto italic">Selecciona el lienzo perfecto para tu creación</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {basesLoading ? [...Array(3)].map((_, i) => <div key={i} className="aspect-square bg-white animate-pulse rounded-[32px]" />) : (
                                        bases.map((base: any) => (
                                            <button
                                                key={base.id}
                                                onClick={() => setSelectedBase(base)}
                                                className={`relative bg-white p-8 rounded-[48px] border-2 transition-all duration-500 text-left group overflow-hidden ${selectedBase?.id === base.id ? 'border-primary shadow-2xl shadow-primary/10' : 'border-transparent hover:border-gray-100'
                                                    }`}
                                            >
                                                <div className="aspect-square rounded-[32px] overflow-hidden mb-8 bg-gray-50">
                                                    <img src={base.image_url} alt={base.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                                                </div>
                                                <h3 className="text-xl font-bold text-gray-900 mb-2 uppercase tracking-tight">{base.name}</h3>
                                                <p className="text-gray-400 text-sm mb-6 line-clamp-2 italic">{base.description}</p>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-2xl font-serif italic text-primary">${base.price.toFixed(2)}</span>
                                                    {selectedBase?.id === base.id && <Check className="text-primary" />}
                                                </div>
                                            </button>
                                        ))
                                    )}
                                </div>
                            </section>
                        )}

                        {/* Step 1: Dulces */}
                        {currentStep === 1 && (
                            <section className="space-y-12">
                                <div className="text-center">
                                    <h2 className="text-4xl font-extralight uppercase tracking-[0.1em] text-gray-900 mb-4">Añade los Dulces</h2>
                                    <p className="text-gray-400 max-w-md mx-auto italic">¡Elige todos los que quieras!</p>
                                </div>
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                                    {treatsLoading ? [...Array(8)].map((_, i) => <div key={i} className="aspect-square bg-white animate-pulse rounded-[32px]" />) : (
                                        treats.map((treat: any) => (
                                            <button
                                                key={treat.id}
                                                onClick={() => toggleTreat(treat)}
                                                className={`relative bg-white p-6 rounded-[32px] border-2 transition-all duration-500 text-center flex flex-col items-center ${selectedTreats.find(t => t.id === treat.id) ? 'border-primary bg-primary/[0.02] shadow-xl shadow-primary/5' : 'border-transparent hover:bg-white/50'
                                                    }`}
                                            >
                                                <div className="w-24 h-24 bg-gray-50 rounded-full overflow-hidden mb-4 p-2">
                                                    <img src={treat.image_url} alt={treat.name} className="w-full h-full object-contain" />
                                                </div>
                                                <h3 className="font-bold text-gray-800 text-sm mb-1 uppercase tracking-tight">{treat.name}</h3>
                                                <span className="text-primary font-serif italic text-sm mb-2">${treat.price.toFixed(2)}</span>
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${selectedTreats.find(t => t.id === treat.id) ? 'bg-primary text-white scale-110' : 'bg-gray-50 text-gray-300'
                                                    }`}>
                                                    <Plus size={16} />
                                                </div>
                                            </button>
                                        ))
                                    )}
                                </div>
                            </section>
                        )}

                        {/* Step 2: Resumen */}
                        {currentStep === 2 && (
                            <section className="max-w-3xl mx-auto">
                                <div className="bg-white p-12 rounded-[64px] shadow-2xl border border-gray-50">
                                    <div className="text-center mb-12">
                                        <div className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <Gift className="text-primary" size={40} />
                                        </div>
                                        <h2 className="text-4xl font-extralight uppercase tracking-[0.1em] text-gray-900 mb-2">Resumen de tu Box</h2>
                                        <p className="text-gray-400 italic">Lista para ser entregada</p>
                                    </div>

                                    <div className="space-y-8">
                                        <div className="flex items-center gap-6 p-6 bg-gray-50/50 rounded-3xl">
                                            <div className="w-20 h-20 bg-white rounded-2xl overflow-hidden shadow-sm">
                                                <img src={selectedBase?.image_url} alt="" className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-grow">
                                                <p className="text-[10px] font-black tracking-widest uppercase text-primary">Base</p>
                                                <h3 className="font-bold text-gray-900">{selectedBase?.name}</h3>
                                            </div>
                                            <span className="font-serif italic text-gray-500">${selectedBase?.price.toFixed(2)}</span>
                                        </div>

                                        <div className="space-y-4">
                                            <p className="text-[10px] font-black tracking-widest uppercase text-gray-400 pl-6">Dulces Seleccionados ({selectedTreats.length})</p>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                {selectedTreats.map(treat => (
                                                    <div key={treat.id} className="flex items-center gap-4 p-4 border border-gray-100 rounded-2xl">
                                                        <div className="w-10 h-10 bg-gray-50 rounded-lg p-1">
                                                            <img src={treat.image_url} alt="" className="w-full h-full object-contain" />
                                                        </div>
                                                        <span className="flex-grow text-sm font-bold text-gray-700">{treat.name}</span>
                                                        <span className="text-sm font-serif italic text-primary">${treat.price.toFixed(2)}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="pt-8 border-t border-gray-100 flex justify-between items-center">
                                            <span className="text-xl font-bold text-gray-900 uppercase tracking-tight">Total Final</span>
                                            <span className="text-4xl font-serif italic text-primary font-light">${totalPrice.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Footer Nav */}
            <footer className="fixed bottom-0 inset-x-0 h-24 bg-white border-t border-gray-100 flex items-center justify-center px-8 z-[100]">
                <button
                    disabled={!isStepValid()}
                    onClick={handleNext}
                    className={`w-full max-w-lg py-5 rounded-full font-black uppercase tracking-[0.2em] text-xs transition-all flex items-center justify-center gap-3 shadow-2xl ${isStepValid() ? 'bg-primary text-white shadow-primary/30 hover:scale-[1.02] active:scale-95' : 'bg-gray-100 text-gray-300 shadow-none cursor-not-allowed'
                        }`}
                >
                    {currentStep === steps.length - 1 ? 'Añadir al Carrito' : 'Siguiente Paso'}
                    <ChevronRight size={18} />
                </button>
            </footer>
        </div>
    );
};

export default CustomBuilder;
