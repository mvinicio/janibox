import React, { useState } from 'react';

interface QuizProps {
  onBack: () => void;
}

const Quiz: React.FC<QuizProps> = ({ onBack }) => {
  const [selectedOption, setSelectedOption] = useState<string>('Spicy');

  const options = [
    {
      id: 'Sweet',
      label: 'Dulce',
      icon: 'icecream',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAEBL2x_QwOSRuIzDDgmkUtgUKVhr1joldBMOsSnevdgREQZzdy2Fas2n-eFMKYh3muXN6Rf3Ml-bRfwwOtuTZPaVGH8hzaxB0ZnzHttsXmRI0eeG67A0W48l8jqoWm0ryMhH9uj777fTuQCZcagt3j2nfhiB4SE2BPp0O9zHUHl3SkN7YZm4jMLJJ-kfrL17oY7nJbn4hVcJlCn_Mz9l43ydk3ronI0neWgmA5CCsa8ww0EVoRDLlTdi1V3QRZMtZ5VGMnbB3v7Q'
    },
    {
      id: 'Spicy',
      label: 'Picante',
      icon: 'mode_heat',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAoRh-RzEcjo3TIUFw2HCzyPjGWjhbFWzH46IiQjB5cDJa5oQHXzCSyIpMpDYNeK32hF6AY5Agwf6Ed16k7WpVWPwdaPdAn7wLY8ivE2a0H8E8j298CO6YXGwWHygyf-JR2NL-AfpEgZxTMBgsefgeqNTwJxmWeDTOBOs9__nRWVMfO-y74TbdFV2_L6V07q4CFzg1uQMUTHLZbx-n9Jgf-2vgG9hd2zS_a2eOjmLZd00NkukhuKP_mnEeax-YJQZ1e99jF9rnicA'
    },
    {
      id: 'Salty',
      label: 'Salado',
      icon: 'bakery_dining',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA71ocJQEkyriXxbVgeyg5ovh3IcGLLlH5uApYuX_lEZZc8TF6AZulQWeQkPJfsmoBvQStjujnff0r-fvvBepiKaL9zk5ulkgN5oduk6c5aLQ2VtjQq70r7xKKpTIVtheKoW9gb9Nl1Zdn4hXFOhaHRNhS_DCKe-Hvcj5as9Kl4K9VyHLI5wewzrqb8PhNFIZlI84_QNZL8VT-TYSSKo2S-JhmXum-RCES1DtZxG7rkfRzS9FuIO-m2KKDlqZMw6elibsN6psJO0Q'
    },
    {
      id: 'Healthy',
      label: 'Saludable',
      icon: 'nutrition',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC9A2JRiDBQmbSCD7oCzxxji4iU2-EyPwCBDSDmfa4ulK7-zuyRHOPJcFluqQJWSD9fHf7Ip2f6jRi1vB66_qUcXDz298SSvobfDdgQkIQiniHKhlkHPOJUHfHDy59bpIU1QCrEczXuIn6zOLC8NLltFjuqn1ZsOAEriqZB9kwZ1Yb5FMnyJylhHa8oQQnyi2-yVLxTma9aHNdGJx7hWuvf1TiI7bnDvD-24vwXNwvaeVXntR5xw4ENzBqePrr2-VPHgXShLyJ63g'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-background-dark font-display animate-in fade-in slide-in-from-right-10 duration-300">
      {/* Navbar */}
      <div className="flex items-center p-4 pb-2 justify-between">
        <button onClick={onBack} className="text-[#181112] dark:text-white flex size-12 shrink-0 items-center justify-start cursor-pointer hover:opacity-70 transition-opacity">
          <span className="material-symbols-outlined">arrow_back_ios</span>
        </button>
        <h2 className="text-[#181112] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">
          Buscador de Regalos
        </h2>
      </div>

      {/* Progress */}
      <div className="flex flex-col gap-3 p-4">
        <div className="flex gap-6 justify-between items-end">
          <p className="text-[#181112] dark:text-white text-base font-semibold leading-normal">Progreso del Quiz</p>
          <p className="text-[#181112] dark:text-gray-400 text-sm font-medium leading-normal">1 de 5</p>
        </div>
        <div className="rounded-full bg-[#e6dbdd] dark:bg-gray-800 h-3 overflow-hidden">
          <div className="h-full rounded-full bg-primary transition-all duration-500 ease-out" style={{ width: '20%' }}></div>
        </div>
      </div>

      {/* Headline */}
      <div className="px-6 pt-4 pb-4">
        <h2 className="text-[#181112] dark:text-white tracking-tight text-[32px] font-extrabold leading-tight text-center">
          ¿Cuál es su sabor favorito?
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-center mt-2 text-sm">
          ¡Usaremos esto para elegir los snacks perfectos!
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-4 p-4 mb-auto">
        {options.map((option) => (
          <div
            key={option.id}
            onClick={() => setSelectedOption(option.id)}
            className={`relative flex flex-col items-center gap-3 p-4 rounded-xl border-[3px] transition-all cursor-pointer group ${
              selectedOption === option.id
                ? 'border-primary bg-primary/5 shadow-md scale-[1.02]'
                : 'bg-white dark:bg-gray-900 border-transparent shadow-sm hover:shadow-md hover:scale-[1.01]'
            }`}
          >
            <div 
              className="bg-cover bg-center flex flex-col gap-3 rounded-lg justify-center items-center aspect-square w-full"
              style={{
                backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0) 100%), url("${option.image}")`
              }}
            >
              <span className="material-symbols-outlined text-white text-5xl drop-shadow-lg">{option.icon}</span>
            </div>
            <p className="text-[#181112] dark:text-white text-lg font-bold">{option.label}</p>
            {selectedOption === option.id && (
              <div className="absolute top-2 right-2 bg-primary text-white rounded-full p-1 animate-in fade-in zoom-in duration-200">
                <span className="material-symbols-outlined text-sm block">check</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer Nav */}
      <div className="mt-auto p-4 pb-8 flex flex-col gap-3 bg-white dark:bg-background-dark sticky bottom-0 border-t border-gray-100 dark:border-gray-800/50">
        <div className="flex gap-3">
          <button onClick={onBack} className="flex min-w-[56px] cursor-pointer items-center justify-center rounded-xl h-14 px-4 bg-gray-100 dark:bg-gray-800 text-[#181112] dark:text-white transition-colors hover:bg-gray-200 dark:hover:bg-gray-700">
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <button className="flex-1 min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-14 px-5 bg-primary text-white text-lg font-bold leading-normal tracking-[0.015em] shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all active:scale-95">
            <span className="truncate">Siguiente Pregunta</span>
          </button>
        </div>
        <p className="text-gray-400 dark:text-gray-500 text-[10px] text-center uppercase tracking-widest font-bold">
          Paso 1: Perfil de Sabor
        </p>
      </div>
    </div>
  );
};

export default Quiz;