import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Check, Candy, Flame, Zap, Leaf, Heart, Cake, Sun, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { JaniboxLogo } from '../../components/shared/Logos';

const steps = [
    {
        id: 'flavor',
        title: '¿Cuál es su sabor favorito?',
        description: 'Elegiremos los mejores snacks según tu elección.',
        options: [
            { id: 'sweet', label: 'Dulce', iconName: 'Candy', image: '/assets/quiz_sweet.png' },
            { id: 'spicy', label: 'Picante', iconName: 'Flame', image: '/assets/quiz_spicy.png' },
            { id: 'salty', label: 'Salado', iconName: 'Zap', image: '/assets/quiz_salty.png' },
            { id: 'healthy', label: 'Saludable', iconName: 'Leaf', image: '/assets/quiz_healthy.png' }
        ]
    },
    {
        id: 'occasion',
        title: '¿Para qué ocasión es?',
        description: 'La presentación importa tanto como el contenido.',
        options: [
            { id: 'love', label: 'Amor/Aniversario', iconName: 'Heart', image: '/assets/quiz_love.png' },
            { id: 'birthday', label: 'Cumpleaños', iconName: 'Cake', image: '/assets/quiz_birthday.png' },
            { id: 'thanks', label: 'Agradecimiento', iconName: 'Sun', image: '/assets/quiz_thanks.png' },
            { id: 'congratulations', label: 'Logros', iconName: 'Trophy', image: '/assets/quiz_congrats.png' }
        ]
    }
];

const IconMap: Record<string, any> = {
    Candy, Flame, Zap, Leaf, Heart, Cake, Sun, Trophy
};

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
                                        <div className="mb-4 p-4 bg-white/20 backdrop-blur-md rounded-2xl group-hover:scale-110 transition-transform duration-500 group-hover:bg-white/30">
                                            {(() => {
                                                const Icon = IconMap[option.iconName];
                                                return <Icon size={32} strokeWidth={1.5} className="text-white" />;
                                            })()}
                                        </div>
                                        <span className="text-white font-bold tracking-[0.2em] uppercase text-[10px]">{option.label}</span>
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
