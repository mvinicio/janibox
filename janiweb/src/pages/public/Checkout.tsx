import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, CheckCircle, MapPin, Calendar, CreditCard, ShieldCheck, Truck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { supabase } from '../../lib/supabaseClient';
import { preparePayment } from '../../lib/payphone';
import toast from 'react-hot-toast';
import MapPicker from '../../components/public/MapPicker';

const steps = [
    { title: 'Entrega', icon: <Truck size={18} /> },
    { title: 'Pago', icon: <CreditCard size={18} /> }
];

const slots = [
    { id: 'morning', label: 'Mañana', time: '9:00 AM - 12:00 PM' },
    { id: 'afternoon', label: 'Tarde', time: '12:00 PM - 4:00 PM' },
    { id: 'evening', label: 'Noche', time: '4:00 PM - 8:00 PM' }
];

const Checkout = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const { cart, cartTotal, clearCart } = useCart();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const shippingCost = 0; // Updated to 0 as requested

    // Form State
    const [address, setAddress] = useState('');
    const [date, setDate] = useState('');
    const [slot, setSlot] = useState('morning');
    const [paymentMethod, setPaymentMethod] = useState('payphone'); // Default to PayPhone
    const [email, setEmail] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [addressDetails, setAddressDetails] = useState('');
    const [showErrors, setShowErrors] = useState(false);
    const [isPayPhoneEnabled, setIsPayPhoneEnabled] = useState(true);
    const [user, setUser] = useState<any>(null);

    // Reward System State
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
    const [discountAmount, setDiscountAmount] = useState(0);
    const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

    useEffect(() => {
        supabase.from('store_settings').select('payphone_enabled').single()
            .then(({ data }) => {
                const enabled = data?.payphone_enabled ?? true;
                setIsPayPhoneEnabled(enabled);
                // If disabled but selected, switch to transfer
                if (!enabled && paymentMethod === 'payphone') {
                    setPaymentMethod('transfer');
                }
            });

        // 1. Define Fetch Profile
        const fetchProfileData = async (userId: string, userEmail: string) => {
            setEmail(userEmail);
            const { data } = await supabase.from('profiles').select('*').eq('id', userId).single();
            if (data) {
                setCustomerName(prev => prev || data.full_name || '');
                setPhoneNumber(prev => prev || data.phone || '');
                setAddress(prev => prev || data.address || '');
                setAddressDetails(prev => prev || data.address_details || '');
            }
        };

        // 2. Initial Session Check
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                setUser(session.user);
                fetchProfileData(session.user.id, session.user.email || '');
            }
        });

        // 3. Auth Listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session) {
                setUser(session.user);
                fetchProfileData(session.user.id, session.user.email || '');
            } else {
                setUser(null);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleApplyCoupon = async () => {
        if (!couponCode) return;
        setIsValidatingCoupon(true);
        try {
            const { data, error } = await supabase
                .from('coupons')
                .select('*')
                .eq('code', couponCode.toUpperCase())
                .single();

            if (error || !data) {
                toast.error('Cupón no encontrado');
                setAppliedCoupon(null);
                setDiscountAmount(0);
                return;
            }

            // Validations
            const now = new Date();
            if (data.valid_until && new Date(data.valid_until) < now) {
                toast.error('El cupón ha expirado');
                return;
            }

            if (data.usage_limit && data.used_count >= data.usage_limit) {
                toast.error('El cupón ha alcanzado su límite de uso');
                return;
            }

            if (cartTotal < data.min_purchase) {
                toast.error(`Compra mínima de $${data.min_purchase} requerida`);
                return;
            }

            // Calculate Discount
            let discount = 0;
            if (data.discount_type === 'percentage') {
                discount = (cartTotal * (data.discount_value / 100));
                if (data.max_discount && discount > data.max_discount) {
                    discount = data.max_discount;
                }
            } else {
                discount = data.discount_value;
            }

            setAppliedCoupon(data);
            setDiscountAmount(discount);
            toast.success('Cupón aplicado con éxito', { icon: '🎉' });
        } catch (err) {
            toast.error('Error validando cupón');
        } finally {
            setIsValidatingCoupon(false);
        }
    };

    const handleGoogleLogin = async () => {
        toast('Conectando con Google...', { icon: '🔄' });
        console.log('Iniciando login con Google desde Checkout...');
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin
            }
        });
        if (error) {
            console.error('Error en signInWithOAuth:', error);
            toast.error('Error: ' + error.message);
        }
    };

    const isStepValid = () => {
        if (currentStep === 0) {
            return (
                customerName.length > 2 &&
                email.includes('@') &&
                phoneNumber.length > 7 &&
                address.length > 5 &&
                date
            );
        }
        return true;
    };

    const finalTotal = Math.max(0, cartTotal - discountAmount) + shippingCost;

    const handleNext = () => {
        if (isStepValid()) {
            if (currentStep === 0) setCurrentStep(1);
            setShowErrors(false);
        } else {
            setShowErrors(true);
            toast.error('Por favor, completa todos los campos requeridos');
        }
    };

    const handleSubmit = async () => {
        if (!isStepValid()) {
            setShowErrors(true);
            toast.error('Por favor, revisa los datos del pedido');
            return;
        }

        setLoading(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();

            // Auto-save profile
            if (session) {
                await supabase.from('profiles').update({
                    full_name: customerName,
                    phone: phoneNumber,
                    address: address,
                    address_details: addressDetails
                }).eq('id', session.user.id);
            }

            const { data, error } = await supabase.from('orders').insert([{
                user_id: session?.user?.id,
                user_email: email,
                customer_name: customerName,
                customer_phone: phoneNumber,
                total: finalTotal, // Use finalTotal
                subtotal: cartTotal,
                discount: discountAmount,
                coupon_code: appliedCoupon?.code,
                items: cart,
                delivery_address: address,
                address_details: addressDetails,
                delivery_slot: slot,
                delivery_date: date,
                payment_method: paymentMethod,
                status: 'received'
            }]).select();

            if (error) throw error;
            const order = data[0];

            // If coupon used, increment count
            if (appliedCoupon) {
                await supabase.rpc('increment_coupon_usage', { coupon_id: appliedCoupon.id });
            }

            if (paymentMethod === 'payphone') {
                try {
                    console.log('Sending to PayPhone...');
                    const payPhoneResponse = await preparePayment(finalTotal, order.id, email);
                    console.log('PayPhone Response:', payPhoneResponse);

                    if (payPhoneResponse && payPhoneResponse.payWithCard) {
                        // REDIRECT TO PAYPHONE HOSTED PAGE
                        window.location.href = payPhoneResponse.payWithCard;
                        return; // Stop execution, browser will navigate
                    } else {
                        // This should logically not happen if api checks pass
                        throw new Error("PayPhone did not return a payment URL");
                    }
                } catch (error: any) {
                    console.error(error);
                    toast.error('Error iniciando pago: ' + error.message);
                    setLoading(false);
                    return;
                }
            }

            toast.success('¡Pedido realizado con éxito!');
            clearCart();
            navigate(`/confirmation/${order.id}`);
        } catch (error: any) {
            toast.error('Error al procesar el pedido: ' + error.message);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FBFBFB] flex flex-col font-inter">
            {/* Nav */}
            <header className="fixed top-0 inset-x-0 h-24 bg-white border-b border-gray-100 z-50 px-8 flex items-center justify-between">
                <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-primary transition-colors">
                    <ChevronLeft size={24} />
                </button>
                <div className="flex items-center gap-3">
                    <span className="text-sm font-black tracking-[0.2em] uppercase">Confirmar Pedido</span>
                </div>
                <div className="w-6"></div>
            </header>

            <main className="mt-32 max-w-6xl mx-auto w-full px-8 pb-32 grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Left Column: Form */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Stepper */}
                    <div className="flex gap-4">
                        {steps.map((_s, idx) => (
                            <div key={idx} className={`flex-1 h-1 rounded-full transition-all duration-500 ${idx <= currentStep ? 'bg-primary' : 'bg-gray-200'}`} />
                        ))}
                    </div>

                    <AnimatePresence mode="wait">
                        {currentStep === 0 ? (
                            <motion.div
                                key="delivery"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="space-y-8 bg-white p-10 rounded-[48px] shadow-sm border border-gray-50"
                            >
                                <div className="space-y-6">
                                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Detalles de Entrega</h2>

                                    {!user && (
                                        <div className="bg-primary/5 border border-primary/10 p-6 rounded-[32px] mb-8 flex flex-col sm:flex-row items-center justify-between gap-6 transition-all animate-in fade-in slide-in-from-top-4 duration-700">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-primary shadow-sm">
                                                    <ShieldCheck size={24} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900 text-sm">¿Ya eres cliente?</p>
                                                    <p className="text-[10px] text-gray-500 font-medium uppercase tracking-widest">Inicia sesión para auto-completar</p>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={handleGoogleLogin}
                                                className="bg-white border-2 border-gray-100 px-6 py-3 rounded-2xl flex items-center gap-3 hover:border-primary/20 hover:bg-gray-50 transition-all group"
                                            >
                                                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-4 h-4" alt="Google" />
                                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-700">Con Google</span>
                                            </button>
                                        </div>
                                    )}

                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <label className="block">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block ml-1">Nombre Completo</span>
                                                <input
                                                    type="text"
                                                    value={customerName}
                                                    onChange={(e) => setCustomerName(e.target.value)}
                                                    className={`w-full bg-gray-50 border-2 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all ${showErrors && customerName.length <= 2 ? 'border-red-300 bg-red-50/30' : 'border-transparent'}`}
                                                    placeholder="Ej. Juan Pérez"
                                                />
                                                {showErrors && customerName.length <= 2 && (
                                                    <span className="text-[9px] text-red-500 font-bold uppercase tracking-wider mt-2 ml-1 block">Demasiado corto</span>
                                                )}
                                            </label>
                                            <label className="block">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block ml-1">Teléfono de Contacto</span>
                                                <input
                                                    type="tel"
                                                    value={phoneNumber}
                                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                                    className={`w-full bg-gray-50 border-2 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all ${showErrors && phoneNumber.length <= 7 ? 'border-red-300 bg-red-50/30' : 'border-transparent'}`}
                                                    placeholder="Ej. 0987654321"
                                                />
                                                {showErrors && phoneNumber.length <= 7 && (
                                                    <span className="text-[9px] text-red-500 font-bold uppercase tracking-wider mt-2 ml-1 block">Número inválido</span>
                                                )}
                                            </label>
                                        </div>

                                        <label className="block">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block ml-1">Tu Email</span>
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className={`w-full bg-gray-50 border-2 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all ${showErrors && !email.includes('@') ? 'border-red-300 bg-red-50/30' : 'border-transparent'}`}
                                                placeholder="ejemplo@correo.com"
                                            />
                                            {showErrors && !email.includes('@') && (
                                                <span className="text-[9px] text-red-500 font-bold uppercase tracking-wider mt-2 ml-1 block">Email inválido</span>
                                            )}
                                        </label>

                                        <label className="block">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block ml-1">Dirección de Entrega</span>
                                            <div className="relative mb-4">
                                                <input
                                                    type="text"
                                                    value={address}
                                                    onChange={(e) => setAddress(e.target.value)}
                                                    className={`w-full bg-gray-50 border-2 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all pl-12 ${showErrors && address.length <= 5 ? 'border-red-300 bg-red-50/30' : 'border-transparent'}`}
                                                    placeholder="Calle, Número, Ciudad..."
                                                />
                                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                            </div>
                                            {showErrors && address.length <= 5 && (
                                                <span className="text-[9px] text-red-500 font-bold uppercase tracking-wider mb-4 ml-1 block">Dirección muy corta</span>
                                            )}
                                            <MapPicker
                                                address={address}
                                                onAddressChange={(newAddr) => setAddress(newAddr)}
                                            />
                                        </label>

                                        <label className="block">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block ml-1">Detalles de Entrega (Apto, Piso, Referencias)</span>
                                            <input
                                                type="text"
                                                value={addressDetails}
                                                onChange={(e) => setAddressDetails(e.target.value)}
                                                className="w-full bg-gray-50 border-transparent rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                                placeholder="Ej. Torre 2, Apto 405. Puerta blanca."
                                            />
                                        </label>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <label className="block">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block ml-1">Fecha</span>
                                                <div className="relative">
                                                    <input
                                                        type="date"
                                                        value={date}
                                                        onChange={(e) => setDate(e.target.value)}
                                                        className={`w-full bg-gray-50 border-2 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all pl-12 ${showErrors && !date ? 'border-red-300 bg-red-50/30' : 'border-transparent'}`}
                                                    />
                                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                                </div>
                                                {showErrors && !date && (
                                                    <span className="text-[9px] text-red-500 font-bold uppercase tracking-wider mt-2 ml-1 block">Elige una fecha</span>
                                                )}
                                            </label>
                                            <label className="block">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block ml-1">Horario</span>
                                                <select
                                                    value={slot}
                                                    onChange={(e) => setSlot(e.target.value)}
                                                    className="w-full bg-gray-50 border-transparent rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none"
                                                >
                                                    {slots.map(s => (
                                                        <option key={s.id} value={s.id}>{s.label} ({s.time})</option>
                                                    ))}
                                                </select>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="payment"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8 bg-white p-10 rounded-[48px] shadow-sm border border-gray-50"
                            >
                                <div className="space-y-6">
                                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Método de Pago</h2>
                                    <div className="grid grid-cols-1 gap-4">
                                        {[
                                            ...(isPayPhoneEnabled ? [{ id: 'payphone', name: 'PayPhone', desc: 'Tarjeta de Crédito / Débito', icon: <CreditCard size={20} /> }] : []),
                                            { id: 'transfer', name: 'Transferencia Bancaria', desc: 'Directo de banco', icon: <CheckCircle size={20} /> }
                                        ].map(m => (
                                            <button
                                                key={m.id}
                                                onClick={() => setPaymentMethod(m.id)}
                                                className={`flex items-center gap-6 p-6 rounded-3xl border-2 transition-all text-left ${paymentMethod === m.id ? 'border-primary bg-primary/[0.02]' : 'border-gray-50 hover:border-gray-100'}`}
                                            >
                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${paymentMethod === m.id ? 'bg-primary text-white' : 'bg-gray-50 text-gray-400'}`}>
                                                    {m.icon}
                                                </div>
                                                <div className="flex-grow">
                                                    <p className="font-bold text-gray-900">{m.name}</p>
                                                    <p className="text-[11px] text-gray-400 uppercase tracking-widest">{m.desc}</p>
                                                </div>
                                                {paymentMethod === m.id && <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-white"><CheckCircle size={12} /></div>}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="pt-6 border-t border-gray-50 flex items-center gap-3 text-gray-400">
                                    <ShieldCheck size={16} />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Pago 100% Seguro con encriptación SSL</span>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>


                </div>

                {/* Right Column: Order Summary */}
                <div className="space-y-8">
                    <div className="bg-white p-8 rounded-[48px] shadow-lg border border-gray-50 sticky top-32">
                        <h3 className="text-xl font-bold text-gray-900 mb-8 border-b border-gray-50 pb-6 uppercase tracking-tight">Tu Pedido</h3>

                        <div className="space-y-6 max-h-[300px] overflow-y-auto mb-8 pr-2 custom-scrollbar">
                            {cart.map(item => (
                                <div key={item.id} className="flex gap-4">
                                    <img src={item.image_url} alt="" className="w-16 h-16 rounded-2xl object-cover bg-gray-50" />
                                    <div className="flex-grow">
                                        <p className="font-bold text-sm text-gray-800 line-clamp-1">{item.name}</p>
                                        <p className="text-xs text-gray-400">{item.quantity} x ${item.price.toFixed(2)}</p>
                                    </div>
                                    <span className="font-serif italic text-sm text-gray-500">${(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>

                        <div className="mb-8 pt-6 border-t border-gray-50">
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4 block ml-1">¿Tienes un cupón?</span>
                            <div className="grid grid-cols-[1fr,auto] gap-2">
                                <input
                                    type="text"
                                    value={couponCode}
                                    onChange={(e) => setCouponCode(e.target.value)}
                                    disabled={!!appliedCoupon}
                                    placeholder="CÓDIGO"
                                    className="w-full bg-gray-50 border-2 border-transparent rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all uppercase font-bold placeholder:text-gray-300 h-[56px]"
                                />
                                {appliedCoupon ? (
                                    <button
                                        type="button"
                                        onClick={() => { setAppliedCoupon(null); setDiscountAmount(0); setCouponCode(''); }}
                                        className="bg-red-50 text-red-500 px-6 rounded-2xl flex items-center justify-center hover:bg-red-100 transition-all font-black text-[10px] uppercase tracking-widest h-[56px] border-2 border-transparent"
                                    >
                                        Quitar
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={handleApplyCoupon}
                                        disabled={isValidatingCoupon || !couponCode}
                                        className="bg-gray-900 text-white px-8 rounded-2xl flex items-center justify-center hover:bg-black disabled:bg-gray-50 disabled:text-gray-200 transition-all font-black text-[10px] uppercase tracking-widest h-[56px] border-2 border-transparent"
                                    >
                                        {isValidatingCoupon ? '...' : 'Aplicar'}
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="space-y-4 border-t border-gray-50 pt-8">
                            <div className="flex justify-between text-sm text-gray-400">
                                <span className="font-medium uppercase tracking-widest text-[10px]">Subtotal</span>
                                <span className="font-serif italic font-light">${cartTotal.toFixed(2)}</span>
                            </div>
                            {discountAmount > 0 && (
                                <div className="flex justify-between text-sm text-primary">
                                    <span className="font-medium uppercase tracking-widest text-[10px]">Descuento ({appliedCoupon?.code})</span>
                                    <span className="font-serif italic font-light">-${discountAmount.toFixed(2)}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-sm text-gray-400">
                                <span className="font-medium uppercase tracking-widest text-[10px]">Envío</span>
                                <span className="font-serif italic font-light">${shippingCost.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between border-t border-gray-50 pt-4 mt-4">
                                <span className="font-bold text-gray-900 uppercase tracking-widest text-[10px]">Total</span>
                                <span className="text-2xl font-serif italic text-primary font-light">${finalTotal.toFixed(2)}</span>
                            </div>
                        </div>

                        <button
                            disabled={loading}
                            onClick={currentStep === 0 ? handleNext : handleSubmit}
                            className={`w-full mt-10 py-5 rounded-full font-black uppercase tracking-[0.2em] text-[10px] transition-all flex items-center justify-center gap-3 shadow-2xl ${!loading ? 'bg-primary text-white shadow-primary/30 hover:scale-[1.02] active:scale-95' : 'bg-gray-100 text-gray-300 shadow-none cursor-not-allowed'
                                }`}
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    {currentStep === 0 ? 'Continuar al Pago' : (
                                        paymentMethod === 'payphone' ? 'Confirmar Pedido' : `Pagar $${finalTotal.toFixed(2)}`
                                    )}
                                    <ChevronRight size={16} />
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </main >
        </div >
    );
};

export default Checkout;
