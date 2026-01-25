import React from 'react';

interface FeaturesProps {
  onStartQuiz?: () => void;
}

const Features: React.FC<FeaturesProps> = ({ onStartQuiz }) => {
  return (
    <>
      {/* Gift Quiz Banner */}
      <div className="px-4 py-6">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-[#ff6b81] p-6 text-white shadow-lg shadow-primary/20">
          <div className="relative z-10 flex flex-col gap-2">
            <h3 className="text-xl font-bold font-display">¿No sabes qué elegir?</h3>
            <p className="text-sm text-white/90 mb-2 font-medium">
              Responde 3 preguntas simples y te recomendaremos el ramo perfecto.
            </p>
            <button 
              onClick={onStartQuiz}
              className="flex w-fit items-center justify-center rounded-lg bg-white px-4 py-2 text-primary text-sm font-bold shadow-sm hover:bg-gray-50 transition-colors active:scale-95"
            >
              Hacer el Quiz
              <span className="material-symbols-outlined ml-1 text-sm">arrow_forward</span>
            </button>
          </div>
          <div className="absolute -right-4 -bottom-4 opacity-20 rotate-12">
            <span className="material-symbols-outlined text-[100px]" style={{ fontSize: '100px' }}>quiz</span>
          </div>
        </div>
      </div>

      {/* Trust Features Bar */}
      <div className="bg-primary/5 dark:bg-white/5 py-6 px-4 mb-4 grid grid-cols-2 gap-4">
        <div className="flex flex-col items-center text-center gap-2">
          <div className="size-12 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center shadow-sm text-primary">
            <span className="material-symbols-outlined">speed</span>
          </div>
          <div>
            <p className="text-xs font-bold font-display dark:text-white">Entrega Mismo Día</p>
            <p className="text-[10px] text-gray-500">Ordena antes de las 2 PM</p>
          </div>
        </div>
        <div className="flex flex-col items-center text-center gap-2">
          <div className="size-12 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center shadow-sm text-primary">
            <span className="material-symbols-outlined">clean_hands</span>
          </div>
          <div>
            <p className="text-xs font-bold font-display dark:text-white">Higiene Certificada</p>
            <p className="text-[10px] text-gray-500">Estándares de manejo seguro</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Features;