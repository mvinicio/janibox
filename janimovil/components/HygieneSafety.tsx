import React, { useState } from 'react';

interface HygieneSafetyProps {
  onBack: () => void;
  onChatClick: () => void;
}

const HygieneSafety: React.FC<HygieneSafetyProps> = ({ onBack, onChatClick }) => {
  const [openSection, setOpenSection] = useState<string | null>('food-safety');
  const [search, setSearch] = useState('');

  const toggleSection = (id: string) => {
    setOpenSection(openSection === id ? null : id);
  };

  const faqItems = [
    {
      id: 'food-safety',
      question: '¿Cómo garantizan la seguridad alimentaria?',
      answer: 'Todos los dulces permanecen en sus envolturas selladas originales del fabricante. Nuestros artistas de ramos trabajan en una instalación certificada para alimentos y usan redes para el cabello, mascarillas y guantes nuevos para cada pedido.'
    },
    {
      id: 'structural',
      question: '¿Qué materiales se usan para el soporte?',
      answer: 'Utilizamos cintas adhesivas no tóxicas de grado alimenticio y soportes de plástico libre de BPA o bambú que nunca entran en contacto directo con el contenido comestible de los dulces.'
    },
    {
      id: 'staff',
      question: '¿Su personal está capacitado en higiene?',
      answer: 'Sí, cada miembro del equipo recibe certificación obligatoria de manejo de alimentos e higiene anualmente. Seguimos estrictamente las pautas de saneamiento en el lugar de trabajo.'
    },
    {
      id: 'delivery',
      question: '¿Cómo se protege el regalo durante el envío?',
      answer: 'Cada ramo se sella térmicamente en una envoltura protectora transparente de celofán y se envía en una caja resistente de doble pared para evitar cualquier contaminación externa durante el tránsito.'
    }
  ];

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display animate-in fade-in slide-in-from-right-10 duration-300">
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-50 flex items-center bg-white/80 dark:bg-background-dark/80 backdrop-blur-md p-4 pb-2 justify-between border-b border-gray-100 dark:border-white/5">
        <button 
          onClick={onBack}
          className="text-[#181112] dark:text-white flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-white/10 cursor-pointer transition-colors"
        >
          <span className="material-symbols-outlined">arrow_back_ios_new</span>
        </button>
        <h2 className="text-[#181112] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-10">
          Higiene y Seguridad
        </h2>
      </div>

      <main className="flex-1 pb-32">
        {/* Headline */}
        <div className="px-4 pt-6 pb-2">
          <h1 className="text-[#181112] dark:text-white tracking-tight text-[32px] font-bold leading-tight">
            Tu seguridad es nuestra prioridad
          </h1>
          <p className="text-[#87646a] dark:text-gray-400 text-base font-normal leading-normal mt-2">
            Seguimos estrictos protocolos de salud para asegurar que cada ramo de dulces se prepare en un ambiente estéril y seguro.
          </p>
        </div>

        {/* Search Bar */}
        <div className="px-4 py-4">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
            <input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white dark:bg-gray-800 border-none rounded-xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary text-[#181112] dark:text-white placeholder-gray-400 shadow-sm" 
              placeholder="Buscar temas de higiene..." 
              type="text"
            />
          </div>
        </div>

        {/* Trust Badges Grid */}
        <div className="grid grid-cols-3 gap-3 p-4">
          <div className="flex flex-col items-center text-center gap-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 p-4 transition-all hover:border-primary/50 shadow-sm">
            <div className="text-primary bg-primary/10 p-3 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-[28px]">wash</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <h2 className="text-[#181112] dark:text-white text-xs font-bold leading-tight">Lavado de Manos</h2>
              <p className="text-[#87646a] dark:text-gray-400 text-[10px] font-normal leading-normal">Frecuente</p>
            </div>
          </div>
          <div className="flex flex-col items-center text-center gap-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 p-4 transition-all hover:border-primary/50 shadow-sm">
            <div className="text-primary bg-primary/10 p-3 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-[28px]">cleaning_services</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <h2 className="text-[#181112] dark:text-white text-xs font-bold leading-tight">Sanitización</h2>
              <p className="text-[#87646a] dark:text-gray-400 text-[10px] font-normal leading-normal">Diaria</p>
            </div>
          </div>
          <div className="flex flex-col items-center text-center gap-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 p-4 transition-all hover:border-primary/50 shadow-sm">
            <div className="text-primary bg-primary/10 p-3 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-[28px]">health_and_safety</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <h2 className="text-[#181112] dark:text-white text-xs font-bold leading-tight">Equipo Pro</h2>
              <p className="text-[#87646a] dark:text-gray-400 text-[10px] font-normal leading-normal">Guantes y Mascarillas</p>
            </div>
          </div>
        </div>

        {/* FAQ Sections */}
        <div className="pb-8">
          <h2 className="text-[#181112] dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-6">
            Preparación y Seguridad
          </h2>
          
          {/* Accordion Items */}
          <div className="px-4 space-y-3">
            {faqItems.filter(i => i.question.toLowerCase().includes(search.toLowerCase()) || i.answer.toLowerCase().includes(search.toLowerCase())).map((item) => (
              <div 
                key={item.id}
                onClick={() => toggleSection(item.id)}
                className="border-b border-gray-100 dark:border-gray-800 py-4 cursor-pointer group"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-[#181112] dark:text-white text-base font-semibold pr-4 leading-snug">{item.question}</h3>
                  <span className={`material-symbols-outlined text-gray-400 group-hover:text-primary transition-transform duration-300 ${openSection === item.id ? 'rotate-180 text-primary' : ''}`}>
                    expand_more
                  </span>
                </div>
                <div 
                  className={`grid transition-all duration-300 ease-in-out ${
                    openSection === item.id ? 'grid-rows-[1fr] opacity-100 mt-3' : 'grid-rows-[0fr] opacity-0 mt-0'
                  }`}
                >
                  <p className="text-[#87646a] dark:text-gray-400 text-sm leading-relaxed overflow-hidden">
                    {item.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <h2 className="text-[#181112] dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-8">
            Alérgenos e Ingredientes
          </h2>
          <div className="px-4 space-y-3">
            <div className="border-b border-gray-100 dark:border-gray-800 py-4 cursor-pointer group flex justify-between items-center">
              <h3 className="text-[#181112] dark:text-white text-base font-semibold pr-4">¿Ofrecen ramos sin nueces?</h3>
              <span className="material-symbols-outlined text-gray-400 group-hover:text-primary transition-colors">expand_more</span>
            </div>
            <div className="border-b border-gray-100 dark:border-gray-800 py-4 cursor-pointer group flex justify-between items-center">
              <h3 className="text-[#181112] dark:text-white text-base font-semibold pr-4">¿Puedo pedir snacks sin gluten?</h3>
              <span className="material-symbols-outlined text-gray-400 group-hover:text-primary transition-colors">expand_more</span>
            </div>
          </div>
        </div>
      </main>

      {/* Sticky Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 dark:bg-background-dark/90 backdrop-blur-md border-t border-gray-100 dark:border-gray-800 max-w-[500px] mx-auto z-40">
        <button 
          onClick={onChatClick}
          className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
        >
          <span className="material-symbols-outlined">support_agent</span>
          ¿Aún tienes dudas? Chatea con nosotros
        </button>
      </div>
    </div>
  );
};

export default HygieneSafety;