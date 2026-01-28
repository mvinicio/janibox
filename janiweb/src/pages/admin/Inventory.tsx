import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Plus, Edit2, Trash2, Search, Package, Check, X, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const Inventory = () => {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);

    const [formData, setFormData] = useState({
        name: '',
        unit: 'Unidades',
        unit_cost: '',
        current_stock: '',
        min_stock: ''
    });

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('inventory_items')
                .select('*')
                .order('name', { ascending: true });

            if (error) throw error;
            setItems(data || []);
        } catch (error: any) {
            console.error('Error fetching inventory:', error);
            // Table might not exist yet if user hasn't run the SQL
            if (error.code === 'PGRST116' || error.message?.includes('does not exist')) {
                toast.error('La tabla de inventario aún no existe. Ejecuta el SQL en Supabase.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (item: any = null) => {
        if (item) {
            setEditingItem(item);
            setFormData({
                name: item.name,
                unit: item.unit,
                unit_cost: item.unit_cost.toString(),
                current_stock: item.current_stock.toString(),
                min_stock: item.min_stock.toString()
            });
        } else {
            setEditingItem(null);
            setFormData({
                name: '',
                unit: 'Unidades',
                unit_cost: '',
                current_stock: '',
                min_stock: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const itemData = {
                name: formData.name,
                unit: formData.unit,
                unit_cost: parseFloat(formData.unit_cost),
                current_stock: parseFloat(formData.current_stock),
                min_stock: parseFloat(formData.min_stock)
            };

            if (editingItem) {
                const { error } = await supabase.from('inventory_items').update(itemData).eq('id', editingItem.id);
                if (error) throw error;
                toast.success('Insumo actualizado');
            } else {
                const { error } = await supabase.from('inventory_items').insert([itemData]);
                if (error) throw error;
                toast.success('Insumo creado');
            }

            setIsModalOpen(false);
            fetchItems();
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('¿Estás seguro de eliminar este insumo?')) {
            try {
                const { error } = await supabase.from('inventory_items').delete().eq('id', id);
                if (error) throw error;
                toast.success('Insumo eliminado');
                fetchItems();
            } catch (error: any) {
                toast.error(error.message);
            }
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-black text-gray-900">Inventario de Insumos</h2>
                    <p className="text-gray-500">Controla tus materiales, costos y niveles de stock</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-primary text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
                >
                    <Plus size={20} />
                    Nuevo Insumo
                </button>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                    <div className="relative w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar insumos..."
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary/20"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 text-gray-400 text-xs font-black uppercase tracking-widest">
                                <th className="px-8 py-4">Insumo</th>
                                <th className="px-8 py-4">Costo x Unidad</th>
                                <th className="px-8 py-4">Stock Actual</th>
                                <th className="px-8 py-4">Unidad</th>
                                <th className="px-8 py-4">Estado</th>
                                <th className="px-8 py-4 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-8 py-12 text-center text-gray-400">Cargando inventario...</td>
                                </tr>
                            ) : items.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-8 py-12 text-center text-gray-400">No hay insumos registrados</td>
                                </tr>
                            ) : items.map((item: any) => (
                                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-8 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 bg-gray-100 rounded-lg text-gray-500">
                                                <Package size={20} />
                                            </div>
                                            <span className="font-bold text-gray-800">{item.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-4 font-black text-gray-900">${item.unit_cost.toFixed(2)}</td>
                                    <td className="px-8 py-4">
                                        <span className={`font-bold ${item.current_stock <= item.min_stock ? 'text-red-500' : 'text-gray-700'}`}>
                                            {item.current_stock}
                                        </span>
                                    </td>
                                    <td className="px-8 py-4 text-gray-500 font-medium">{item.unit}</td>
                                    <td className="px-8 py-4">
                                        {item.current_stock <= item.min_stock ? (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-wider border border-red-100">
                                                <AlertTriangle size={12} />
                                                Stock Bajo
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-600 text-[10px] font-black uppercase tracking-wider border border-green-100">
                                                <Check size={12} />
                                                Óptimo
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-8 py-4 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleOpenModal(item)} className="p-2 text-gray-400 hover:text-primary transition-colors">
                                                <Edit2 size={18} />
                                            </button>
                                            <button onClick={() => handleDelete(item.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
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
                            className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
                        >
                            <div className="p-8 border-b border-gray-50 flex justify-between items-center">
                                <h3 className="text-2xl font-black text-gray-900">{editingItem ? 'Editar Insumo' : 'Nuevo Insumo'}</h3>
                                <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-800 transition-colors">
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-8 space-y-6">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 ml-1">Nombre del Insumo</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-primary/20"
                                            placeholder="Ej. Rosa Roja (Exportación)"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-700 ml-1">Costo Unitario ($)</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                required
                                                value={formData.unit_cost}
                                                onChange={(e) => setFormData({ ...formData, unit_cost: e.target.value })}
                                                className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-primary/20"
                                                placeholder="0.00"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-700 ml-1">Unidad de Medida</label>
                                            <select
                                                required
                                                value={formData.unit}
                                                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                                                className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 appearance-none"
                                            >
                                                <option value="Unidades">Unidades</option>
                                                <option value="Gramos">Gramos</option>
                                                <option value="Metros">Metros</option>
                                                <option value="Cajas">Cajas</option>
                                                <option value="Paquetes">Paquetes</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-700 ml-1">Stock Actual</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                required
                                                value={formData.current_stock}
                                                onChange={(e) => setFormData({ ...formData, current_stock: e.target.value })}
                                                className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-primary/20"
                                                placeholder="0.00"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-700 ml-1">Stock Mínimo (Alerta)</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                required
                                                value={formData.min_stock}
                                                onChange={(e) => setFormData({ ...formData, min_stock: e.target.value })}
                                                className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-primary/20"
                                                placeholder="0.00"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
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
                                        {editingItem ? 'Guardar Cambios' : 'Crear Insumo'}
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

export default Inventory;
