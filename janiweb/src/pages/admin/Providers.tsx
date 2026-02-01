import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Plus, Edit2, Trash2, X, Phone, Mail, MapPin, User, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const Providers = () => {
    const [providers, setProviders] = useState<any[]>([]);
    const [filteredProviders, setFilteredProviders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProvider, setEditingProvider] = useState<any>(null);
    const [saving, setSaving] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        contact_name: '',
        phone: '',
        email: '',
        address: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredProviders(providers);
        } else {
            const lower = searchTerm.toLowerCase();
            setFilteredProviders(providers.filter(p =>
                p.name.toLowerCase().includes(lower) ||
                (p.contact_name && p.contact_name.toLowerCase().includes(lower))
            ));
        }
    }, [searchTerm, providers]);

    const fetchData = async () => {
        setLoading(true);
        const { data, error } = await supabase.from('providers').select('*').order('name');
        if (error) {
            toast.error('Error al cargar proveedores');
            console.error(error);
        } else {
            setProviders(data || []);
            setFilteredProviders(data || []);
        }
        setLoading(false);
    };

    const handleOpenModal = (provider: any = null) => {
        if (provider) {
            setEditingProvider(provider);
            setFormData({
                name: provider.name,
                contact_name: provider.contact_name || '',
                phone: provider.phone || '',
                email: provider.email || '',
                address: provider.address || ''
            });
        } else {
            setEditingProvider(null);
            setFormData({ name: '', contact_name: '', phone: '', email: '', address: '' });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (editingProvider) {
                const { error } = await supabase.from('providers').update(formData).eq('id', editingProvider.id);
                if (error) throw error;
                toast.success('Proveedor actualizado');
            } else {
                const { error } = await supabase.from('providers').insert([formData]);
                if (error) throw error;
                toast.success('Proveedor creado');
            }
            setIsModalOpen(false);
            fetchData();
        } catch (error: any) {
            console.error('Error saving provider:', error);
            toast.error(error.message || 'Error al guardar');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('¿Eliminar proveedor? Los productos asociados quedarán sin proveedor asignado.')) {
            try {
                const { error } = await supabase.from('providers').delete().eq('id', id);
                if (error) throw error;
                toast.success('Proveedor eliminado');
                fetchData();
            } catch (error: any) {
                toast.error(error.message);
            }
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-black text-gray-900">Proveedores</h2>
                    <p className="text-gray-500">Gestiona tu lista de proveedores y contactos.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-primary text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
                >
                    <Plus size={20} />
                    Nuevo Proveedor
                </button>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Buscar proveedor o contacto..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white rounded-2xl border border-gray-100 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {loading ? (
                    <p className="text-gray-400">Cargando...</p>
                ) : filteredProviders.length === 0 ? (
                    <div className="col-span-full py-12 text-center text-gray-400 font-medium bg-white rounded-3xl border border-dashed border-gray-200">
                        {providers.length === 0 ? 'No hay proveedores registrados.' : 'No se encontraron resultados.'}
                    </div>
                ) : (
                    filteredProviders.map((prov) => (
                        <motion.div
                            key={prov.id}
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col justify-between group h-full relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                <button onClick={() => handleOpenModal(prov)} className="p-2 bg-white rounded-full shadow-sm text-gray-400 hover:text-primary transition-colors">
                                    <Edit2 size={16} />
                                </button>
                                <button onClick={() => handleDelete(prov.id)} className="p-2 bg-white rounded-full shadow-sm text-gray-400 hover:text-red-500 transition-colors">
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            <div className="mb-6">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center font-black text-lg">
                                        {prov.name.charAt(0).toUpperCase()}
                                    </div>
                                    <h4 className="font-bold text-gray-900 text-lg leading-tight">{prov.name}</h4>
                                </div>
                                {prov.contact_name && (
                                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-1 ml-1">
                                        <User size={14} className="text-gray-400" />
                                        <span>{prov.contact_name}</span>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2 mt-auto pt-4 border-t border-gray-50">
                                {prov.phone && (
                                    <div className="flex items-center gap-3 text-sm font-medium text-gray-600 bg-gray-50/50 p-2 rounded-xl">
                                        <div className="w-6 h-6 rounded-lg bg-green-50 text-green-500 flex items-center justify-center shrink-0">
                                            <Phone size={12} />
                                        </div>
                                        {prov.phone}
                                    </div>
                                )}
                                {prov.email && (
                                    <div className="flex items-center gap-3 text-sm font-medium text-gray-600 bg-gray-50/50 p-2 rounded-xl">
                                        <div className="w-6 h-6 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
                                            <Mail size={12} />
                                        </div>
                                        <span className="truncate">{prov.email}</span>
                                    </div>
                                )}
                                {prov.address && (
                                    <div className="flex items-center gap-3 text-sm font-medium text-gray-600 bg-gray-50/50 p-2 rounded-xl">
                                        <div className="w-6 h-6 rounded-lg bg-purple-50 text-purple-500 flex items-center justify-center shrink-0">
                                            <MapPin size={12} />
                                        </div>
                                        <span className="truncate">{prov.address}</span>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))
                )}
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
                            className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto custom-scrollbar"
                        >
                            <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-white sticky top-0 z-10">
                                <h3 className="text-2xl font-black text-gray-900">{editingProvider ? 'Editar Proveedor' : 'Nuevo Proveedor'}</h3>
                                <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-800 transition-colors">
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-8 space-y-6">
                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <label className="text-sm font-bold text-gray-700 ml-1">Nombre Comercial <span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 font-medium"
                                            placeholder="Ej. Distribuidora de Flores S.A."
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-sm font-bold text-gray-700 ml-1">Nombre de Contacto</label>
                                        <input
                                            type="text"
                                            value={formData.contact_name}
                                            onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                                            className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-primary/20"
                                            placeholder="Ej. Juan Pérez"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-sm font-bold text-gray-700 ml-1">Teléfono</label>
                                            <input
                                                type="tel"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-primary/20"
                                                placeholder="+593..."
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-sm font-bold text-gray-700 ml-1">Email</label>
                                            <input
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-primary/20"
                                                placeholder="contacto@empresa.com"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-sm font-bold text-gray-700 ml-1">Dirección / Ubicación</label>
                                        <textarea
                                            rows={2}
                                            value={formData.address}
                                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                            className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                                            placeholder="Dirección del local o bodega..."
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4 border-t border-gray-50 mt-4">
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
                                            editingProvider ? 'Guardar Cambios' : 'Registrar Proveedor'
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

export default Providers;
