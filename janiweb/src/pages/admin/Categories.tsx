import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Plus, Edit2, Trash2, X, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const Categories = () => {
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<any>(null);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        icon: '',
        type: 'product'
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        const { data } = await supabase.from('categories').select('*').order('name');
        setCategories(data || []);
        setLoading(false);
    };

    const handleOpenModal = (category: any = null) => {
        if (category) {
            setEditingCategory(category);
            setFormData({ name: category.name, icon: category.icon || '', type: category.type });
        } else {
            setEditingCategory(null);
            setFormData({ name: '', icon: '', type: 'product' });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const dataToSave = {
                ...formData,
                icon: formData.icon.trim() || 'label' // Default icon if empty
            };

            if (editingCategory) {
                const { error } = await supabase.from('categories').update(dataToSave).eq('id', editingCategory.id);
                if (error) throw error;
                toast.success('Categoría actualizada');
            } else {
                const { error } = await supabase.from('categories').insert([dataToSave]);
                if (error) throw error;
                toast.success('Categoría creada');
            }
            setIsModalOpen(false);
            fetchData();
        } catch (error: any) {
            console.error('Error saving category:', error);
            toast.error(error.message || 'Error al guardar');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('¿Eliminar categoría? Esto podría afectar productos/dulces asociados.')) {
            try {
                const { error } = await supabase.from('categories').delete().eq('id', id);
                if (error) throw error;
                toast.success('Categoría eliminada');
                fetchData();
            } catch (error: any) {
                toast.error(error.message);
            }
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-black text-gray-900">Categorías</h2>
                    <p className="text-gray-500">Organiza tus productos y dulces por tipo</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-primary text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
                >
                    <Plus size={20} />
                    Nueva Categoría
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <p className="text-gray-400">Cargando...</p>
                ) : categories.map((cat) => (
                    <motion.div
                        key={cat.id}
                        layout
                        className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center justify-between group"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-primary">
                                <span className="material-symbols-outlined">{cat.icon || 'label'}</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900">{cat.name}</h4>
                                <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${cat.type === 'product' ? 'bg-blue-50 text-blue-500' : 'bg-pink-50 text-pink-500'}`}>
                                    {cat.type === 'product' ? 'Producto' : 'Dulce'}
                                </span>
                            </div>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleOpenModal(cat)} className="p-2 text-gray-400 hover:text-primary transition-colors">
                                <Edit2 size={18} />
                            </button>
                            <button onClick={() => handleDelete(cat.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </motion.div>
                ))}
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
                            <div className="p-8 border-b border-gray-50 flex justify-between items-center">
                                <h3 className="text-2xl font-black text-gray-900">{editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}</h3>
                                <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-800 transition-colors">
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-8 space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 ml-1">Nombre</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-primary/20"
                                        placeholder="Ej. Ramos Rosas, Chocolates..."
                                    />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm font-bold text-gray-700 ml-1">Icono (Opcional)</label>
                                        <span className="text-[10px] text-gray-400 font-medium">Ej: candy, cake, cookie</span>
                                    </div>
                                    <input
                                        type="text"
                                        value={formData.icon}
                                        onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-primary/20"
                                        placeholder="Dejar vacío para usar defecto"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-sm font-bold text-gray-700 ml-1">Tipo de Categoría</label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, type: 'product' })}
                                            className={`py-3 rounded-xl font-bold transition-all ${formData.type === 'product' ? 'bg-primary text-white shadow-lg' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                                        >
                                            Producto
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, type: 'treat' })}
                                            className={`py-3 rounded-xl font-bold transition-all ${formData.type === 'treat' ? 'bg-primary text-white shadow-lg' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                                        >
                                            Dulce
                                        </button>
                                    </div>
                                    <div className="flex items-start gap-2 bg-blue-50/50 p-3 rounded-xl border border-blue-100/50">
                                        <Info size={16} className="text-blue-500 shrink-0 mt-0.5" />
                                        <p className="text-[11px] text-blue-600 leading-tight">
                                            {formData.type === 'product'
                                                ? 'Para agrupar RAMOS o CAJAS en el catálogo principal.'
                                                : 'Para agrupar DULCES dentro del personalizador de ramos.'}
                                        </p>
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
                                        disabled={saving}
                                        className="flex-[2] bg-primary text-white px-6 py-4 rounded-2xl font-bold shadow-xl shadow-primary/30 hover:bg-primary-dark transition-all flex items-center justify-center gap-2"
                                    >
                                        {saving ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        ) : (
                                            editingCategory ? 'Guardar Cambios' : 'Crear Categoría'
                                        )}
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

export default Categories;
