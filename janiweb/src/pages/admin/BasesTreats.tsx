import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { uploadImage } from '../../lib/storage';
import { Plus, Edit2, Trash2, Box, Candy as CandyIcon, Image as ImageIcon, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const BasesTreats = () => {
    const [bases, setBases] = useState<any[]>([]);
    const [treats, setTreats] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'bases' | 'treats'>('bases');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);
    const [uploading, setUploading] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        image_url: '',
        category_id: '', // Only for treats
        payphone_link: ''
    });
    const [imageFile, setImageFile] = useState<File | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        const { data: b } = await supabase.from('bases').select('*');
        const { data: t } = await supabase.from('treats').select('*');
        setBases(b || []);
        setTreats(t || []);
        setLoading(false);
    };

    const handleOpenModal = (item: any = null) => {
        if (item) {
            setEditingItem(item);
            setFormData({
                name: item.name,
                price: item.price.toString(),
                description: item.description || '',
                image_url: item.image_url,
                category_id: item.category_id || '',
                payphone_link: item.payphone_link || ''
            });
        } else {
            setEditingItem(null);
            setFormData({ name: '', price: '', description: '', image_url: '', category_id: '', payphone_link: '' });
        }
        setImageFile(null);
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setUploading(true);
        try {
            let publicUrl = formData.image_url;
            if (imageFile) publicUrl = await uploadImage(imageFile);

            const itemData = {
                name: formData.name,
                price: parseFloat(formData.price),
                description: formData.description,
                image_url: publicUrl,
                payphone_link: formData.payphone_link,
                ...(activeTab === 'treats' ? { category_id: formData.category_id || null } : {})
            };

            const label = activeTab === 'bases' ? 'Base' : 'Dulce';

            if (editingItem) {
                const { error } = await supabase.from(activeTab).update(itemData).eq('id', editingItem.id);
                if (error) throw error;
                toast.success(`${label} actualizado`);
            } else {
                const { error } = await supabase.from(activeTab).insert([itemData]);
                if (error) throw error;
                toast.success(`${label} creado`);
            }

            setIsModalOpen(false);
            fetchData();
        } catch (err: any) {
            console.error(err);
            toast.error(err.message || 'Error al guardar');
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id: string) => {
        const label = activeTab === 'bases' ? 'base' : 'dulce';
        if (confirm(`¿Eliminar este ${label}?`)) {
            try {
                const { error } = await supabase.from(activeTab).delete().eq('id', id);
                if (error) throw error;
                toast.success(`${label.charAt(0).toUpperCase() + label.slice(1)} eliminado`);
                fetchData();
            } catch (err: any) {
                toast.error(err.message);
            }
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-black text-gray-900">Personalización</h2>
                    <p className="text-gray-500">Administra las bases y dulces para el armado de ramos</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-primary text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
                >
                    <Plus size={20} />
                    Nuevo {activeTab === 'bases' ? 'Base' : 'Dulce'}
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 bg-gray-100 p-1.5 rounded-2xl w-fit">
                <button
                    onClick={() => setActiveTab('bases')}
                    className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all ${activeTab === 'bases' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
                >
                    <Box size={18} />
                    Bases
                </button>
                <button
                    onClick={() => setActiveTab('treats')}
                    className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all ${activeTab === 'treats' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
                >
                    <CandyIcon size={18} />
                    Dulces
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {loading ? (
                    <p>Cargando...</p>
                ) : (activeTab === 'bases' ? bases : treats).map((item) => (
                    <div key={item.id} className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 group">
                        <div className="aspect-square rounded-2xl bg-gray-50 overflow-hidden mb-4 relative">
                            <img src={item.image_url} alt="" className="w-full h-full object-cover" />
                            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => handleOpenModal(item)} className="p-2 bg-white/90 backdrop-blur rounded-lg shadow-sm text-gray-400 hover:text-primary transition-colors">
                                    <Edit2 size={16} />
                                </button>
                                <button onClick={() => handleDelete(item.id)} className="p-2 bg-white/90 backdrop-blur rounded-lg shadow-sm text-gray-400 hover:text-red-500 transition-colors">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                        <h4 className="font-bold text-gray-900 truncate">{item.name}</h4>
                        <p className="text-lg font-black text-primary">${item.price.toFixed(2)}</p>
                    </div>
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
                            className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
                        >
                            <div className="p-8 border-b border-gray-50 flex justify-between items-center">
                                <h3 className="text-2xl font-black text-gray-900">
                                    {editingItem ? 'Editar' : 'Nuevo'} {activeTab === 'bases' ? 'Base' : 'Dulce'}
                                </h3>
                                <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-800 transition-colors">
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[80vh] overflow-y-auto">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 ml-1">Nombre</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-primary/20"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 ml-1">Precio</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            required
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                            className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-primary/20"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 ml-1">Link de Pago (PayPhone)</label>
                                        <input
                                            type="url"
                                            value={formData.payphone_link}
                                            onChange={(e) => setFormData({ ...formData, payphone_link: e.target.value })}
                                            className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-primary/20"
                                            placeholder="https://pay.payphonetodoesposible.com/..."
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 ml-1">Descripción</label>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 min-h-[100px]"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 ml-1">Imagen</label>
                                        <div
                                            className="border-2 border-dashed border-gray-100 rounded-[2rem] p-6 flex flex-col items-center justify-center gap-4 bg-gray-50 hover:bg-gray-100/50 cursor-pointer transition-all"
                                            onClick={() => document.getElementById('item-image-upload')?.click()}
                                        >
                                            {imageFile || formData.image_url ? (
                                                <img
                                                    src={imageFile ? URL.createObjectURL(imageFile) : formData.image_url}
                                                    className="w-24 h-24 object-cover rounded-2xl"
                                                    alt="Preview"
                                                />
                                            ) : (
                                                <ImageIcon className="text-gray-400" size={32} />
                                            )}
                                            <p className="text-xs font-bold text-gray-400">Click para subir</p>
                                        </div>
                                        <input
                                            id="item-image-upload"
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex-1 px-6 py-4 rounded-2xl font-bold bg-gray-100 text-gray-600"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        disabled={uploading}
                                        className="flex-[2] bg-primary text-white px-6 py-4 rounded-2xl font-bold shadow-xl shadow-primary/30 flex items-center justify-center gap-2"
                                    >
                                        {uploading ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        ) : (
                                            editingItem ? 'Guardar Cambios' : 'Crear'
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

export default BasesTreats;
