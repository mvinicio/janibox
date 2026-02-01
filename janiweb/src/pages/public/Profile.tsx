import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import Navbar from '../../components/public/Navbar';
import { motion } from 'framer-motion';
import { Package, Clock, CheckCircle2, Truck, ShoppingBag, ChevronRight, Phone, MapPin, Edit2, Save, X, User } from 'lucide-react';
import toast from 'react-hot-toast';

const Profile = () => {
    const [user, setUser] = useState<any>(null);
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<any>(null);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({ phone: '', address: '' });

    useEffect(() => {
        const fetchProfileData = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                setUser(session.user);

                // Fetch orders for this user
                const { data: userOrders, error } = await supabase
                    .from('orders')
                    .select('*')
                    .eq('user_id', session.user.id)
                    .order('created_at', { ascending: false });

                if (!error) setOrders(userOrders || []);

                // Fetch extended profile
                const { data: profileData } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
                if (profileData) {
                    setProfile(profileData);
                    setFormData({ phone: profileData.phone || '', address: profileData.address || '' });
                }
            }
            setLoading(false);
        };

        fetchProfileData();
    }, []);

    const handleUpdateProfile = async () => {
        if (!user) return;
        try {
            const { error } = await supabase.from('profiles').update({
                phone: formData.phone,
                address: formData.address
            }).eq('id', user.id);

            if (error) throw error;

            setProfile({ ...profile, ...formData });
            setEditing(false);
            toast.success('Perfil actualizado correctamente');
        } catch (error: any) {
            console.error(error);
            toast.error('Error al actualizar perfil');
        }
    };

    const getAvatarUrl = () => {
        const metadata = user?.user_metadata;
        if (metadata?.avatar_url) return metadata.avatar_url;

        const name = metadata?.full_name || '';

        return `https://api.dicebear.com/7.x/notionists/svg?seed=${name}&gesture=happy`;
    };

    const getStatusIcon = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'pendiente': return <Clock size={16} className="text-amber-500" />;
            case 'preparando': return <Package size={16} className="text-blue-500" />;
            case 'enviado': return <Truck size={16} className="text-purple-500" />;
            case 'entregado': return <CheckCircle2 size={16} className="text-green-500" />;
            default: return <Clock size={16} className="text-gray-400" />;
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-[#FBFBFB] flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
    );

    return (
        <div className="bg-[#FBFBFB] min-h-screen font-inter">
            <Navbar />

            <div className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    {/* Sidebar / User Info */}
                    <aside className="w-full lg:w-1/3 xl:w-1/4">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 sticky top-32"
                        >
                            <div className="flex flex-col items-center">
                                <div className="relative mb-6">
                                    <div className="w-24 h-24 rounded-full border-4 border-primary/10 overflow-hidden bg-gray-50 flex items-center justify-center">
                                        <img
                                            src={getAvatarUrl()}
                                            className="w-full h-full object-cover"
                                            alt="Avatar"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${user?.user_metadata?.full_name || 'User'}&background=CC6677&color=fff`;
                                            }}
                                        />
                                    </div>
                                    <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-4 border-white rounded-full"></div>
                                </div>

                                <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-1">
                                    {user?.user_metadata?.full_name || 'Mi Perfil'}
                                </h2>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-8 break-all">
                                    {user?.email}
                                </p>

                                <div className="w-full grid grid-cols-2 gap-4 pt-6 border-t border-gray-50">
                                    <div className="text-center">
                                        <span className="block text-2xl font-black text-primary">{orders.length}</span>
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pedidos</span>
                                    </div>
                                    <div className="text-center">
                                        <span className="block text-2xl font-black text-primary">
                                            {orders.filter(o => o.status === 'Entregado').length}
                                        </span>
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Entregas</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </aside>

                    {/* Main Content / Orders */}
                    <main className="w-full lg:w-2/3 xl:w-3/4 space-y-8">

                        {/* Personal Data Section */}
                        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 relative group text-left">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
                                    <User size={20} className="text-primary" />
                                    Mis Datos de Envío
                                </h2>
                                {!editing ? (
                                    <button
                                        onClick={() => setEditing(true)}
                                        className="p-2 text-gray-400 hover:text-primary bg-gray-50 rounded-xl transition-colors"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => setEditing(false)}
                                        className="p-2 text-gray-400 hover:text-red-500 bg-gray-50 rounded-xl transition-colors"
                                    >
                                        <X size={18} />
                                    </button>
                                )}
                            </div>

                            {editing ? (
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Teléfono</label>
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full bg-gray-50 border-transparent rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                                            placeholder="Ingresa tu teléfono"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Dirección</label>
                                        <input
                                            type="text"
                                            value={formData.address}
                                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                            className="w-full bg-gray-50 border-transparent rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                                            placeholder="Ingresa tu dirección"
                                        />
                                    </div>
                                    <button
                                        onClick={handleUpdateProfile}
                                        className="w-full py-3 bg-primary text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                                    >
                                        <Save size={16} />
                                        Guardar Cambios
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="p-4 bg-gray-50/50 rounded-2xl border border-gray-50">
                                        <div className="flex items-center gap-2 text-gray-400 mb-1">
                                            <Phone size={14} />
                                            <span className="text-[10px] font-black uppercase tracking-widest">Teléfono</span>
                                        </div>
                                        <p className="font-medium text-gray-900">{profile?.phone || 'No registrado'}</p>
                                    </div>
                                    <div className="p-4 bg-gray-50/50 rounded-2xl border border-gray-50">
                                        <div className="flex items-center gap-2 text-gray-400 mb-1">
                                            <MapPin size={14} />
                                            <span className="text-[10px] font-black uppercase tracking-widest">Dirección</span>
                                        </div>
                                        <p className="font-medium text-gray-900 truncate">{profile?.address || 'No registrada'}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="mb-10">
                            <h1 className="text-3xl sm:text-4xl font-extralight tracking-[0.2em] uppercase text-gray-900 mb-4">
                                Mi Actividad
                            </h1>
                            <div className="w-16 h-1 bg-primary rounded-full"></div>
                        </div>

                        {orders.length > 0 ? (
                            <div className="grid gap-4">
                                {orders.map((order, idx) => (
                                    <motion.div
                                        key={order.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center justify-between group hover:shadow-lg hover:border-primary/10 transition-all cursor-pointer gap-4"
                                        onClick={() => window.location.hash = `/tracking/${order.id}`}
                                    >
                                        <div className="flex items-center gap-6 w-full sm:w-auto">
                                            <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors flex-shrink-0">
                                                <ShoppingBag size={24} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex flex-wrap items-center gap-3 mb-1">
                                                    <span className="text-sm font-black text-gray-900 uppercase tracking-tight truncate">
                                                        Orden #{order.id.slice(0, 8)}
                                                    </span>
                                                    <div className="px-3 py-1 rounded-full flex items-center gap-2 bg-gray-50 border border-gray-100">
                                                        {getStatusIcon(order.status)}
                                                        <span className="text-[9px] font-black uppercase tracking-widest text-gray-600">
                                                            {order.status || 'Pendiente'}
                                                        </span>
                                                    </div>
                                                </div>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                                    {new Date(order.created_at).toLocaleDateString()} - ${order.total_amount?.toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                        <ChevronRight size={20} className="text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all hidden sm:block" />
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="bg-white p-12 sm:p-20 rounded-[3rem] text-center border border-dashed border-gray-200"
                            >
                                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8 text-gray-300">
                                    <ShoppingBag size={40} />
                                </div>
                                <h3 className="text-xl font-light tracking-widest uppercase text-gray-900 mb-2">Aún no tienes pedidos</h3>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-10">¡Empieza a crear momentos especiales hoy!</p>
                                <button
                                    onClick={() => window.location.hash = '/'}
                                    className="px-12 py-5 bg-primary text-white rounded-full font-black text-[10px] uppercase tracking-[0.25em] hover:scale-105 transition-all shadow-xl shadow-primary/20 active:scale-95"
                                >
                                    Ir al Catálogo
                                </button>
                            </motion.div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Profile;
