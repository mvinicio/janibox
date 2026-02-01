import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Search, Mail, Copy, User, ShoppingBag, Edit2, Phone, MapPin, X, Upload, Save, FileText, Smartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const Customers = () => {
    const [customers, setCustomers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Edit Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState<any>(null);
    const [formData, setFormData] = useState({
        full_name: '',
        phone: '',
        address: '',
        tax_id: '',
        notes: '',
        avatar_url: ''
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setCustomers(data || []);
        } catch (error: any) {
            console.error('Error fetching customers:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (customer: any) => {
        setEditingCustomer(customer);
        setFormData({
            full_name: customer.full_name || '',
            phone: customer.phone || '',
            address: customer.address || '',
            tax_id: customer.tax_id || '',
            notes: customer.notes || '',
            avatar_url: customer.avatar_url || ''
        });
        setImageFile(null);
        setIsModalOpen(true);
    };

    const handleImageUpload = async (file: File) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        try {
            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
            return data.publicUrl;
        } catch (error) {
            console.error('Error uploading image:', error);
            throw error;
        }
    };

    const handleSave = async () => {
        try {
            setUploading(true);
            let avatarUrl = formData.avatar_url;

            if (imageFile) {
                avatarUrl = await handleImageUpload(imageFile);
            }

            const { error } = await supabase
                .from('profiles')
                .update({
                    full_name: formData.full_name,
                    phone: formData.phone,
                    address: formData.address,
                    tax_id: formData.tax_id,
                    notes: formData.notes,
                    avatar_url: avatarUrl
                })
                .eq('id', editingCustomer.id);

            if (error) throw error;

            toast.success('Cliente actualizado');
            fetchCustomers();
            setIsModalOpen(false);
        } catch (error) {
            console.error(error);
            toast.error('Error al guardar');
        } finally {
            setUploading(false);
        }
    };

    const getAvatarUrl = (name: string, avatarUrl?: string) => {
        if (avatarUrl) return avatarUrl;
        return `https://api.dicebear.com/7.x/notionists/svg?seed=${name || 'User'}&gesture=happy`;
    };

    const handleCopyEmails = () => {
        const emails = customers.map(c => c.email).filter(Boolean);
        navigator.clipboard.writeText(emails.join(', '));
        toast.success(`${emails.length} emails copiados al portapapeles`);
    };

    const handleSendEmail = () => {
        const emails = customers.map(c => c.email).filter(Boolean);
        window.location.href = `mailto:?bcc=${emails.join(',')}`;
    };

    const filteredCustomers = customers.filter(c =>
        c.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.phone?.includes(searchTerm)
    );

    return (
        <div className="space-y-8 font-inter">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">Clientes</h2>
                    <p className="text-gray-500 font-medium">Gestiona tu base de datos de usuarios.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleCopyEmails}
                        className="bg-white text-gray-700 border border-gray-200 px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-gray-50 transition-colors"
                    >
                        <Copy size={20} />
                        <span className="hidden sm:inline">Copiar Emails</span>
                    </button>
                    <button
                        onClick={handleSendEmail}
                        className="bg-primary text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
                    >
                        <Mail size={20} />
                        <span>Enviar Email Marketing</span>
                    </button>
                </div>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Buscar por nombre, email o teléfono..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border border-gray-100 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium shadow-sm"
                />
            </div>

            {/* List */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full py-12 text-center text-gray-400">Cargando clientes...</div>
                ) : filteredCustomers.length === 0 ? (
                    <div className="col-span-full py-12 text-center">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                            <User size={32} />
                        </div>
                        <p className="text-gray-400 font-medium">No se encontraron clientes</p>
                    </div>
                ) : (
                    filteredCustomers.map((customer) => (
                        <motion.div
                            key={customer.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-start gap-4 hover:shadow-md transition-shadow group relative"
                        >
                            <button
                                onClick={() => handleEditClick(customer)}
                                className="absolute top-4 right-4 p-2 bg-gray-50 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-xl transition-colors"
                            >
                                <Edit2 size={16} />
                            </button>

                            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-100">
                                <img
                                    src={getAvatarUrl(customer.full_name, customer.avatar_url)}
                                    alt={customer.full_name}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <div className="flex-grow min-w-0 pr-8">
                                <h3 className="font-bold text-gray-900 truncate">{customer.full_name || 'Usuario sin nombre'}</h3>
                                <p className="text-sm text-gray-500 truncate mb-1">{customer.email}</p>

                                <div className="flex flex-col gap-2 mt-3">
                                    {customer.phone ? (
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <Smartphone size={12} className="text-green-500" />
                                            <span className="truncate">{customer.phone}</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 text-xs text-gray-300">
                                            <Smartphone size={12} />
                                            <span>Sin teléfono</span>
                                        </div>
                                    )}

                                    {customer.address ? (
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <MapPin size={12} className="text-orange-500" />
                                            <span className="truncate">{customer.address}</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 text-xs text-gray-300">
                                            <MapPin size={12} />
                                            <span>Sin dirección</span>
                                        </div>
                                    )}

                                    {customer.tax_id && (
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <FileText size={12} className="text-blue-500" />
                                            <span className="truncate">RUC/CI: {customer.tax_id}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            {/* Edit Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
                        >
                            {/* Modal Header */}
                            <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                <div>
                                    <h3 className="text-xl font-black text-gray-900">Editar Cliente</h3>
                                    <p className="text-sm text-gray-500">Actualiza los datos del usuario.</p>
                                </div>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                                >
                                    <X size={20} className="text-gray-400" />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="p-8 overflow-y-auto custom-scrollbar">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                    {/* Avatar Upload */}
                                    <div className="col-span-full">
                                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">
                                            Foto de Perfil
                                        </label>
                                        <div className="flex items-center gap-6">
                                            <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gray-50 border border-gray-200">
                                                <img
                                                    src={imageFile ? URL.createObjectURL(imageFile) : getAvatarUrl(formData.full_name, formData.avatar_url)}
                                                    alt="Preview"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <label className="cursor-pointer inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-xl font-bold text-gray-700 hover:bg-gray-50 transition-colors">
                                                    <Upload size={18} />
                                                    <span>Subir Nueva Foto</span>
                                                    <input
                                                        type="file"
                                                        hidden
                                                        accept="image/*"
                                                        onChange={(e) => {
                                                            if (e.target.files?.[0]) setImageFile(e.target.files[0]);
                                                        }}
                                                    />
                                                </label>
                                                <p className="mt-2 text-xs text-gray-400">JPG, PNG o GIF. Máximo 2MB.</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Fields */}
                                    <div className="col-span-full md:col-span-1 space-y-2">
                                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">Nombre Completo</label>
                                        <input
                                            type="text"
                                            value={formData.full_name}
                                            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                            className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-primary/20"
                                        />
                                    </div>

                                    <div className="col-span-full md:col-span-1 space-y-2">
                                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">RUC / Cédula (Tax ID)</label>
                                        <input
                                            type="text"
                                            value={formData.tax_id}
                                            onChange={(e) => setFormData({ ...formData, tax_id: e.target.value })}
                                            className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-primary/20"
                                            placeholder="Detalle para facturación"
                                        />
                                    </div>

                                    <div className="col-span-full md:col-span-1 space-y-2">
                                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">Teléfono</label>
                                        <input
                                            type="text"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-primary/20"
                                        />
                                    </div>

                                    <div className="col-span-full md:col-span-1 space-y-2">
                                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">Dirección</label>
                                        <input
                                            type="text"
                                            value={formData.address}
                                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                            className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-primary/20"
                                        />
                                    </div>

                                    <div className="col-span-full space-y-2">
                                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">Notas Internas</label>
                                        <textarea
                                            rows={3}
                                            value={formData.notes}
                                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                            className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                                            placeholder="Notas privadas sobre este cliente..."
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="px-8 py-6 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-6 py-3 font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={uploading}
                                    className="px-8 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-105 transition-transform flex items-center gap-2 disabled:opacity-50"
                                >
                                    {uploading ? (
                                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <Save size={18} />
                                    )}
                                    {uploading ? 'Guardando...' : 'Guardar Cambios'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Customers;
