import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Truck, Package, CheckCircle2, MapPin, Clock, ShieldCheck, Heart } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

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

    const timeline = [
        { id: 'received', title: 'Orden Recibida', icon: <Package size={20} />, time: '8:30 AM' },
        { id: 'preparing', title: 'Preparando tu JaniBox', icon: <Heart size={20} />, time: '9:15 AM' },
        { id: 'out_for_delivery', title: 'En Camino', icon: <Truck size={20} />, time: '10:00 AM' },
        { id: 'delivered', title: 'Entregado con Amor', icon: <CheckCircle2 size={20} />, time: '10:30 AM' }
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
                    <div className="relative h-[400px] bg-gray-100 rounded-[64px] overflow-hidden shadow-2xl border-8 border-white group">
                        <img
                            src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=1000"
                            alt="Map"
                            className="w-full h-full object-cover filter brightness-[0.8] grayscale-[0.2]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent" />

                        {/* Delivery Point */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2"
                        >
                            <div className="relative">
                                <span className="absolute inset-0 bg-primary/20 rounded-full animate-ping scale-[3]" />
                                <div className="relative bg-primary text-white p-4 rounded-full shadow-2xl">
                                    <MapPin size={24} />
                                </div>
                            </div>
                        </motion.div>

                        {/* Status Float */}
                        <div className="absolute bottom-8 left-8 right-8 bg-white/80 backdrop-blur-xl p-6 rounded-[32px] shadow-xl border border-white/50">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                                    <Clock size={24} />
                                </div>
                                <div className="flex-grow">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-primary">Llegada Estimada</p>
                                    <p className="text-xl font-bold text-gray-900">10:15 AM <span className="text-sm font-normal text-gray-400 font-serif italic">(12 min)</span></p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-[48px] border border-gray-50 flex items-center gap-6 shadow-sm">
                        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary/20 bg-gray-50">
                            <img src="https://i.pravatar.cc/150?u=jani" alt="Repartidor" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-grow">
                            <p className="text-[10px] font-black tracking-widest uppercase text-gray-400">Repartidor asignado</p>
                            <h3 className="text-lg font-bold text-gray-900 tracking-tight">Alex Johnson</h3>
                        </div>
                        <button className="bg-primary text-white p-4 rounded-2xl shadow-lg shadow-primary/20 hover:scale-110 active:scale-95 transition-all">
                            <Heart size={20} fill="currentColor" />
                        </button>
                    </div>
                </div>

                {/* Right: Timeline */}
                <div className="space-y-8 bg-white p-12 rounded-[64px] border border-gray-50 shadow-sm self-start">
                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-12 uppercase">Progreso del Envío</h2>

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
