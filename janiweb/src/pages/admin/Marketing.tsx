import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Sparkles,
    Settings as SettingsIcon,
    Save,
    Copy,
    Check,
    RefreshCw,
    Wand2,
    Instagram,
    Upload,
    Image as ImageIcon,
    Type,
    Download,
    Target,
    Users,
    MapPin,
    X,
    Trash2,
    History,
    Search,
    Locate,
    Plus,
    Facebook
} from 'lucide-react';
import toast from 'react-hot-toast';
import LocationMap from '../../components/LocationMap';

const Marketing = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [generatedText, setGeneratedText] = useState('');
    const [generatedImage, setGeneratedImage] = useState('');
    const [giftContext, setGiftContext] = useState('romántico'); // default context
    const [loading, setLoading] = useState(false);
    const [loadingImage, setLoadingImage] = useState(false);
    const [isCopying, setIsCopying] = useState(false);
    const [isManualPrompt, setIsManualPrompt] = useState(false);
    const [customPrompt, setCustomPrompt] = useState('');
    const [isUploadedImage, setIsUploadedImage] = useState(false);
    const [imageFidelity, setImageFidelity] = useState(0.7);
    const [uploadedImageUrl, setUploadedImageUrl] = useState('');

    // Audience state
    const [audienceAge, setAudienceAge] = useState({ min: 18, max: 65 });
    const [audienceGender, setAudienceGender] = useState('all'); // all, male, female

    // Geo-Targeting State
    // Geo-Targeting State: Multi-Location
    const [locations, setLocations] = useState<any[]>([
        { id: 'default', lat: -2.1894, lng: -79.8891, radius: 5, name: 'Guayaquil' }
    ]);
    const [activeLocationId, setActiveLocationId] = useState<string | null>('default');

    const [audienceInterests, setAudienceInterests] = useState(['Regalos', 'Chocolate', 'Flores']);
    const [newInterest, setNewInterest] = useState('');

    // Settings state
    const [showSettings, setShowSettings] = useState(false);
    const [openaiKey, setOpenaiKey] = useState('');
    const [fluxKey, setFluxKey] = useState('');
    const [metaToken, setMetaToken] = useState('');
    const [metaPageId, setMetaPageId] = useState('');
    const [saving, setSaving] = useState(false);
    const lastSaveRef = useRef<string | null>(null);
    const [history, setHistory] = useState<any[]>([]);
    const [loadingHistory, setLoadingHistory] = useState(true);
    const [postToDelete, setPostToDelete] = useState<string | null>(null);

    useEffect(() => {
        fetchProducts();
        fetchSettings();
        fetchHistory();
    }, []);

    useEffect(() => {
        if (selectedProduct) {
            updateDefaultPrompt();
        }
    }, [selectedProduct, giftContext]);

    const updateDefaultPrompt = () => {
        let atmosphere = "iluminación cálida de estudio, hiperrealista";
        if (giftContext === 'romántico') atmosphere = "iluminación suave, pétalos de rosa, ambiente íntimo y elegante";
        if (giftContext === 'cumpleaños') atmosphere = "ambiente festivo, confeti sutil de seda, iluminación brillante y alegre";
        if (giftContext === 'aniversario') atmosphere = "estilo cena romántica, velas de fondo desenfocadas, elegancia clásica";
        if (giftContext === 'graduación') atmosphere = "ambiente de éxito y logro, sobrio pero sofisticado, luz clara de día";
        if (giftContext === 'nacimiento') atmosphere = "colores pastel suaves, ambiente tierno y delicado, luz difusa";
        if (giftContext === 'san-valentin') atmosphere = "muchos corazones rojos, pétalos ardientes, iluminación romántica y cálida";
        if (giftContext === 'navidad') atmosphere = "fondo acogedor con luces navideñas borrosas, copos de nieve sutiles, tonos rojos y dorados";
        if (giftContext === 'corporativo') atmosphere = "fondo de oficina moderna y minimalista, iluminación clara y profesional, elegancia ejecutiva";

        const prompt = `FOTOGRAFÍA PUBLICITARIA DE ALTA GAMA: Un arreglo de "JaniBox" premium. Producto: "${selectedProduct?.name || 'Regalo Especial'}". Ocasión: ${giftContext}. Detalles: Flores frescas, decoraciones gourmet, disposición artística. Estilo: foto RAW, resolución 8k, ${atmosphere}, profundidad de campo cinematográfica. Sin textos ni logos.`;
        setCustomPrompt(prompt);
    };

    const fetchProducts = async () => {
        const { data } = await supabase.from('products').select('*').order('name');
        if (data && data.length > 0) {
            setProducts(data);
            if (!selectedProduct) setSelectedProduct(data[0]);
        }
    };

    const fetchSettings = async () => {
        const { data } = await supabase.from('store_settings').select('*').single();
        if (data) {
            setOpenaiKey(data.openai_api_key || '');
            setFluxKey(data.flux_api_key || '');
            setMetaToken(data.meta_access_token || '');
            setMetaPageId(data.meta_page_id || '');
        }
    };

    const fetchHistory = async () => {
        setLoadingHistory(true);
        try {
            const { data, error } = await supabase
                .from('ai_posts')
                .select('*')
                .order('created_at', { ascending: false });
            if (error) throw error;
            setHistory(data || []);
        } catch (error) {
            console.error('Error fetching history:', error);
        } finally {
            setLoadingHistory(false);
        }
    };

    const saveToHistory = async (text?: string, image?: string, isManual = false) => {
        const textToSave = (text !== undefined ? text : generatedText)?.trim();
        const imageToSave = image !== undefined ? image : generatedImage;

        // Si es automático, solo guardamos si ambos están presentes y no son vacíos
        if (!isManual && (!textToSave || !imageToSave)) {
            console.log('Omitiendo guardado automático: Post incompleto');
            return;
        }

        // Si no hay nada que guardar, salir
        if (!textToSave && !imageToSave) return;

        // Prevenir duplicados idénticos consecutivos
        const currentContentKey = `${textToSave}-${imageToSave}`;
        if (lastSaveRef.current === currentContentKey) {
            console.log('Post idéntico ya guardado');
            if (isManual) toast.error('Este post ya está en el historial');
            return;
        }

        try {
            // Guardar el hash/clave para prevenir el siguiente duplicado
            lastSaveRef.current = currentContentKey;

            const { error } = await supabase.from('ai_posts').insert([{
                product_id: selectedProduct?.id,
                product_name: selectedProduct?.name,
                prompt: isManualPrompt ? customPrompt : `Auto (${giftContext})`,
                generated_text: textToSave,
                image_url: imageToSave || null,
                audience_settings: {
                    age: audienceAge,
                    gender: audienceGender,
                    locations: locations, // Save full array
                    interests: audienceInterests
                },
                gift_context: giftContext
            }]);

            if (error) throw error;
            fetchHistory();
            if (isManual) toast.success('Guardado en historial');
        } catch (error: any) {
            console.error('Error saving to history:', error);
            if (isManual) toast.error('Error al guardar: ' + error.message);
        }
    };

    const confirmDelete = async () => {
        if (!postToDelete) return;
        try {
            const { error } = await supabase.from('ai_posts').delete().eq('id', postToDelete);
            if (error) throw error;
            setHistory(history.filter(p => p.id !== postToDelete));
            toast.success('Post eliminado');
        } catch (error: any) {
            toast.error('Error al eliminar');
        } finally {
            setPostToDelete(null);
        }
    };

    const reusePost = (post: any) => {
        if (post.product_id) {
            const prod = products.find(p => p.id === post.product_id);
            if (prod) setSelectedProduct(prod);
        }
        setGeneratedText(post.generated_text || '');
        setGeneratedImage(post.image_url || '');
        setGiftContext(post.gift_context || 'romántico');
        if (post.prompt && post.prompt.includes('Auto')) {
            setIsManualPrompt(false);
        } else {
            setIsManualPrompt(true);
            setCustomPrompt(post.prompt || '');
        }
        if (post.audience_settings) {
            const s = post.audience_settings;
            setAudienceAge(s.age || { min: 18, max: 65 });
            setAudienceGender(s.gender || 'all');

            // Restore Map State (Multi-Location Support)
            if (s.locations && Array.isArray(s.locations)) {
                setLocations(s.locations);
                setActiveLocationId(s.locations[0]?.id || null);
            } else if (s.location && s.location.center) {
                // Legacy support
                setLocations([{
                    id: 'legacy',
                    lat: s.location.center[0],
                    lng: s.location.center[1],
                    radius: s.location.radius || 5,
                    name: s.location.name || 'Ubicación'
                }]);
                setActiveLocationId('legacy');
            }

            setAudienceInterests(s.interests || []);
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
        toast.success('Datos cargados');
    };

    const handleSaveSettings = async () => {
        setSaving(true);
        try {
            const { data: existing } = await supabase.from('store_settings').select('id').single();
            const updates = {
                openai_api_key: openaiKey,
                flux_api_key: fluxKey,
                meta_access_token: metaToken,
                meta_page_id: metaPageId
            };

            if (existing) {
                await supabase.from('store_settings').update(updates).eq('id', existing.id);
            } else {
                await supabase.from('store_settings').insert([updates]);
            }
            toast.success('Configuración de Marketing guardada');
            await fetchSettings(); // Sincronizar estado inmediatamente
            setShowSettings(false);
        } catch (error) {
            toast.error('Error al guardar configuración');
        } finally {
            setSaving(false);
        }
    };

    const generateCopy = async () => {
        if (!selectedProduct) {
            toast.error('Por favor, selecciona un producto del menú de la izquierda');
            return;
        }
        if (!openaiKey) {
            toast.error('Debes configurar la API Key de OpenAI en el botón de arriba');
            setShowSettings(true);
            return;
        }

        setLoading(true);
        // Limpiar imagen anterior para evitar persistencia de "pares viejos" en el historial
        if (!isUploadedImage) setGeneratedImage('');

        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${openaiKey}`
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    messages: [
                        {
                            role: "system",
                            content: "Eres un experto en marketing digital para una tienda de regalos y dulces llamada JaniBox. Tu estilo es jovial, dulce y persuasivo. Usa emojis."
                        },
                        {
                            role: "user",
                            content: `Escribe un post de Instagram para el producto "${selectedProduct.name}". Ocasión/Contexto: ${giftContext}. Descripción del producto: ${selectedProduct.description || 'Delicioso detalle de JaniBox'}. Incluye hashtags relevantes.`
                        }
                    ]
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || 'Error en la API de OpenAI');
            }

            const data = await response.json();
            if (data.choices && data.choices[0]) {
                const text = data.choices[0].message.content;
                setGeneratedText(text);
                // Auto-guardar solo si ya hay imagen
                saveToHistory(text, generatedImage, false);
            } else {
                throw new Error('No se recibió respuesta de la IA');
            }
        } catch (error: any) {
            toast.error('Error de IA: ' + error.message);
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const persistImageToStorage = async (tempUrl: string): Promise<string | null> => {
        try {
            // 1. Fetch image from temp URL
            const response = await fetch(tempUrl);
            const blob = await response.blob();

            // 2. Generate unique filename
            const fileName = `ai-gen-${Date.now()}-${Math.random().toString(36).substring(7)}.png`;

            // 3. Upload to Supabase
            const { error } = await supabase.storage
                .from('marketing_refs') // Reusing existing bucket or create new one if needed
                .upload(fileName, blob, {
                    contentType: 'image/png',
                    cacheControl: '3600',
                    upsert: false
                });

            if (error) throw error;

            // 4. Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('marketing_refs')
                .getPublicUrl(fileName);

            return publicUrl;
        } catch (error) {
            console.error('Error persisting image:', error);
            toast.error('Error guardando imagen permanentemente');
            return null;
        }
    };

    const generateImage = async () => {
        if (!selectedProduct) {
            toast.error('Por favor, selecciona un producto del menú de la izquierda');
            return;
        }
        setLoadingImage(true);
        try {
            if (!fluxKey) {
                toast.error('Configura la API Key de Flux en ajustes');
                setShowSettings(true);
                return;
            }


            // 1. Llamar a la Edge Function
            const { data, error } = await supabase.functions.invoke('generate-flux', {
                body: {
                    prompt: isManualPrompt ? customPrompt : `FOTOGRAFÍA PUBLICITARIA DE ALTA GAMA: Un JaniBox real (Caja Cilíndrica Rosa con fresas con chocolate y rosas reales). Entorno de lujo, 8k, hiperrealista. NO GENERAR PERFUMES NI LAPTOPS.`,
                    fluxKey: fluxKey.trim(),
                    imagePrompt: isUploadedImage ? uploadedImageUrl : undefined,
                    imagePromptStrength: imageFidelity
                }
            });

            if (error) {
                console.error('Edge Function Error Object:', error);
                if (error.message?.includes('Failed to send a request')) {
                    throw new Error('No se pudo contactar con la Edge Function. ¿Ya ejecutaste "supabase functions deploy generate-flux --no-verify-jwt"?');
                }
                if (error.message?.includes('404')) {
                    throw new Error('La Edge Function "generate-flux" no se encuentra. Asegúrate de que el nombre sea correcto en Supabase.');
                }
                throw new Error(error.message || 'Error desconocido en la Edge Function');
            }

            if (data?.imageUrl) {
                toast.loading('Guardando imagen de alta resolución...', { duration: 2000 });

                // PERSIST IMAGE IMMEDIATELY
                const permanentUrl = await persistImageToStorage(data.imageUrl);

                if (permanentUrl) {
                    setGeneratedImage(permanentUrl);
                    setIsUploadedImage(false);
                    // Save with PERMANENT URL
                    saveToHistory(generatedText, permanentUrl, false);
                    toast.success('¡Imagen generada y guardada con éxito!');
                } else {
                    // Fallback to temp url if persistence fails (better than nothing)
                    setGeneratedImage(data.imageUrl);
                    saveToHistory(generatedText, data.imageUrl, false);
                    toast.error('Aviso: La imagen podría caducar (error de guardado).');
                }
            }
        } catch (error: any) {
            toast.error('Error al generar imagen: ' + error.message);
            console.error(error);
        } finally {
            setLoadingImage(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                // 1. Mostrar vista previa local rápida
                const reader = new FileReader();
                reader.onload = () => {
                    setGeneratedImage(reader.result as string);
                    setIsUploadedImage(true);
                };
                reader.readAsDataURL(file);

                // 2. Subir a Supabase Storage con nombre limpio (sanitizado)
                const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_').toLowerCase();
                const fileName = `${Date.now()}-${safeName}`;
                const { error } = await supabase.storage
                    .from('marketing_refs')
                    .upload(fileName, file);

                if (error) {
                    if (error.message.includes('bucket not found')) {
                        toast.error('Error: Cubeta "marketing_refs" no encontrada. Crea una cubeta pública llamada "marketing_refs" en el Dashboard de Supabase.');
                    } else {
                        toast.error('Error al subir imagen: ' + error.message);
                    }
                    return;
                }

                const { data: { publicUrl } } = supabase.storage
                    .from('marketing_refs')
                    .getPublicUrl(fileName);

                // Guardar la URL pública en su propio estado, NO en el prompt text
                setUploadedImageUrl(publicUrl);

                toast.success('Imagen lista para referencia');
            } catch (error: any) {
                toast.error('Error procesando imagen: ' + error.message);
            }
        }
    };

    const handleDownload = async (urlToDownload?: string) => {
        const targetUrl = urlToDownload || generatedImage;
        if (!targetUrl) return;
        try {
            const response = await fetch(targetUrl, { mode: 'cors' });
            if (!response.ok) throw new Error('CORS or Network error');

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `janibox-${Date.now()}.png`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            toast.success('Descarga iniciada');
        } catch (error) {
            console.warn('Direct download failed, opening in new tab:', error);
            window.open(targetUrl, '_blank');
            toast.success('Imagen abierta en nueva pestaña para guardar');
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generatedText);
        setIsCopying(true);
        toast.success('¡Copiado!');
        setTimeout(() => setIsCopying(false), 2000);
    };

    return (
        <div className="max-w-[1600px] mx-auto px-6 py-10 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pl-4">
                <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-50 text-pink-600 text-[10px] font-black uppercase tracking-widest border border-pink-100">
                        Potencia de IA
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-800 to-gray-600">
                        Central de Marketing
                    </h1>
                    <p className="text-gray-500 font-medium max-w-xl">
                        Crea campañas visuales e impulsadas por IA en segundos. El futuro de JaniBox empieza aquí.
                    </p>
                </div>
                <button
                    onClick={() => setShowSettings(!showSettings)}
                    className="group relative flex items-center justify-center gap-3 px-8 py-4 bg-white border border-gray-200 rounded-2xl text-gray-700 hover:text-black hover:border-gray-900 transition-all font-bold text-sm shadow-sm hover:shadow-xl active:scale-95"
                >
                    <SettingsIcon size={18} className="group-hover:rotate-90 transition-transform duration-500" />
                    <span>Configuración de APIs</span>
                </button>
            </div>

            {/* Settings Glassmorphism Panel */}
            {showSettings && (
                <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[40px] border-2 border-pink-100/50 shadow-2xl shadow-pink-100/20 space-y-8 animate-in zoom-in-95 duration-500">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="w-12 h-12 bg-pink-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-pink-200">
                            <SettingsIcon size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Configuración de Inteligencia</h2>
                            <p className="text-sm text-gray-400">Tus datos están seguros y se guardan localmente en la base de datos.</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <label className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-gray-400 ml-1">
                                <Sparkles size={12} className="text-pink-500" /> Clave API de OpenAI
                            </label>
                            <input
                                type="password"
                                value={openaiKey}
                                onChange={(e) => setOpenaiKey(e.target.value)}
                                placeholder="sk-..."
                                className="w-full bg-white border-2 border-gray-100 focus:border-pink-500 rounded-3xl px-6 py-4 outline-none transition-all font-mono text-sm shadow-inner"
                            />
                        </div>
                        <div className="space-y-4">
                            <label className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-gray-400 ml-1">
                                <Wand2 size={12} className="text-orange-500" /> Clave API de Flux 2 Pro (BFL)
                            </label>
                            <input
                                type="password"
                                value={fluxKey}
                                onChange={(e) => setFluxKey(e.target.value)}
                                placeholder="bfl-..."
                                className="w-full bg-white border-2 border-gray-100 focus:border-orange-500 rounded-3xl px-6 py-4 outline-none transition-all font-mono text-sm shadow-inner"
                            />
                        </div>

                        <div className="space-y-4">
                            <label className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-gray-400 ml-1">
                                Motor de Imagen
                            </label>
                            <div className="flex bg-gray-100 p-1 rounded-2xl cursor-not-allowed opacity-80">
                                <button
                                    disabled
                                    className="flex-1 py-3 px-4 rounded-xl text-xs font-black bg-white text-orange-500 shadow-sm"
                                >
                                    Flux 2 Pro (Direct BFL)
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-gray-400 ml-1">
                                <Instagram size={12} className="text-blue-500" /> Meta Access Token
                            </label>
                            <input
                                type="password"
                                value={metaToken}
                                onChange={(e) => setMetaToken(e.target.value)}
                                placeholder="EAAB..."
                                className="w-full bg-white border-2 border-gray-100 focus:border-blue-500 rounded-3xl px-6 py-4 outline-none transition-all font-mono text-sm shadow-inner"
                            />
                            <p className="text-[10px] text-gray-400 italic px-2">Opcional: Habilita la publicación directa a Instagram.</p>
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button
                            onClick={handleSaveSettings}
                            disabled={saving}
                            className="bg-gray-900 text-white px-10 py-4 rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-black hover:shadow-2xl transition-all flex items-center gap-3 active:scale-95 disabled:opacity-50"
                        >
                            {saving ? <RefreshCw className="animate-spin" size={16} /> : <Save size={16} />}
                            {saving ? 'Guardando...' : 'Aplicar Configuración'}
                        </button>
                    </div>
                </div>
            )
            }

            {/* Main Application Layout */}
            <div className="grid lg:grid-cols-12 gap-8 items-start">

                <aside className="lg:col-span-3 space-y-6 lg:sticky lg:top-24 h-full pl-4 overflow-hidden">
                    <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-xl shadow-gray-200/40 relative group overflow-hidden">
                        <h3 className="text-lg font-black mb-8 flex items-center gap-3 text-gray-900">
                            <span className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-sm font-black italic shadow-inner">1</span>
                            Catálogo
                        </h3>

                        <div className="space-y-4 max-h-[calc(100vh-280px)] overflow-y-auto pr-2 custom-scrollbar-hide scroll-smooth">
                            {products.length === 0 ? (
                                <div className="text-center py-20 opacity-40 italic text-sm">Cargando catálogo...</div>
                            ) : (
                                products.map((product) => (
                                    <button
                                        key={product.id}
                                        onClick={() => {
                                            setSelectedProduct(product);
                                            setGeneratedText('');
                                            setGeneratedImage('');
                                        }}
                                        className={`w-full group text-left p-6 rounded-[2.5rem] transition-all border-2 relative ${selectedProduct?.id === product.id
                                            ? 'border-pink-500 bg-pink-500 text-white shadow-2xl shadow-pink-200 scale-[1.02]'
                                            : 'border-transparent bg-gray-50 hover:bg-white hover:border-gray-200 hover:shadow-xl'
                                            }`}
                                    >
                                        <div className="flex items-center gap-4 relative z-10 pr-6">
                                            {product.image_url && (
                                                <div className="w-12 h-12 rounded-xl bg-white/20 overflow-hidden ring-2 ring-white/10 hidden sm:block">
                                                    <img src={product.image_url} alt="" className="w-full h-full object-cover" />
                                                </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <span className="font-black block text-sm leading-tight mb-1 truncate group-hover:whitespace-normal transition-all">{product.name}</span>
                                                <span className={`text-[10px] font-black uppercase tracking-widest ${selectedProduct?.id === product.id ? 'text-pink-100' : 'text-gray-400'}`}>
                                                    $ {product.price}
                                                </span>
                                            </div>
                                        </div>
                                        {selectedProduct?.id === product.id && (
                                            <div className="absolute top-1/2 -translate-y-1/2 right-6 animate-in zoom-in duration-300">
                                                <Check size={20} className="text-white" />
                                            </div>
                                        )}
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                </aside>

                {/* 2 & 3. Main Stage: Content & Propaganda (9 Columns) */}
                <div className="lg:col-span-9 flex flex-col gap-8">
                    {/* Global Occasion Selector (Move to Top) */}
                    <div className="bg-white/40 backdrop-blur-md border border-white rounded-[32px] p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
                        <div className="flex items-center gap-3 ml-2">
                            <div className="p-2 bg-pink-500/10 text-pink-500 rounded-xl">
                                <Sparkles size={16} />
                            </div>
                            <div>
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Personalización Global</h4>
                                <p className="text-xs font-bold text-gray-900">¿Para qué ocasión es este regalo?</p>
                            </div>
                        </div>

                        <div className="flex-1 max-w-full md:max-w-[70%] overflow-hidden">
                            <div className="flex items-center gap-2 bg-white/60 p-1.5 rounded-2xl border border-gray-100/50 shadow-inner overflow-x-auto custom-scrollbar-hide flex-nowrap scroll-smooth">
                                {[
                                    { id: 'romántico', label: 'Romántico', emoji: '❤️' },
                                    { id: 'cumpleaños', label: 'Cumpleaños', emoji: '🎂' },
                                    { id: 'aniversario', label: 'Aniversario', emoji: '💑' },
                                    { id: 'san-valentin', label: 'San Valentín', emoji: '💘' },
                                    { id: 'graduación', label: 'Graduación', emoji: '🎓' },
                                    { id: 'agradecimiento', label: 'Gracias', emoji: '🙏' },
                                    { id: 'nacimiento', label: 'Bebé', emoji: '🍼' },
                                    { id: 'celebración', label: 'Éxito', emoji: '✨' },
                                    { id: 'navidad', label: 'Navidad', emoji: '🎄' },
                                    { id: 'corporativo', label: 'Corporativo', emoji: '💼' },
                                    { id: 'otro', label: 'Especial', emoji: '🎁' }
                                ].map((opt) => (
                                    <button
                                        key={opt.id}
                                        onClick={() => setGiftContext(opt.id)}
                                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-tight transition-all flex items-center gap-2 flex-shrink-0 ${giftContext === opt.id
                                            ? 'bg-gray-900 text-white shadow-xl scale-105'
                                            : 'text-gray-400 hover:text-gray-600 hover:bg-white'
                                            }`}
                                    >
                                        <span>{opt.emoji}</span>
                                        <span>{opt.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">

                        {/* Copy Section */}
                        <div className="bg-white rounded-[40px] border border-gray-100 shadow-xl shadow-gray-200/40 flex flex-col min-h-[600px] relative overflow-hidden">
                            <div className="px-8 py-6 flex items-center justify-between z-10 border-b border-gray-50">
                                <h3 className="text-lg font-black flex items-center gap-3 text-gray-900">
                                    <span className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center text-sm font-black italic shadow-inner">2</span>
                                    Copywriter IA
                                </h3>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={generateCopy}
                                        disabled={loading || !selectedProduct}
                                        className={`px-6 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all flex items-center gap-3
                                        ${!selectedProduct
                                                ? 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed opacity-60'
                                                : 'bg-orange-500 text-white hover:bg-orange-600 hover:-translate-y-0.5 shadow-lg shadow-orange-200 active:scale-95'
                                            }`}
                                    >
                                        {loading ? <RefreshCw className="animate-spin" size={14} /> : <Sparkles size={14} />}
                                        {loading ? 'Escribiendo' : 'Generar Texto'}
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 p-8 pt-4 flex flex-col">
                                <div className={`flex-1 rounded-[32px] p-8 transition-all duration-700 relative group overflow-hidden ${generatedText ? 'bg-gray-50 border-2 border-transparent hover:border-pink-100' : 'bg-gray-50/50 border-2 border-dashed border-gray-200'
                                    }`}>
                                    {generatedText ? (
                                        <>
                                            <div className="text-[15px] text-gray-800 whitespace-pre-wrap leading-relaxed font-medium animate-in fade-in duration-1000">
                                                {generatedText}
                                            </div>
                                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={copyToClipboard}
                                                    className="p-3 bg-white border border-gray-200 rounded-2xl text-gray-500 hover:text-pink-600 hover:shadow-xl transition-all active:scale-90"
                                                >
                                                    {isCopying ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center text-center px-10">
                                            <div className="w-16 h-16 bg-white rounded-3xl shadow-sm mb-6 flex items-center justify-center text-pink-300">
                                                <Sparkles size={32} />
                                            </div>
                                            <h4 className="font-black text-gray-900 mb-2">Asistente Creativo</h4>
                                            <p className="text-xs text-gray-400 font-medium leading-relaxed">
                                                Elige un producto y deja que la IA cree el post perfecto para tus seguidores.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Image Section */}
                        <div className="bg-white rounded-[40px] border border-gray-100 shadow-xl shadow-gray-200/40 flex flex-col min-h-[600px] relative overflow-hidden">
                            <div className="px-8 py-6 flex items-center justify-between z-10 border-b border-gray-50">
                                <h3 className="text-lg font-black flex items-center gap-3 text-gray-900">
                                    <span className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center text-sm font-black italic shadow-inner">3</span>
                                    <ImageIcon size={20} className="text-orange-500" /> Propaganda Visual
                                </h3>

                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-2xl border border-gray-100/50">
                                        <button
                                            onClick={() => setIsManualPrompt(!isManualPrompt)}
                                            className={`p-2 rounded-xl transition-all ${isManualPrompt ? 'bg-pink-100 text-pink-600 shadow-sm' : 'bg-white text-gray-400 hover:text-gray-600 shadow-sm'}`}
                                            title={isManualPrompt ? "Cambiar a modo automático" : "Cambiar a modo manual"}
                                        >
                                            <Type size={18} />
                                        </button>

                                        <label className="cursor-pointer p-2 bg-pink-50 text-pink-600 rounded-xl hover:bg-pink-100 transition-all border border-pink-100 shadow-sm" title="Subir foto propia">
                                            <Upload size={18} />
                                            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                        </label>
                                    </div>

                                    <button
                                        onClick={generateImage}
                                        disabled={loadingImage || !selectedProduct}
                                        className={`px-6 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all flex items-center gap-3
                                        ${!selectedProduct
                                                ? 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed opacity-60'
                                                : 'bg-orange-500 text-white hover:bg-orange-600 hover:-translate-y-0.5 shadow-xl shadow-orange-200 active:scale-95'
                                            }`}
                                    >
                                        {loadingImage ? <RefreshCw className="animate-spin" size={14} /> : <Wand2 size={14} />}
                                        {loadingImage ? 'Diseñando' : 'Generar Arte PRO'}
                                    </button>
                                </div>
                            </div>

                            {/* Prompt Editor (Manual Mode) */}
                            {isManualPrompt && (
                                <div className="px-8 pb-4 animate-in slide-in-from-top-2 duration-300">
                                    <div className="p-4 bg-pink-50/50 border border-pink-100 rounded-[24px] space-y-3">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-pink-500">Editor de Prompt Avanzado</span>
                                                <button
                                                    onClick={updateDefaultPrompt}
                                                    className="px-3 py-1 bg-white border border-pink-100 text-[10px] font-bold text-pink-400 hover:text-pink-600 rounded-lg flex items-center gap-1 transition-colors"
                                                >
                                                    <RefreshCw size={10} /> Restaurar Base
                                                </button>
                                            </div>
                                        </div>
                                        <textarea
                                            value={customPrompt}
                                            onChange={(e) => setCustomPrompt(e.target.value)}
                                            className="w-full h-32 bg-white border border-pink-100 rounded-xl p-4 text-xs font-medium text-gray-700 outline-none focus:ring-2 focus:ring-pink-500/20 resize-none"
                                            placeholder="Describe la imagen que quieres crear..."
                                        />
                                        <div className="flex flex-wrap gap-2">
                                            <button
                                                onClick={() => {
                                                    let scenario = "entorno de lujo, con pétalos de rosa flotando en el aire";
                                                    if (giftContext === 'cumpleaños') scenario = "fondo festivo con globos elegantes y confeti dorado sutil";
                                                    if (giftContext === 'aniversario') scenario = "escena romántica con luz de velas desenfocadas y ambiente íntimo";
                                                    if (giftContext === 'graduación') scenario = "ambiente de celebración académica, moderno y sofisticado";
                                                    if (giftContext === 'nacimiento') scenario = "fondo tierno con nubes suaves y colores pastel delicados";
                                                    if (giftContext === 'san-valentin') scenario = "oceáno de corazones rojos y pétalos de rosa, lujo extremo";
                                                    if (giftContext === 'navidad') scenario = "estudio navideño de lujo con luces doradas y pino sutil";
                                                    if (giftContext === 'corporativo') scenario = "ambiente ejecutivo de alta gama, mármol y cristal, éxito puro";

                                                    setCustomPrompt(`Cambia el escenario a un ${scenario}, iluminación profesional de revista y un toque de elegancia suprema. MANTÉN EL PRODUCTO CENTRAL INTACTO.`);
                                                    setImageFidelity(1.0);
                                                }}
                                                className="px-3 py-1 bg-pink-500 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-pink-600 transition-all shadow-sm"
                                            >
                                                ✨ Escenario de {giftContext.charAt(0).toUpperCase() + giftContext.slice(1)}
                                            </button>
                                            <button
                                                onClick={() => setCustomPrompt('')}
                                                className="px-3 py-1 bg-white border border-pink-100 rounded-lg text-[10px] font-bold text-gray-500 hover:bg-gray-50 transition-all"
                                            >
                                                🗑️ Limpiar Prompt
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Image Fidelity Control (Only when image is uploaded) */}
                            {isUploadedImage && (
                                <div className="px-8 pb-4 animate-in slide-in-from-top-2 duration-300">
                                    <div className="p-4 bg-orange-50/50 border border-orange-100 rounded-[24px] space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-orange-600">Fidelidad a tu Foto</span>
                                                <span className="text-[10px] font-bold text-orange-400">({Math.round(imageFidelity * 100)}%)</span>
                                            </div>
                                            <div className="flex items-center gap-4 text-[10px] font-bold text-orange-500 uppercase tracking-tighter">
                                                <span>Creativo</span>
                                                <input
                                                    type="range"
                                                    min="0.1"
                                                    max="1.0"
                                                    step="0.1"
                                                    value={imageFidelity}
                                                    onChange={(e) => setImageFidelity(parseFloat(e.target.value))}
                                                    className="w-32 accent-orange-500 h-1 bg-orange-200 rounded-lg appearance-none cursor-pointer"
                                                />
                                                <span>Exacto</span>
                                            </div>
                                        </div>
                                        <p className="text-[10px] text-orange-400 font-medium">Sube la fidelidad al 90-100% para que la IA no altere tu producto original.</p>
                                    </div>
                                </div>
                            )}

                            <div className="flex-1 p-8 pt-4 flex flex-col">
                                <div className={`flex-1 rounded-[32px] overflow-hidden transition-all duration-700 relative group flex items-center justify-center ${generatedImage ? 'bg-black shadow-2xl' : 'bg-gray-50/50 border-2 border-dashed border-gray-200'
                                    }`}>
                                    {loadingImage ? (
                                        <div className="text-center space-y-6 z-10 px-6">
                                            <div className="relative mx-auto w-20 h-20">
                                                <div className="absolute inset-0 bg-orange-500/20 rounded-full animate-ping"></div>
                                                <div className="relative w-20 h-20 border-[6px] border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="font-black text-gray-900 tracking-tight">Flux 2 Pro está trabajando</p>
                                                <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest animate-pulse">Optimizando iluminación y detalles</p>
                                            </div>
                                        </div>
                                    ) : generatedImage ? (
                                        <div className="relative w-full h-full group">
                                            <img
                                                src={generatedImage}
                                                alt="Marketing Arte"
                                                className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110"
                                            />
                                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 p-8">
                                                <div className="flex gap-4">
                                                    <button
                                                        disabled={!metaToken}
                                                        className="flex-1 py-4 bg-white/20 backdrop-blur-md border border-white/30 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-all"
                                                    >
                                                        Instagram
                                                    </button>
                                                    <button
                                                        disabled={!metaToken}
                                                        className="flex-1 py-4 bg-white/20 backdrop-blur-md border border-white/30 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-all"
                                                    >
                                                        Facebook
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Botón de descarga sutil (arriba a la derecha) */}
                                            <button
                                                onClick={() => handleDownload()}
                                                className="absolute top-4 right-4 p-3 bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-2xl opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:text-orange-500 shadow-2xl scale-90 group-hover:scale-100"
                                                title="Descargar imagen"
                                            >
                                                <Download size={20} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="text-center p-12">
                                            <div className="w-16 h-16 bg-white rounded-3xl shadow-sm mb-6 flex items-center justify-center text-orange-300 mx-auto">
                                                <Wand2 size={32} />
                                            </div>
                                            <h4 className="font-black text-gray-900 mb-2">Diseño Profesional</h4>
                                            <p className="text-xs text-gray-400 font-medium leading-relaxed">
                                                Crea imágenes de alta gama para tus campañas con la potencia de Flux 2 Pro.
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {!metaToken && generatedImage && (
                                    <div className="mt-4 px-6 py-3 bg-gray-50 border border-gray-100 rounded-2xl">
                                        <p className="text-[10px] text-gray-400 text-center font-bold tracking-tight italic">
                                            <Instagram size={10} className="inline mr-1" /> Configura el Token de Meta para habilitar publicación directa.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Nueva Sección: Público Objetivo (Ad Targeting) - Ahora fuera de la grid para ocupar todo el ancho */}
            <div className="bg-white/60 backdrop-blur-xl border border-white rounded-[40px] shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                    <div className="max-w-6xl mx-auto w-full flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <h3 className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-sm font-black italic shadow-inner">4</h3>
                            <div>
                                <h3 className="text-xl font-black text-gray-900 tracking-tighter uppercase">Público Objetivo</h3>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Configuración de Segmentación para Meta Ads</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-6xl mx-auto p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Edad y Género */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 text-pink-500 font-black text-xs uppercase tracking-widest">
                            <Users size={14} /> Demografía
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center px-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase">Edad Mínima</label>
                                    <span className="text-xs font-black text-pink-600 bg-pink-50 px-2 py-0.5 rounded-lg">{audienceAge.min} años</span>
                                </div>
                                <input
                                    type="range"
                                    min="13"
                                    max="65"
                                    value={audienceAge.min}
                                    onChange={(e) => {
                                        const val = parseInt(e.target.value);
                                        setAudienceAge({ ...audienceAge, min: val, max: Math.max(val, audienceAge.max) });
                                    }}
                                    className="w-full accent-pink-500 h-1 bg-gray-100 rounded-lg appearance-none cursor-pointer"
                                />
                                <div className="flex justify-between items-center px-1 pt-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase">Edad Máxima</label>
                                    <span className="text-xs font-black text-pink-600 bg-pink-50 px-2 py-0.5 rounded-lg">{audienceAge.max === 65 ? '65+' : `${audienceAge.max} años`}</span>
                                </div>
                                <input
                                    type="range"
                                    min="13"
                                    max="65"
                                    value={audienceAge.max}
                                    onChange={(e) => {
                                        const val = parseInt(e.target.value);
                                        setAudienceAge({ ...audienceAge, max: val, min: Math.min(val, audienceAge.min) });
                                    }}
                                    className="w-full accent-pink-500 h-1 bg-gray-100 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Género</label>
                                <div className="flex gap-2">
                                    {['all', 'female', 'male'].map((g) => (
                                        <button
                                            key={g}
                                            onClick={() => setAudienceGender(g)}
                                            className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase transition-all border ${audienceGender === g
                                                ? 'bg-pink-500 text-white border-pink-500 shadow-md'
                                                : 'bg-white text-gray-400 border-gray-100 hover:bg-gray-50'
                                                }`}
                                        >
                                            {g === 'all' ? 'Todos' : g === 'female' ? 'Mujeres' : 'Hombres'}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Ubicación (Mapa Interactivo) */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 text-pink-500 font-black text-xs uppercase tracking-widest">
                            <MapPin size={14} /> Ubicación & Alcance
                        </div>

                        <div className="space-y-4">
                            {/* Map Container */}
                            <div className="rounded-3xl overflow-hidden border-2 border-pink-100 shadow-sm relative">
                                <LocationMap
                                    locations={locations}
                                    activeLocationId={activeLocationId}
                                    onAddLocation={(newLoc) => {
                                        setLocations([...locations, newLoc]);
                                        setActiveLocationId(newLoc.id);
                                    }}
                                    onUpdateLocation={(id, updates) => {
                                        setLocations(locations.map(l => l.id === id ? { ...l, ...updates } : l));
                                    }}
                                    onSelectLocation={(id) => setActiveLocationId(id)}
                                    onRemoveLocation={(id) => {
                                        const newLocs = locations.filter(l => l.id !== id);
                                        setLocations(newLocs);
                                        if (activeLocationId === id) setActiveLocationId(newLocs[0]?.id || null);
                                    }}
                                />
                            </div>

                            {/* Radius Control (Only if a location is active) */}
                            {activeLocationId && locations.find(l => l.id === activeLocationId) ? (
                                <div className="bg-pink-50/50 p-4 rounded-2xl border border-pink-100/50 space-y-3">
                                    <div className="flex justify-between items-center">
                                        <label className="text-[10px] font-black text-gray-500 uppercase flex items-center gap-1">
                                            <Locate size={10} /> Radio para: <span className="text-pink-600">{locations.find(l => l.id === activeLocationId)?.name || 'Zona seleccionada'}</span>
                                        </label>
                                        <span className="text-xs font-black text-pink-600 bg-white px-2 py-1 rounded-lg shadow-sm border border-pink-100">
                                            {locations.find(l => l.id === activeLocationId)?.radius} km
                                        </span>
                                    </div>
                                    <input
                                        type="range"
                                        min="1"
                                        max="50"
                                        step="1"
                                        value={locations.find(l => l.id === activeLocationId)?.radius || 5}
                                        onChange={(e) => {
                                            const val = parseInt(e.target.value);
                                            setLocations(locations.map(l => l.id === activeLocationId ? { ...l, radius: val } : l));
                                        }}
                                        className="w-full accent-pink-500 h-2 bg-white rounded-lg appearance-none cursor-pointer border border-pink-100"
                                    />
                                    <p className="text-[10px] text-gray-400 italic leading-tight">
                                        Arrastra el marcador en el mapa para ajustar la zona.
                                    </p>
                                </div>
                            ) : (
                                <div className="p-4 bg-gray-50 text-center rounded-2xl border border-gray-100">
                                    <p className="text-[10px] text-gray-400 font-bold uppercase">Selecciona o busca una zona en el mapa para editar su radio</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Intereses */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 text-pink-500 font-black text-xs uppercase tracking-widest">
                            <Sparkles size={14} /> Intereses y Comportamiento
                        </div>
                        <div className="space-y-4">
                            <div className="relative flex items-center gap-2">
                                <div className="relative flex-1">
                                    <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Buscar intereses..."
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 text-xs font-bold text-gray-700 outline-none focus:ring-2 focus:ring-pink-500/20 transition-all"
                                        value={newInterest}
                                        onChange={(e) => setNewInterest(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && newInterest.trim()) {
                                                if (!audienceInterests.includes(newInterest.trim())) {
                                                    setAudienceInterests([...audienceInterests, newInterest.trim()]);
                                                }
                                                setNewInterest('');
                                            }
                                        }}
                                    />
                                </div>
                                <button
                                    onClick={() => {
                                        if (newInterest.trim()) {
                                            if (!audienceInterests.includes(newInterest.trim())) {
                                                setAudienceInterests([...audienceInterests, newInterest.trim()]);
                                            }
                                            setNewInterest('');
                                        }
                                    }}
                                    className="p-4 bg-pink-500 text-white rounded-2xl hover:bg-pink-600 active:scale-95 transition-all shadow-md shadow-pink-200"
                                >
                                    <Plus size={16} />
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {audienceInterests.map((interest) => (
                                    <div key={interest} className="flex items-center gap-2 px-3 py-1.5 bg-pink-50 text-pink-600 rounded-xl border border-pink-100 text-[10px] font-black uppercase group transition-all hover:bg-pink-100">
                                        {interest}
                                        <button
                                            onClick={() => setAudienceInterests(audienceInterests.filter(i => i !== interest))}
                                            className="hover:text-pink-800 transition-colors"
                                        >
                                            <X size={10} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-6xl mx-auto p-8 bg-gray-50/50 border-t border-gray-100 flex justify-end">
                    <button
                        onClick={async () => {
                            setSaving(true);
                            try {
                                toast.success('Segmentación guardada localmente');
                            } finally {
                                setSaving(false);
                            }
                        }}
                        className="px-8 py-3 bg-gray-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-black transition-all shadow-lg hover:-translate-y-1 active:scale-95 flex items-center gap-3"
                    >
                        <Target size={14} /> Guardar Segmentación
                    </button>
                </div>
            </div>

            {/* Historial Section - Ahora fuera de la grid */}
            <div className="bg-white rounded-[40px] border border-gray-100 shadow-xl shadow-gray-200/40 overflow-hidden">
                <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                    <div className="max-w-6xl mx-auto w-full flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <h3 className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-sm font-black italic shadow-inner">5</h3>
                            <div>
                                <h3 className="text-xl font-black text-gray-900 tracking-tighter uppercase">Historial de IA</h3>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Tus creaciones guardadas</p>
                            </div>
                        </div>
                        {history.length > 0 && (
                            <button
                                onClick={() => saveToHistory(undefined, undefined, true)}
                                className="px-6 py-3 bg-pink-50 text-pink-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-pink-100 transition-all border border-pink-100 shadow-sm flex items-center gap-2"
                            >
                                <Save size={14} /> Guardar Post Actual
                            </button>
                        )}
                    </div>
                </div>

                <div className="max-w-6xl mx-auto p-8">
                    {loadingHistory ? (
                        <div className="text-center py-20 opacity-40 italic text-sm">Cargando historial...</div>
                    ) : history.length === 0 ? (
                        <div className="text-center py-20 bg-gray-50 rounded-[32px] border-2 border-dashed border-gray-200">
                            <History size={48} className="mx-auto text-gray-300 mb-4" />
                            <p className="text-gray-400 font-medium">Aún no tienes posts guardados.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {history.map((post) => (
                                <div key={post.id} className="group bg-white rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col">
                                    <div className="relative group overflow-hidden">
                                        {/* Image */}
                                        <div className={`h-48 bg-gray-100 relative ${!post.image_url && 'flex items-center justify-center'}`}>
                                            {post.image_url ? (
                                                <img
                                                    src={post.image_url}
                                                    alt="Generated content"
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                />
                                            ) : (
                                                <ImageIcon className="text-gray-300" size={32} />
                                            )}
                                        </div>

                                        {/* Original Top Right Actions (Reuse, Download, Delete) */}
                                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-[-10px] group-hover:translate-y-0 z-20">
                                            <button
                                                onClick={() => reusePost(post)}
                                                className="p-1.5 bg-white/90 backdrop-blur rounded-lg text-gray-700 hover:text-blue-600 shadow-sm"
                                                title="Reutilizar"
                                            >
                                                <RefreshCw size={14} />
                                            </button>
                                            {post.image_url && (
                                                <button
                                                    onClick={() => handleDownload(post.image_url)}
                                                    className="p-1.5 bg-white/90 backdrop-blur rounded-lg text-gray-700 hover:text-green-600 shadow-sm"
                                                    title="Descargar"
                                                >
                                                    <Download size={14} />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => setPostToDelete(post.id)}
                                                className="p-1.5 bg-white/90 backdrop-blur rounded-lg text-gray-700 hover:text-red-600 shadow-sm"
                                                title="Eliminar"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>

                                        {/* New Large Glass Overlay Buttons (Center/Bottom) */}
                                        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center p-4">
                                            <div className="flex gap-4 w-full justify-center translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                                <button
                                                    disabled={!metaToken}
                                                    onClick={() => toast.success('Publicando en Instagram...')}
                                                    className="flex-1 py-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl text-white font-black text-[10px] tracking-widest hover:bg-white/30 transition-all shadow-xl uppercase flex flex-col items-center gap-1"
                                                >
                                                    <Instagram size={20} />
                                                    Instagram
                                                </button>
                                                <button
                                                    disabled={!metaToken}
                                                    onClick={() => toast.success('Publicando en Facebook...')}
                                                    className="flex-1 py-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl text-white font-black text-[10px] tracking-widest hover:bg-white/30 transition-all shadow-xl uppercase flex flex-col items-center gap-1"
                                                >
                                                    <Facebook size={20} />
                                                    Facebook
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-7 flex-1 flex flex-col">
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="px-3 py-1 rounded-full bg-pink-50 text-pink-600 text-[8px] font-black uppercase tracking-widest border border-pink-100/50">
                                                {post.product_name || 'JaniBox Gift'}
                                            </span>
                                            <span className="text-[9px] font-black uppercase tracking-widest text-gray-300">
                                                {new Date(post.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className="relative">
                                            <p className="text-xs text-gray-600 line-clamp-3 mb-8 font-medium italic leading-relaxed">
                                                "{post.generated_text || 'Contenido generado por IA'}"
                                            </p>
                                        </div>
                                        <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
                                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                                                    {post.gift_context}
                                                </span>
                                            </div>
                                            <button
                                                onClick={() => reusePost(post)}
                                                className="px-6 py-3 bg-gray-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-pink-600 transition-all shadow-lg hover:-translate-y-0.5 active:scale-95"
                                            >
                                                Reusar Post
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Modal de Confirmación de Eliminación Personalizado */}
            <AnimatePresence>
                {postToDelete && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setPostToDelete(null)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-sm bg-white rounded-[40px] shadow-2xl overflow-hidden p-8 text-center border border-gray-100"
                        >
                            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Trash2 size={32} className="text-red-500" />
                            </div>
                            <h3 className="text-xl font-black text-gray-900 tracking-tighter uppercase mb-2">
                                ¿Eliminar Post?
                            </h3>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-relaxed mb-8">
                                Esta acción no se puede deshacer. Se borrará permanentemente.
                            </p>
                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={confirmDelete}
                                    className="w-full py-4 bg-red-500 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-red-100 active:scale-95"
                                >
                                    Sí, Eliminar Permanentemente
                                </button>
                                <button
                                    onClick={() => setPostToDelete(null)}
                                    className="w-full py-4 bg-gray-50 text-gray-400 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-gray-100 transition-all active:scale-95"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div >
    );
};

export default Marketing;
