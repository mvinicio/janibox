import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { uploadImage } from '../../lib/storage';
import { Plus, Edit2, Trash2, Image as ImageIcon, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const HomeSections = () => {
    const [sections, setSections] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSection, setEditingSection] = useState<any>(null);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        image_url: '',
        order_index: 0
    });
    const [imageFile, setImageFile] = useState<File | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        const { data } = await supabase
            .from('home_sections')
            .select('*')
            .order('order_index', { ascending: true });
        setSections(data || []);
        setLoading(false);
    };

    const handleOpenModal = (section: any = null) => {
        if (section) {
            setEditingSection(section);
            setFormData({
                title: section.title,
                image_url: section.image_url,
                order_index: section.order_index
            });
        } else {
            setEditingSection(null);
            setFormData({
                title: '',
                image_url: '',
                order_index: sections.length
            });
        }
        setImageFile(null);
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            let publicUrl = formData.image_url;
            if (imageFile) {
                publicUrl = await uploadImage(imageFile);
            }

            const sectionData = {
                title: formData.title,
                image_url: publicUrl,
                order_index: formData.order_index
            };

            if (editingSection) {
                const { error } = await supabase
                    .from('home_sections')
                    .update(sectionData)
                    .eq('id', editingSection.id);
                if (error) throw error;
                toast.success('Sección actualizada');
            } else {
                const { error } = await supabase
                    .from('home_sections')
                    .insert([sectionData]);
                if (error) throw error;
                toast.success('Sección creada');
            }

            setIsModalOpen(false);
            fetchData();
        } catch (error: any) {
            console.error('Error saving home section:', error);
            toast.error(error.message || 'Error al guardar');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('¿Estás seguro de eliminar esta sección?')) {
            try {
                const { error } = await supabase.from('home_sections').delete().eq('id', id);
                if (error) throw error;
                toast.success('Sección eliminada');
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
                    <h2 className="text-3xl font-black text-gray-900">Secciones Home</h2>
                    <p className="text-gray-500">Gestiona las imágenes de estilo de vida en la página principal</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-primary text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
                >
                    <Plus size={20} />
                    Nueva Sección
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {loading ? (
                    <p className="text-gray-400">Cargando...</p>
                ) : sections.map((section: any) => (
                    <motion.div
                        key={section.id}
                        layout
                        className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden group"
                    >
                        <div className="aspect-square relative">
                            <img src={section.image_url} alt="" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                <button
                                    onClick={() => handleOpenModal(section)}
                                    className="p-3 bg-white text-gray-900 rounded-2xl hover:bg-primary hover:text-white transition-all transform hover:scale-110"
                                >
                                    <Edit2 size={20} />
                                </button>
                                <button
                                    onClick={() => handleDelete(section.id)}
                                    className="p-3 bg-white text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all transform hover:scale-110"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>
                        <div className="p-6">
                            <h4 className="font-bold text-gray-900 text-lg uppercase tracking-wider">{section.title}</h4>
                            <div className="flex items-center gap-2 mt-2 text-xs text-gray-400 font-bold uppercase tracking-widest">
                                <span>Orden: {section.order_index}</span>
                            </div>
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
                                <h3 className="text-2xl font-black text-gray-900">
                                    {editingSection ? 'Editar Sección' : 'Nueva Sección'}
                                </h3>
                                <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-800 transition-colors">
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-8 space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 ml-1">Título</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-primary/20"
                                        placeholder="Ej. Arreglos de Autor"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 ml-1">Orden de Visualización</label>
                                    <input
                                        type="number"
                                        required
                                        value={formData.order_index}
                                        onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) })}
                                        className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 ml-1">Imagen de Fondo</label>
                                    <div
                                        className="border-2 border-dashed border-gray-100 rounded-[2rem] p-10 flex flex-col items-center justify-center gap-4 bg-gray-50 hover:bg-gray-100/50 hover:border-primary/20 transition-all cursor-pointer group"
                                        onClick={() => document.getElementById('image-upload')?.click()}
                                    >
                                        {imageFile || formData.image_url ? (
                                            <img
                                                src={imageFile ? URL.createObjectURL(imageFile) : formData.image_url}
                                                className="w-full h-48 object-cover rounded-2xl shadow-xl"
                                                alt="Preview"
                                            />
                                        ) : (
                                            <div className="p-4 bg-white rounded-2xl shadow-sm group-hover:scale-110 transition-transform">
                                                <ImageIcon className="text-gray-400 group-hover:text-primary transition-colors" size={32} />
                                            </div>
                                        )}
                                        <p className="text-sm font-medium text-gray-500">
                                            Hacer clic para subir imagen
                                        </p>
                                    </div>
                                    <input
                                        id="image-upload"
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                                    />
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
                                            editingSection ? 'Guardar Cambios' : 'Crear Sección'
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

export default HomeSections;
