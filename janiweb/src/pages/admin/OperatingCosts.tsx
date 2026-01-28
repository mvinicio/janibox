import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Plus, Edit2, Trash2, Search, X, DollarSign, Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const OperatingCosts = () => {
    const [costs, setCosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCost, setEditingCost] = useState<any>(null);

    const [formData, setFormData] = useState({
        name: '',
        amount: '',
        type: 'fixed', // 'fixed' or 'variable'
        frequency: 'monthly', // 'monthly', 'one-time', 'variable'
        description: ''
    });

    useEffect(() => {
        fetchCosts();
    }, []);

    const fetchCosts = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('operating_costs')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error) setCosts(data || []);
        setLoading(false);
    };

    const handleOpenModal = (cost: any = null) => {
        if (cost) {
            setEditingCost(cost);
            setFormData({
                name: cost.name,
                amount: cost.amount.toString(),
                type: cost.type,
                frequency: cost.frequency,
                description: cost.description || ''
            });
        } else {
            setEditingCost(null);
            setFormData({
                name: '',
                amount: '',
                type: 'fixed',
                frequency: 'monthly',
                description: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const costData = {
                name: formData.name,
                amount: parseFloat(formData.amount),
                type: formData.type,
                frequency: formData.frequency,
                description: formData.description
            };

            if (editingCost) {
                const { error } = await supabase.from('operating_costs').update(costData).eq('id', editingCost.id);
                if (error) throw error;
                toast.success('Costo actualizado');
            } else {
                const { error } = await supabase.from('operating_costs').insert([costData]);
                if (error) throw error;
                toast.success('Costo registrado');
            }

            setIsModalOpen(false);
            fetchCosts();
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('¿Estás seguro de eliminar este gasto?')) {
            const { error } = await supabase.from('operating_costs').delete().eq('id', id);
            if (!error) {
                toast.success('Gasto eliminado');
                fetchCosts();
            }
        }
    };

    const totals = {
        fixed: costs.filter(c => c.type === 'fixed').reduce((acc, c) => acc + c.amount, 0),
        variable: costs.filter(c => c.type === 'variable').reduce((acc, c) => acc + c.amount, 0)
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-black text-gray-900">Costos Operativos</h2>
                    <p className="text-gray-500">Registra tus gastos fijos y variables para calcular utilidad real</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-primary text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
                >
                    <Plus size={20} />
                    Nuevo Gasto
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-blue-50 text-blue-500 rounded-2xl">
                            <TrendingDown size={24} />
                        </div>
                        <div>
                            <p className="text-xs font-black uppercase text-gray-400 tracking-widest">Costos Fijos</p>
                            <h3 className="text-2xl font-black text-gray-900">${totals.fixed.toFixed(2)}</h3>
                        </div>
                    </div>
                    <p className="text-xs text-gray-500">Gastos que no cambian mes a mes (ej. Alquiler)</p>
                </div>

                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-orange-50 text-orange-500 rounded-2xl">
                            <TrendingUp size={24} />
                        </div>
                        <div>
                            <p className="text-xs font-black uppercase text-gray-400 tracking-widest">Costos Variables</p>
                            <h3 className="text-2xl font-black text-gray-900">${totals.variable.toFixed(2)}</h3>
                        </div>
                    </div>
                    <p className="text-xs text-gray-500">Gastos que varían según la producción</p>
                </div>

                <div className="bg-primary p-6 rounded-[2rem] shadow-lg shadow-primary/20 text-white">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-white/20 text-white rounded-2xl">
                            <DollarSign size={24} />
                        </div>
                        <div>
                            <p className="text-xs font-black uppercase text-white/60 tracking-widest">Total Gastos</p>
                            <h3 className="text-2xl font-black text-white">${(totals.fixed + totals.variable).toFixed(2)}</h3>
                        </div>
                    </div>
                    <p className="text-xs text-white/80">Impacto total en la rentabilidad mensual</p>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-50">
                    <div className="relative w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar gastos..."
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary/20"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 text-gray-400 text-xs font-black uppercase tracking-widest">
                                <th className="px-8 py-4">Concepto</th>
                                <th className="px-8 py-4">Tipo</th>
                                <th className="px-8 py-4">Frecuencia</th>
                                <th className="px-8 py-4">Monto</th>
                                <th className="px-8 py-4 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-12 text-center text-gray-400">Cargando costos...</td>
                                </tr>
                            ) : costs.map((cost: any) => (
                                <tr key={cost.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-8 py-4">
                                        <span className="font-bold text-gray-800">{cost.name}</span>
                                        {cost.description && <p className="text-xs text-gray-400">{cost.description}</p>}
                                    </td>
                                    <td className="px-8 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cost.type === 'fixed' ? 'bg-blue-50 text-blue-700' : 'bg-orange-50 text-orange-700'}`}>
                                            {cost.type === 'fixed' ? 'Fijo' : 'Variable'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-4 text-gray-500">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={14} />
                                            {cost.frequency === 'monthly' ? 'Mensual' : cost.frequency === 'one-time' ? 'Única vez' : 'Variable'}
                                        </div>
                                    </td>
                                    <td className="px-8 py-4 font-black text-gray-900">${cost.amount.toFixed(2)}</td>
                                    <td className="px-8 py-4 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleOpenModal(cost)} className="p-2 text-gray-400 hover:text-primary transition-colors">
                                                <Edit2 size={18} />
                                            </button>
                                            <button onClick={() => handleDelete(cost.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        ></motion.div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
                        >
                            <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-white sticky top-0 z-10">
                                <h3 className="text-2xl font-black text-gray-900">{editingCost ? 'Editar Gasto' : 'Nuevo Gasto'}</h3>
                                <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-800 transition-colors">
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-8 space-y-6">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 ml-1">Concepto del Gasto</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-primary/20"
                                            placeholder="Ej. Alquiler Local"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-700 ml-1">Monto ($)</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                required
                                                value={formData.amount}
                                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                                className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-primary/20"
                                                placeholder="0.00"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-700 ml-1">Tipo</label>
                                            <select
                                                required
                                                value={formData.type}
                                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                                className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 appearance-none"
                                            >
                                                <option value="fixed">Fijo</option>
                                                <option value="variable">Variable</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 ml-1">Frecuencia</label>
                                        <select
                                            required
                                            value={formData.frequency}
                                            onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                                            className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 appearance-none"
                                        >
                                            <option value="monthly">Mensual</option>
                                            <option value="one-time">Única vez</option>
                                            <option value="variable">Según uso</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 ml-1">Descripción (Opcional)</label>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 min-h-[80px]"
                                            placeholder="Detalles adicionales..."
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4 border-t border-gray-50 mt-8">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex-1 px-6 py-4 rounded-2xl font-bold bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-[2] bg-primary text-white px-6 py-4 rounded-2xl font-bold shadow-xl shadow-primary/30 hover:bg-primary-dark transition-all"
                                    >
                                        {editingCost ? 'Actualizar' : 'Guardar Gasto'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default OperatingCosts;
