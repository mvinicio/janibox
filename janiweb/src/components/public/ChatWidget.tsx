import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Smile, Paperclip, ChevronRight, Mic } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSupabaseData } from '../../hooks/useSupabaseData';

interface Message {
    id: number;
    text: string;
    sender: 'user' | 'support';
    time: string;
    products?: any[];
    file?: { url: string; type: string; name: string };
}

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [inputText, setInputText] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [filePreview, setFilePreview] = useState<{ url: string; type: string; name: string } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, text: '¡Hola! 👋 ¿Cómo podemos ayudarte hoy con tu regalo especial?', sender: 'support', time: '10:00 AM' },
        { id: 2, text: 'Nuestro horario de atención es de 9:00 AM a 7:00 PM.', sender: 'support', time: '10:00 AM' }
    ]);
    const scrollRef = useRef<HTMLDivElement>(null);
    const { data: productsData } = useSupabaseData('products', { select: 'id, name, price, image_url' });
    const [lastAction, setLastAction] = useState<string | null>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    // Speech Recognition Setup
    const startListening = () => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert('Lo siento, tu navegador no soporta el reconocimiento de voz. 🎙️');
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = 'es-ES';
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setInputText(prev => (prev ? `${prev} ${transcript}` : transcript));
        };

        recognition.start();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setFilePreview({
                url,
                type: file.type,
                name: file.name
            });
        }
    };

    const handleSendMessage = () => {
        if (!inputText.trim() && !filePreview) return;

        const normalize = (str: string) =>
            str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

        const cleanInput = normalize(inputText);
        const newMessage: Message = {
            id: Date.now(),
            text: inputText,
            sender: 'user',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            file: filePreview || undefined
        };

        setMessages(prev => [...prev, newMessage]);
        setInputText('');
        setFilePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';

        // Simulate Support Response
        setTimeout(() => {
            let responseText = 'Lo siento, no entendí del todo tu pregunta. 😅 ¿Te gustaría ver nuestros productos disponibles, saber sobre precios o detalles de envío? ✨';
            let featuredProducts: any[] | undefined = undefined;
            let currentAction = null;

            // Handle Affirmations based on lastAction
            const affirmations = ['si', 'claro', 'por supuesto', 'dale', 'bueno', 'ok', 'yes', 'va', 'sip', 'sii'];
            const isAffirmation = affirmations.some(a => cleanInput === a || cleanInput.startsWith(a + ' '));

            let queryText = cleanInput;
            if (isAffirmation && lastAction) {
                queryText = lastAction;
            }

            if (queryText.includes('hola') || queryText.includes('buen') || queryText.includes('que tal')) {
                responseText = '¡Hola! 👋 Es un gusto saludarte. ¿En qué podemos ayudarte hoy? Podemos mostrarte nuestro catálogo, precios o info de envíos.';
            } else if (queryText.includes('producto') || queryText.includes('tienen') || queryText.includes('catalogo') || queryText.includes('disponible') || queryText.includes('ver')) {
                featuredProducts = (productsData || []).slice(0, 4);
                if (featuredProducts.length > 0) {
                    responseText = `¡Claro! Contamos con opciones increíbles para sorprender. Aquí tienes algunos de nuestros favoritos actuales:`;
                } else {
                    responseText = '¡Hola! Tenemos una gran variedad de Ramos de Frutas y Chocolates. Puedes explorarlos todos en nuestra sección de Colección. 🍓🍫';
                }
                currentAction = null;
            } else if (queryText.includes('precio') || queryText.includes('cuanto') || queryText.includes('costo') || queryText.includes('dolar') || queryText.includes('presupuesto')) {
                responseText = 'Nuestros precios varían según el diseño, pero tenemos opciones hermosas desde $25.00. Si tienes un presupuesto específico, ¡también puedes armar tu propia caja en nuestra sección "Diseña tu Ramo"! 💸🎁';
                currentAction = null;
            } else if (queryText.includes('envio') || queryText.includes('donde') || queryText.includes('entrega')) {
                responseText = 'Realizamos entregas seguras en toda la ciudad. Al momento del checkout podrás programar el día y la hora exacta de la sorpresa. 🚚💨';
                currentAction = null;
            } else if (queryText.includes('pedido') || queryText.includes('orden') || queryText.includes('rastre')) {
                responseText = '¡Claro! Si tienes tu número de orden, puedes usar nuestra sección de Rastreo para ver el estado en tiempo real. 🔍📦';
                currentAction = null;
            } else {
                responseText = 'Lo siento, no entendí del todo tu pregunta. 😅 ¿Te gustaría ver nuestros productos disponibles, saber sobre precios o detalles de envío? ✨';
                currentAction = 'productos';
            }

            setLastAction(currentAction);

            const supportResponse: Message = {
                id: Date.now() + 1,
                text: responseText,
                sender: 'support',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                products: featuredProducts
            };
            setMessages(prev => [...prev, supportResponse]);
        }, 1200);
    };

    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                // Scrolling down
                setIsVisible(false);
            } else {
                // Scrolling up
                setIsVisible(true);
            }
            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    return (
        <div className={`fixed bottom-6 right-6 z-[120] transition-all duration-500 ${isVisible || isOpen ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95, transformOrigin: 'bottom right' }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="absolute bottom-20 right-0 w-[380px] bg-white rounded-[32px] shadow-2xl overflow-hidden border border-gray-100 flex flex-col"
                    >
                        {/* Header */}
                        <div className="bg-primary p-6 text-white">
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md">
                                        <MessageSquare size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold tracking-tight">Asistente JaniBox</h3>
                                        <div className="flex items-center gap-1.5">
                                            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                                            <span className="text-[10px] uppercase tracking-widest font-bold opacity-80">En línea</span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            <p className="text-sm opacity-90 leading-relaxed font-medium">
                                Soporte al cliente JaniBox
                            </p>
                        </div>

                        {/* Messages Area */}
                        <div
                            ref={scrollRef}
                            className="h-[450px] overflow-y-auto p-6 bg-gray-50/50 space-y-6 scroll-smooth custom-scrollbar"
                        >
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex flex-col gap-2 max-w-[90%] ${msg.sender === 'user' ? 'ml-auto items-end' : 'items-start'}`}
                                >
                                    <div className={`p-4 rounded-2xl shadow-sm border ${msg.sender === 'user'
                                        ? 'bg-primary text-white rounded-tr-none border-primary/10'
                                        : 'bg-white text-gray-700 rounded-tl-none border-gray-100'
                                        }`}>
                                        {msg.file && (
                                            <div className="mb-3 overflow-hidden rounded-xl border border-black/5 bg-black/5">
                                                {msg.file.type.startsWith('image/') ? (
                                                    <img src={msg.file.url} alt="Adjunto" className="w-full h-auto object-cover max-h-[200px]" />
                                                ) : (
                                                    <div className="p-3 flex items-center gap-2 text-xs font-medium">
                                                        <Paperclip size={14} />
                                                        <span className="truncate">{msg.file.name}</span>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        <p className="text-sm leading-relaxed">
                                            {msg.text}
                                        </p>
                                    </div>

                                    {/* Product Carousel */}
                                    {msg.products && (
                                        <div className="w-full overflow-x-auto pb-2 -mx-2 px-2 flex gap-3 snap-x no-scrollbar">
                                            {msg.products.map((p) => (
                                                <div key={p.id} className="min-w-[160px] bg-white rounded-2xl p-3 border border-gray-100 shadow-sm snap-start group cursor-pointer hover:border-primary/30 transition-all text-left">
                                                    <div className="aspect-square rounded-xl overflow-hidden bg-gray-50 mb-3">
                                                        <img src={p.image_url} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                    </div>
                                                    <h4 className="text-[11px] font-bold text-gray-900 line-clamp-1 mb-1">{p.name}</h4>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-[10px] font-serif italic text-primary">${p.price}</span>
                                                        <div className="bg-gray-50 p-1.5 rounded-lg text-gray-400 group-hover:bg-primary group-hover:text-white transition-colors">
                                                            <ChevronRight size={10} />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest px-1">
                                        {msg.sender === 'support' ? 'Soporte' : 'Tú'} • {msg.time}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-white border-t border-gray-100">
                            {/* File Preview */}
                            <AnimatePresence>
                                {filePreview && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="mb-3 p-2 bg-gray-50 rounded-2xl flex items-center gap-3 border border-gray-100 relative group"
                                    >
                                        <div className="w-12 h-12 rounded-xl border border-gray-200 overflow-hidden bg-white shrink-0">
                                            {filePreview.type.startsWith('image/') ? (
                                                <img src={filePreview.url} alt="Preview" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                    <Paperclip size={20} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-grow min-w-0">
                                            <p className="text-[11px] font-bold text-gray-900 truncate">{filePreview.name}</p>
                                            <p className="text-[9px] text-gray-400 uppercase tracking-widest">Listo para enviar</p>
                                        </div>
                                        <button
                                            onClick={() => {
                                                setFilePreview(null);
                                                if (fileInputRef.current) fileInputRef.current.value = '';
                                            }}
                                            className="p-1.5 hover:bg-gray-200 rounded-lg text-gray-400 transition-colors"
                                        >
                                            <X size={14} />
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <form
                                onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                                className="relative flex items-center gap-2"
                            >
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                                <div className="flex-grow relative">
                                    <input
                                        type="text"
                                        value={inputText}
                                        onChange={(e) => setInputText(e.target.value)}
                                        placeholder={filePreview ? "Añade un comentario..." : "Escribe un mensaje..."}
                                        className="w-full bg-gray-50 border-none rounded-2xl px-5 py-3.5 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all pr-12"
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
                                    >
                                        <Smile size={18} />
                                    </button>
                                </div>
                                <button
                                    type="submit"
                                    disabled={!inputText.trim() && !filePreview}
                                    className="bg-primary text-white p-3.5 rounded-2xl shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
                                >
                                    <Send size={18} />
                                </button>
                            </form>
                            <div className="mt-3 flex gap-4 px-2">
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="flex items-center gap-1.5 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <Paperclip size={14} />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Archivo</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={startListening}
                                    className={`flex items-center gap-1.5 transition-all ${isListening ? 'text-primary animate-pulse' : 'text-gray-400 hover:text-primary'}`}
                                >
                                    <div className={`relative flex items-center justify-center ${isListening ? 'scale-110' : ''}`}>
                                        <Mic size={14} />
                                        {isListening && <span className="absolute inset-0 bg-primary/20 rounded-full animate-ping"></span>}
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-widest">
                                        {isListening ? 'Escuchando...' : 'Voz'}
                                    </span>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button */}
            <motion.button
                whileHover={{ scale: 1.05, opacity: 1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 z-50 ${isOpen ? 'bg-white text-primary' : 'bg-primary text-white opacity-60 hover:opacity-100'
                    }`}
            >
                {isOpen ? <X size={24} /> : <MessageSquare size={24} fill="currentColor" />}
                {!isOpen && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></span>
                )}
            </motion.button>
        </div>
    );
};

export default ChatWidget;
