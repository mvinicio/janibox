import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { JaniboxLogo } from '../../components/shared/Logos';

const steps = [
    {
        id: 'flavor',
        title: '¿Cuál es su sabor favorito?',
        description: 'Elegiremos los mejores snacks según tu elección.',
        options: [
            { id: 'sweet', label: 'Dulce', icon: '🍭', image: 'https://images.unsplash.com/photo-1581798459219-338564070059?auto=format&fit=crop&q=80&w=400' },
            { id: 'spicy', label: 'Picante', icon: '🔥', image: 'https://images.unsplash.com/photo-1588276552401-30058a0fe57b?auto=format&fit=crop&q=80&w=400' },
            { id: 'salty', label: 'Salado', icon: '🍿', image: 'https://images.unsplash.com/photo-1541533693247-ad1b29a39ec5?auto=format&fit=crop&q=80&w=400' },
            { id: 'healthy', label: 'Saludable', icon: '🍓', image: 'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?auto=format&fit=crop&q=80&w=400' }
        ]
    },
    {
        id: 'occasion',
        title: '¿Para qué ocasión es?',
        description: 'La presentación importa tanto como el contenido.',
        options: [
            { id: 'love', label: 'Amor/Aniversario', icon: '❤️', image: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=400' },
            { id: 'birthday', label: 'Cumpleaños', icon: '🎂', image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&q=80&w=400' },
            { id: 'thanks', label: 'Agradecimiento', icon: '🙏', image: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&q=80&w=400' },
            { id: 'congratulations', label: 'Logros', icon: '🎓', image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=400' }
        ]
    }
];

const Quiz = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [selections, setSelections] = useState<Record<string, string>>({});
    const navigate = useNavigate();

    const currentQuizData = steps[currentStep];
    const progress = ((currentStep + 1) / steps.length) * 100;

    const handleSelect = (optionId: string) => {
        setSelections(prev => ({ ...prev, [currentQuizData.id]: optionId }));
    };

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            // Recommendation Logic Placeholder
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

    return (
        <div className="min-h-screen bg-white flex flex-col font-inter">
            {/* Header */}
            <header className="p-8 flex justify-between items-center bg-white border-b border-gray-50 sticky top-0 z-10">
                <button
                    onClick={handleBack}
                    className="flex items-center gap-2 text-gray-400 hover:text-primary transition-colors text-xs font-bold uppercase tracking-widest"
                >
                    <ChevronLeft size={16} /> Volver
                </button>
                <div className="flex items-center gap-3">
                    <JaniboxLogo className="w-8 h-8 text-primary" />
                    <span className="text-sm font-black tracking-[0.2em] uppercase">Recomendador</span>
                </div>
                <div className="w-20"></div> {/* Spacer */}
            </header>

            <main className="flex-grow flex flex-col items-center justify-center p-6 max-w-4xl mx-auto w-full">
                {/* Progress Bar */}
                <div className="w-full max-w-md mb-12">
                    <div className="flex justify-between items-end mb-3">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Progreso</span>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                            {currentStep + 1} de {steps.length}
                        </span>
                    </div>
                    <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            className="h-full bg-primary"
                        />
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="text-center w-full"
                    >
                        <h2 className="text-3xl md:text-5xl font-extralight tracking-[0.1em] uppercase text-gray-900 mb-4">
                            {currentQuizData.title}
                        </h2>
                        <p className="text-gray-400 font-medium mb-12">
                            {currentQuizData.description}
                        </p>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                            {currentQuizData.options.map((option) => (
                                <button
                                    key={option.id}
                                    onClick={() => handleSelect(option.id)}
                                    className={`relative aspect-[4/5] rounded-[32px] overflow-hidden group transition-all duration-500 border-2 ${selections[currentQuizData.id] === option.id
                                            ? 'border-primary ring-4 ring-primary/10'
                                            : 'border-transparent hover:border-gray-200'
                                        }`}
                                >
                                    <img
                                        src={option.image}
                                        alt={option.label}
                                        className="absolute inset-0 w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex flex-col items-center justify-end pb-8">
                                        <div className="text-3xl mb-2">{option.icon}</div>
                                        <span className="text-white font-bold tracking-tight uppercase text-xs">{option.label}</span>
                                    </div>
                                    {selections[currentQuizData.id] === option.id && (
                                        <div className="absolute top-4 right-4 bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg">
                                            <Check size={16} strokeWidth={3} />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </main>

            <footer className="p-8 bg-white border-t border-gray-50 sticky bottom-0 z-10 flex justify-center">
                <button
                    disabled={!selections[currentQuizData.id]}
                    onClick={handleNext}
                    className={`w-full max-w-md py-5 rounded-full font-black uppercase tracking-[0.2em] text-xs shadow-xl transition-all flex items-center justify-center gap-3 ${selections[currentQuizData.id]
                            ? 'bg-primary text-white shadow-primary/30 hover:scale-[1.02] active:scale-95'
                            : 'bg-gray-100 text-gray-300 shadow-none cursor-not-allowed'
                        }`}
                >
                    {currentStep < steps.length - 1 ? 'Siguiente Paso' : 'Ver Recomendación'}
                    <ChevronRight size={18} />
                </button>
            </footer>
        </div>
    );
};

export default Quiz;
