import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import {
    Ticket,
    Plus,
    Trash2,
    Gift,
    TrendingUp,
    Search,
    ShoppingBag,
    Calendar
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const Rewards = () => {
    const [coupons, setCoupons] = useState<any[]>([]);
    // const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'coupons' | 'giftcards'>('coupons');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Form State
    const [form, setForm] = useState({
        code: '',
        discount_type: 'percentage',
        discount_value: '',
        min_purchase: '0',
        max_discount: '',
        valid_until: '',
        usage_limit: ''
    });

    useEffect(() => {
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        // setLoading(true);
        const { data, error } = await supabase
            .from('coupons')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) toast.error('Error cargando datos');
        else setCoupons(data || []);
        // setLoading(false);
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        const isGiftCard = activeTab === 'giftcards';

        const newCoupon = {
            code: form.code.toUpperCase(),
            discount_type: isGiftCard ? 'fixed' : form.discount_type,
            discount_value: parseFloat(form.discount_value),
            min_purchase: isGiftCard ? 0 : parseFloat(form.min_purchase),
            max_discount: !isGiftCard && form.max_discount ? parseFloat(form.max_discount) : null,
            usage_limit: form.usage_limit ? parseInt(form.usage_limit) : null,
            valid_until: form.valid_until || null,
            is_gift_card: isGiftCard
        };

        const { error } = await supabase.from('coupons').insert([newCoupon]);

        if (error) {
            toast.error('Error: ' + error.message);
        } else {
            toast.success(isGiftCard ? 'Tarjeta de Regalo creada!' : 'Cupón creado!');
            setIsModalOpen(false);
            resetForm();
            fetchCoupons();
        }
    };

    const resetForm = () => {
        setForm({
            code: '',
            discount_type: 'percentage',
            discount_value: '',
            min_purchase: '0',
            max_discount: '',
            valid_until: '',
            usage_limit: ''
        });
    }

    const handleDelete = async (id: string) => {
        if (!confirm('¿Seguro que quieres eliminar este ítem?')) return;
        const { error } = await supabase.from('coupons').delete().eq('id', id);
        if (error) toast.error('Error eliminando');
        else {
            toast.success('Eliminado correctamente');
            fetchCoupons();
        }
    };

    const filteredItems = coupons.filter(c => {
        const matchesSearch = c.code.toLowerCase().includes(searchTerm.toLowerCase());
        const isGiftCard = c.is_gift_card === true;
        return matchesSearch && (activeTab === 'giftcards' ? isGiftCard : !isGiftCard);
    });

    const totalCoupons = coupons.filter(c => !c.is_gift_card).length;
    const totalGiftCards = coupons.filter(c => c.is_gift_card).length;
    const totalUses = coupons.reduce((acc, c) => acc + (c.used_count || 0), 0);

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Gestión de Recompensas</h1>
                    <p className="text-gray-500 font-medium text-sm mt-1 uppercase tracking-widest">
                        {activeTab === 'coupons' ? 'Cupones y Descuentos' : 'Tarjetas de Regalo'}
                    </p>
                </div>
                <button
                    onClick={() => { resetForm(); setIsModalOpen(true); }}
                    className="bg-primary text-white px-8 py-4 rounded-3xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-3 shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                >
                    <Plus size={20} />
                    {activeTab === 'coupons' ? 'Nuevo Cupón' : 'Nueva Gift Card'}
                </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div onClick={() => setActiveTab('coupons')} className={`cursor-pointer transition-all ${activeTab === 'coupons' ? 'ring-4 ring-primary/10 scale-[1.02]' : 'hover:scale-[1.01]'} bg-white p-8 rounded-[40px] border-2 border-gray-50 shadow-sm flex items-center gap-6`}>
                    <div className="w-16 h-16 rounded-3xl bg-blue-50 text-blue-500 flex items-center justify-center">
                        <Ticket size={32} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Cupones</p>
                        <p className="text-3xl font-black text-gray-900">{totalCoupons}</p>
                    </div>
                </div>
                <div className="bg-white p-8 rounded-[40px] border-2 border-gray-50 shadow-sm flex items-center gap-6">
                    <div className="w-16 h-16 rounded-3xl bg-green-50 text-green-500 flex items-center justify-center">
                        <TrendingUp size={32} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Usos Totales</p>
                        <p className="text-3xl font-black text-gray-900">{totalUses}</p>
                    </div>
                </div>
                <div onClick={() => setActiveTab('giftcards')} className={`cursor-pointer transition-all ${activeTab === 'giftcards' ? 'ring-4 ring-primary/10 scale-[1.02]' : 'hover:scale-[1.01]'} bg-white p-8 rounded-[40px] border-2 border-gray-50 shadow-sm flex items-center gap-6`}>
                    <div className="w-16 h-16 rounded-3xl bg-purple-50 text-purple-500 flex items-center justify-center">
                        <Gift size={32} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Gift Cards</p>
                        <p className="text-3xl font-black text-gray-900">{totalGiftCards}</p>
                    </div>
                </div>
            </div>

            {/* Tabs & Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex bg-white p-2 rounded-3xl border-2 border-gray-50 w-fit">
                    <button
                        onClick={() => setActiveTab('coupons')}
                        className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'coupons' ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-50'}`}
                    >
                        Cupones
                    </button>
                    <button
                        onClick={() => setActiveTab('giftcards')}
                        className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'giftcards' ? 'bg-purple-500 text-white shadow-lg shadow-purple-200' : 'text-gray-400 hover:bg-gray-50'}`}
                    >
                        Gift Cards
                    </button>
                </div>

                <div className="bg-white p-2 rounded-3xl border-2 border-gray-50 flex items-center gap-4 px-6 flex-1">
                    <Search className="text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder={activeTab === 'coupons' ? "Buscar cupón..." : "Buscar gift card..."}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-1 bg-transparent border-none outline-none font-bold text-gray-900 placeholder:text-gray-300 py-2"
                    />
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredItems.map((item) => (
                    <motion.div
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        key={item.id}
                        className={`rounded-[48px] p-8 border-2 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden ${activeTab === 'giftcards' ? 'bg-purple-50 border-purple-100 hover:border-purple-200' : 'bg-white border-gray-50 hover:border-primary/10'}`}
                    >
                        {/* Notch Effect */}
                        <div className={`absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full border-2 ${activeTab === 'giftcards' ? 'bg-purple-50 border-purple-100' : 'bg-gray-50 border-gray-50'}`}></div>
                        <div className={`absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full border-2 ${activeTab === 'giftcards' ? 'bg-purple-50 border-purple-100' : 'bg-gray-50 border-gray-50'}`}></div>

                        <div className="flex justify-between items-start mb-6">
                            <div className={`${activeTab === 'giftcards' ? 'bg-purple-200 text-purple-700' : 'bg-primary/10 text-primary'} px-6 py-2 rounded-2xl`}>
                                <span className="text-lg font-black tracking-tighter">{item.code}</span>
                            </div>
                            <button
                                onClick={() => handleDelete(item.id)}
                                className="p-3 text-gray-300 hover:text-red-500 transition-colors bg-white/50 rounded-2xl"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white rounded-xl text-gray-400">
                                    <ShoppingBag size={16} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Valor</p>
                                    <p className="font-bold text-gray-900">
                                        {item.discount_type === 'percentage' ? `${item.discount_value}% OFF` : `$${item.discount_value} USD`}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white rounded-xl text-gray-400">
                                    <TrendingUp size={16} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Usos</p>
                                    <p className="font-bold text-gray-900">
                                        {item.used_count || 0} {item.usage_limit ? ` / ${item.usage_limit}` : ''}
                                    </p>
                                </div>
                            </div>

                            {item.valid_until && (
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white rounded-xl text-gray-400">
                                        <Calendar size={16} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Vence</p>
                                        <p className="font-bold text-gray-900">
                                            {new Date(item.valid_until).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-gray-900/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white w-full max-w-2xl rounded-[56px] shadow-2xl overflow-hidden"
                        >
                            <div className="p-12 space-y-8">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-3xl font-black text-gray-900 tracking-tight text-center flex-1 ml-10">
                                        {activeTab === 'coupons' ? 'Nuevo Cupón' : 'Nueva Gift Card'}
                                    </h2>
                                    <button
                                        onClick={() => setIsModalOpen(false)}
                                        className="w-12 h-12 rounded-2xl bg-gray-50 text-gray-400 flex items-center justify-center hover:bg-gray-100 transition-all rotate-45"
                                    >
                                        <Plus size={24} />
                                    </button>
                                </div>

                                <form onSubmit={handleCreate} className="grid grid-cols-2 gap-8">
                                    {/* Code */}
                                    <label className="col-span-2 block">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 block ml-1">Código Único</span>
                                        <input
                                            required
                                            type="text"
                                            placeholder={activeTab === 'coupons' ? "EJ. VERANO2026" : "EJ. REGALO50"}
                                            value={form.code}
                                            onChange={e => setForm({ ...form, code: e.target.value })}
                                            className="w-full bg-gray-50 border-2 border-transparent rounded-3xl px-8 py-5 text-sm font-bold focus:ring-4 focus:ring-primary/10 outline-none transition-all uppercase"
                                        />
                                    </label>

                                    {/* Amount / Discount */}
                                    <label className={activeTab === 'giftcards' ? "col-span-2 block" : "block"}>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 block ml-1">
                                            {activeTab === 'coupons' ? 'Valor del Descuento' : 'Monto de la Gift Card ($)'}
                                        </span>
                                        <input
                                            required
                                            type="number"
                                            placeholder="0.00"
                                            value={form.discount_value}
                                            onChange={e => setForm({ ...form, discount_value: e.target.value })}
                                            className="w-full bg-gray-50 border-2 border-transparent rounded-3xl px-8 py-5 text-sm font-bold focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                                        />
                                    </label>

                                    {/* Coupon Specifics */}
                                    {activeTab === 'coupons' && (
                                        <>
                                            <label className="block">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 block ml-1">Tipo</span>
                                                <select
                                                    value={form.discount_type}
                                                    onChange={e => setForm({ ...form, discount_type: e.target.value })}
                                                    className="w-full bg-gray-50 border-2 border-transparent rounded-3xl px-8 py-5 text-sm font-bold focus:ring-4 focus:ring-primary/10 outline-none transition-all appearance-none"
                                                >
                                                    <option value="percentage">Porcentaje (%)</option>
                                                    <option value="fixed">Monto Fijo ($)</option>
                                                </select>
                                            </label>

                                            <label className="block">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 block ml-1">Compra Mínima ($)</span>
                                                <input
                                                    type="number"
                                                    value={form.min_purchase}
                                                    onChange={e => setForm({ ...form, min_purchase: e.target.value })}
                                                    className="w-full bg-gray-50 border-2 border-transparent rounded-3xl px-8 py-5 text-sm font-bold focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                                                />
                                            </label>
                                        </>
                                    )}

                                    {/* Common Fields */}
                                    <label className="block">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 block ml-1">Límite de Usos</span>
                                        <input
                                            type="number"
                                            placeholder="Sin límite"
                                            value={form.usage_limit}
                                            onChange={e => setForm({ ...form, usage_limit: e.target.value })}
                                            className="w-full bg-gray-50 border-2 border-transparent rounded-3xl px-8 py-5 text-sm font-bold focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                                        />
                                    </label>

                                    <label className="block">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 block ml-1">Válido Hasta</span>
                                        <input
                                            type="date"
                                            value={form.valid_until}
                                            onChange={e => setForm({ ...form, valid_until: e.target.value })}
                                            className="w-full bg-gray-50 border-2 border-transparent rounded-3xl px-8 py-5 text-sm font-bold focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                                        />
                                    </label>

                                    <button
                                        type="submit"
                                        className={`col-span-2 text-white py-6 rounded-3xl font-black text-xs uppercase tracking-[0.3em] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all mt-4 ${activeTab === 'giftcards' ? 'bg-purple-500 shadow-purple-500/30' : 'bg-primary shadow-primary/30'}`}
                                    >
                                        {activeTab === 'coupons' ? 'Crear Cupón' : 'Crear Gift Card'}
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Rewards;
