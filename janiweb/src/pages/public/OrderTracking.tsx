import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Truck, Package, CheckCircle2, MapPin, ShieldCheck, Heart, User } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import MapPicker from '../../components/public/MapPicker';

const OrderTracking = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .eq('id', orderId)
                .single();

            if (!error && data) {
                setOrder(data);
            }
            setLoading(false);
        };

        fetchOrder();

        // Subscribe to changes
        const channels = supabase.channel('order-status')
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'orders', filter: `id=eq.${orderId}` }, (payload) => {
                setOrder(payload.new);
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channels);
        };
    }, [orderId]);

    if (loading) return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
    );

    if (!order) return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8">
            <h2 className="text-2xl font-bold mb-4">Orden no encontrada</h2>
            <button onClick={() => navigate('/')} className="text-primary font-bold">Volver al inicio</button>
        </div>
    );

    const statuses = ['received', 'preparing', 'out_for_delivery', 'delivered'];
    const currentStatusIndex = statuses.indexOf(order.status);

    const getFormattedTime = (minutesToAdd: number) => {
        const date = new Date(order.created_at);
        date.setMinutes(date.getMinutes() + minutesToAdd);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const timeline = [
        { id: 'received', title: 'Orden Recibida', icon: <Package size={20} />, time: getFormattedTime(0) },
        { id: 'preparing', title: 'Preparando tu JaniBox', icon: <Heart size={20} />, time: getFormattedTime(15) },
        { id: 'out_for_delivery', title: 'En Camino', icon: <Truck size={20} />, time: getFormattedTime(45) },
        { id: 'delivered', title: 'Entregado con Amor', icon: <CheckCircle2 size={20} />, time: getFormattedTime(60) }
    ];

    return (
        <div className="min-h-screen bg-[#FBFBFB] flex flex-col font-inter">
            {/* Header */}
            <header className="bg-white border-b border-gray-100 p-8 flex items-center justify-between sticky top-0 z-50">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-primary transition-colors text-xs font-black uppercase tracking-[0.2em]">
                    <ChevronLeft size={16} /> Volver
                </button>
                <div className="text-center">
                    <p className="text-[10px] uppercase font-black tracking-widest text-primary mb-1">Rastreo de Orden</p>
                    <h1 className="text-xl font-bold text-gray-900">Orden #{order.id.slice(-8).toUpperCase()}</h1>
                </div>
                <div className="w-20"></div>
            </header>

            <main className="flex-grow p-8 max-w-5xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 mt-8">
                {/* Left: Map Mockup */}
                <div className="space-y-8">
                    <div className="h-[400px]">
                        <MapPicker address={order.delivery_address} readOnly={true} />
                    </div>

                    <div className="bg-white p-8 rounded-[48px] border border-gray-50 flex items-center gap-6 shadow-sm">
                        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary/20 bg-primary/5 flex items-center justify-center text-primary">
                            <User size={32} />
                        </div>
                        <div className="flex-grow">
                            <p className="text-[10px] font-black tracking-widest uppercase text-gray-400">Asistente asignado</p>
                            <h3 className="text-lg font-bold text-gray-900 tracking-tight">Especialista JaniBox</h3>
                        </div>
                        <button className="bg-primary text-white p-4 rounded-2xl shadow-lg shadow-primary/20 hover:scale-110 active:scale-95 transition-all">
                            <Heart size={20} fill="currentColor" />
                        </button>
                    </div>
                </div>

                {/* Right: Timeline */}
                <div className="space-y-8 bg-white p-12 rounded-[64px] border border-gray-50 shadow-sm self-start">
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 tracking-tight uppercase">Progreso del Envío</h2>
                        <div className="mt-4 flex flex-col gap-2 p-4 bg-gray-50 rounded-3xl border border-gray-100">
                            <div className="flex items-start gap-3">
                                <MapPin size={14} className="text-primary mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-0.5">Destino</p>
                                    <p className="text-sm font-bold text-gray-800 leading-tight">{order.delivery_address}</p>
                                    {order.address_details && (
                                        <p className="text-[11px] text-gray-400 font-medium italic mt-1">Ref: {order.address_details}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative space-y-12">
                        {/* Vertical Line */}
                        <div className="absolute left-6 top-8 bottom-8 w-px bg-gray-100" />

                        {timeline.map((step, idx) => {
                            const isCompleted = idx <= currentStatusIndex;
                            const isCurrent = idx === currentStatusIndex;

                            return (
                                <div key={step.id} className="relative flex gap-8">
                                    <div className={`z-10 w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-700 ${isCompleted ? 'bg-primary text-white shadow-xl shadow-primary/20 scale-110' : 'bg-gray-50 text-gray-300'
                                        }`}>
                                        {step.icon}
                                    </div>
                                    <div className="flex-grow pt-1">
                                        <div className="flex justify-between items-center mb-1">
                                            <h3 className={`font-bold transition-colors ${isCompleted ? 'text-gray-900' : 'text-gray-300'}`}>
                                                {step.title}
                                            </h3>
                                            {isCompleted && <span className="text-[10px] font-serif italic text-gray-400">{step.time}</span>}
                                        </div>
                                        {isCurrent && (
                                            <motion.p
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="text-xs text-primary font-medium tracking-tight"
                                            >
                                                Acción en curso...
                                            </motion.p>
                                        )}
                                    </div>
                                    {isCompleted && (
                                        <div className="absolute left-[20px] top-full h-12 w-1 bg-primary z-0 origin-top" />
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <div className="mt-12 pt-8 border-t border-gray-50">
                        <div className="flex items-center gap-3 text-gray-400 p-6 bg-[#FBFBFB] rounded-3xl border border-gray-50 italic text-sm">
                            <ShieldCheck size={18} className="text-primary shrink-0" />
                            <p>Tu JaniBox fue desinfectada y empaquetada siguiendo todos los protocolos de higiene.</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default OrderTracking;
