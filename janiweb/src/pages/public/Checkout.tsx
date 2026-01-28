import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, CheckCircle, MapPin, Calendar, CreditCard, ShieldCheck, Truck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { supabase } from '../../lib/supabaseClient';
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

    // Form State
    const [address, setAddress] = useState('');
    const [date, setDate] = useState('');
    const [slot, setSlot] = useState('morning');
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [email, setEmail] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [addressDetails, setAddressDetails] = useState('');
    const [showErrors, setShowErrors] = useState(false);

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
            const { data, error } = await supabase.from('orders').insert([{
                user_email: email,
                customer_name: customerName,
                customer_phone: phoneNumber,
                total: cartTotal + 5,
                items: cart,
                delivery_address: address,
                address_details: addressDetails,
                delivery_slot: slot,
                delivery_date: date,
                payment_method: paymentMethod,
                status: 'received'
            }]).select();

            if (error) throw error;

            toast.success('¡Pedido realizado con éxito!');
            clearCart();
            navigate(`/confirmation/${data[0].id}`);
        } catch (error: any) {
            toast.error('Error al procesar el pedido: ' + error.message);
        } finally {
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
                                            { id: 'card', name: 'Tarjeta de Crédito', desc: 'Visa, Mastercard, AMEX', icon: <CreditCard size={20} /> },
                                            { id: 'paypal', name: 'PayPal', desc: 'Pago rápido y seguro', icon: <span className="font-bold italic">PP</span> },
                                            { id: 'transfer', name: 'Transferencia', desc: 'Directo de banco', icon: <CheckCircle size={20} /> }
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

                        <div className="space-y-4 border-t border-gray-50 pt-8">
                            <div className="flex justify-between text-sm text-gray-400">
                                <span className="font-medium uppercase tracking-widest text-[10px]">Subtotal</span>
                                <span className="font-serif italic font-light">${cartTotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-400">
                                <span className="font-medium uppercase tracking-widest text-[10px]">Envío</span>
                                <span className="font-serif italic font-light">$5.00</span>
                            </div>
                            <div className="flex justify-between border-t border-gray-50 pt-4 mt-4">
                                <span className="font-bold text-gray-900 uppercase tracking-widest text-[10px]">Total</span>
                                <span className="text-2xl font-serif italic text-primary font-light">${(cartTotal + 5).toFixed(2)}</span>
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
                                    {currentStep === 0 ? 'Continuar al Pago' : `Pagar $${(cartTotal + 5).toFixed(2)}`}
                                    <ChevronRight size={16} />
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Checkout;
