import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { uploadImage } from '../../lib/storage';
import { Plus, Edit2, Trash2, Search, Image as ImageIcon, Check, X, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const Products = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [inventoryItems, setInventoryItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<any>(null);
    const [selectedMaterials, setSelectedMaterials] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState<'info' | 'costing'>('info');

    const [formData, setFormData] = useState({
        name: '',
        price: '',
        category_id: '',
        is_best_seller: false,
        image_url: '',
        description: '',
        content: '',
        delivery_time: '',
        policies: ''
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const { data: prods } = await supabase.from('products').select('*, categories(name)').order('created_at', { ascending: false });
            const { data: cats } = await supabase.from('categories').select('*').eq('type', 'product');
            const { data: inv } = await supabase.from('inventory_items').select('*').order('name');

            setProducts(prods || []);
            setCategories(cats || []);
            setInventoryItems(inv || []);
        } catch (error: any) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchProductMaterials = async (productId: string) => {
        const { data, error } = await supabase
            .from('product_materials')
            .select('*, inventory_items(*)')
            .eq('product_id', productId);

        if (!error && data) {
            setSelectedMaterials(data.map(m => ({
                id: m.material_id,
                name: m.inventory_items.name,
                unit: m.inventory_items.unit,
                unit_cost: m.inventory_items.unit_cost,
                quantity: m.quantity
            })));
        }
    };

    const handleOpenModal = (product: any = null) => {
        if (product) {
            setEditingProduct(product);
            setFormData({
                name: product.name,
                price: product.price.toString(),
                category_id: product.category_id,
                is_best_seller: product.is_best_seller,
                image_url: product.image_url,
                description: product.description || '',
                content: product.content || '',
                delivery_time: product.delivery_time || '',
                policies: product.policies || ''
            });
            fetchProductMaterials(product.id);
        } else {
            setEditingProduct(null);
            setSelectedMaterials([]);
            setFormData({
                name: '',
                price: '',
                category_id: '',
                is_best_seller: false,
                image_url: '',
                description: '',
                content: '',
                delivery_time: '',
                policies: ''
            });
        }
        setActiveTab('info');
        setImageFile(null);
        setIsModalOpen(true);
    };

    const calculateTotalCost = () => {
        return selectedMaterials.reduce((acc, m) => acc + (m.unit_cost * m.quantity), 0);
    };

    const handleAddMaterial = (materialId: string) => {
        const item = inventoryItems.find(i => i.id === materialId);
        if (item && !selectedMaterials.find(m => m.id === materialId)) {
            setSelectedMaterials([...selectedMaterials, { ...item, quantity: 1 }]);
        }
    };

    const handleRemoveMaterial = (id: string) => {
        setSelectedMaterials(selectedMaterials.filter(m => m.id !== id));
    };

    const updateMaterialQuantity = (id: string, qty: string) => {
        const numericQty = parseFloat(qty) || 0;
        setSelectedMaterials(selectedMaterials.map(m =>
            m.id === id ? { ...m, quantity: numericQty } : m
        ));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setUploading(true);

        try {
            let publicUrl = formData.image_url;
            if (imageFile) {
                publicUrl = await uploadImage(imageFile);
            }

            const productData = {
                name: formData.name,
                price: parseFloat(formData.price),
                category_id: formData.category_id,
                is_best_seller: formData.is_best_seller,
                image_url: publicUrl,
                description: formData.description,
                content: formData.content,
                delivery_time: formData.delivery_time,
                policies: formData.policies
            };

            let productId = editingProduct?.id;

            if (editingProduct) {
                const { error } = await supabase.from('products').update(productData).eq('id', editingProduct.id);
                if (error) throw error;
            } else {
                const { data, error } = await supabase.from('products').insert([productData]).select();
                if (error) throw error;
                productId = data[0].id;
            }

            // Update materials
            await supabase.from('product_materials').delete().eq('product_id', productId);
            if (selectedMaterials.length > 0) {
                const materialInserts = selectedMaterials.map(m => ({
                    product_id: productId,
                    material_id: m.id,
                    quantity: m.quantity
                }));
                await supabase.from('product_materials').insert(materialInserts);
            }

            toast.success(editingProduct ? 'Producto actualizado' : 'Producto creado');
            setIsModalOpen(false);
            fetchData();
        } catch (error: any) {
            console.error('Error saving product:', error);
            toast.error(error.message || 'Error al guardar');
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('¿Estás seguro de eliminar este producto?')) {
            try {
                const { error } = await supabase.from('products').delete().eq('id', id);
                if (error) throw error;
                toast.success('Producto eliminado');
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
                    <h2 className="text-3xl font-black text-gray-900">Productos</h2>
                    <p className="text-gray-500">Administra el catálogo de ramos de Janibox</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-primary text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
                >
                    <Plus size={20} />
                    Nuevo Producto
                </button>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                    <div className="relative w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar productos..."
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary/20"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 text-gray-400 text-xs font-black uppercase tracking-widest">
                                <th className="px-8 py-4">Producto</th>
                                <th className="px-8 py-4">Categoría</th>
                                <th className="px-8 py-4">Precio</th>
                                <th className="px-8 py-4 text-center">Best Seller</th>
                                <th className="px-8 py-4 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-12 text-center text-gray-400">Cargando productos...</td>
                                </tr>
                            ) : products.map((product: any) => (
                                <tr key={product.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-8 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden">
                                                <img src={product.image_url} alt="" className="w-full h-full object-cover" />
                                            </div>
                                            <span className="font-bold text-gray-800">{product.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-4 text-gray-500 font-medium">{product.categories?.name}</td>
                                    <td className="px-8 py-4 font-black text-gray-900">${product.price.toFixed(2)}</td>
                                    <td className="px-8 py-4 text-center">
                                        {product.is_best_seller ? (
                                            <span className="inline-flex items-center justify-center bg-green-50 text-green-600 p-1 rounded-full border border-green-100">
                                                <Check size={14} />
                                            </span>
                                        ) : (
                                            <span className="text-gray-300">—</span>
                                        )}
                                    </td>
                                    <td className="px-8 py-4 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleOpenModal(product)} className="p-2 text-gray-400 hover:text-primary transition-colors">
                                                <Edit2 size={18} />
                                            </button>
                                            <button onClick={() => handleDelete(product.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
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
                            className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
                        >
                            <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-white sticky top-0 z-10">
                                <h3 className="text-2xl font-black text-gray-900">{editingProduct ? 'Editar Producto' : 'Nuevo Producto'}</h3>
                                <div className="flex bg-gray-100 p-1 rounded-xl mx-4">
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab('info')}
                                        className={`px-4 py-2 rounded-lg font-bold transition-all ${activeTab === 'info' ? 'bg-white shadow-sm text-primary' : 'text-gray-500 hover:text-gray-700'}`}
                                    >
                                        Información
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab('costing')}
                                        className={`px-4 py-2 rounded-lg font-bold transition-all ${activeTab === 'costing' ? 'bg-white shadow-sm text-primary' : 'text-gray-500 hover:text-gray-700'}`}
                                    >
                                        Receta y Costos
                                    </button>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-800 transition-colors">
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                                {activeTab === 'info' ? (
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="col-span-2 space-y-2">
                                            <label className="text-sm font-bold text-gray-700 ml-1">Nombre del Producto</label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-primary/20"
                                                placeholder="Ej. Ramo Ferrero Luxury"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-700 ml-1">Precio de Venta ($)</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                required
                                                value={formData.price}
                                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                                className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-primary/20"
                                                placeholder="0.00"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-700 ml-1">Categoría</label>
                                            <select
                                                required
                                                value={formData.category_id}
                                                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                                                className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 appearance-none"
                                            >
                                                <option value="">Seleccionar...</option>
                                                {categories.map((cat: any) => (
                                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="col-span-2 py-4">
                                            <label className="flex items-center gap-3 cursor-pointer group">
                                                <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${formData.is_best_seller ? 'bg-primary border-primary' : 'border-gray-200 group-hover:border-primary'}`}>
                                                    {formData.is_best_seller && <Check size={16} className="text-white" />}
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    className="hidden"
                                                    checked={formData.is_best_seller}
                                                    onChange={(e) => setFormData({ ...formData, is_best_seller: e.target.checked })}
                                                />
                                                <span className="font-bold text-gray-800">Candidato a "Más Vendido"</span>
                                            </label>
                                        </div>

                                        <div className="col-span-2 space-y-2">
                                            <label className="text-sm font-bold text-gray-700 ml-1">Descripción</label>
                                            <textarea
                                                value={formData.description}
                                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 min-h-[80px]"
                                                placeholder="Descripción general del producto..."
                                            />
                                        </div>

                                        <div className="col-span-2 space-y-2">
                                            <label className="text-sm font-bold text-gray-700 ml-1">Contenido del Producto</label>
                                            <textarea
                                                value={formData.content}
                                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                                className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 min-h-[80px]"
                                                placeholder="Ej. - Caja de madera personalizada\n- Arreglo floral rosas..."
                                            />
                                        </div>

                                        <div className="col-span-2 space-y-2">
                                            <label className="text-sm font-bold text-gray-700 ml-1">Imagen del Producto</label>
                                            <div
                                                className="border-2 border-dashed border-gray-100 rounded-[2rem] p-10 flex flex-col items-center justify-center gap-4 bg-gray-50 hover:bg-gray-100/50 hover:border-primary/20 transition-all cursor-pointer group"
                                                onClick={() => document.getElementById('image-upload')?.click()}
                                            >
                                                {imageFile || formData.image_url ? (
                                                    <img
                                                        src={imageFile ? URL.createObjectURL(imageFile) : formData.image_url}
                                                        className="w-32 h-32 object-cover rounded-2xl shadow-xl"
                                                        alt="Preview"
                                                    />
                                                ) : (
                                                    <div className="p-4 bg-white rounded-2xl shadow-sm group-hover:scale-110 transition-transform">
                                                        <ImageIcon className="text-gray-400 group-hover:text-primary transition-colors" size={32} />
                                                    </div>
                                                )}
                                                <p className="text-sm font-medium text-gray-500">
                                                    Hacer clic para subir imagen <span className="text-primary font-bold">(Máx 2MB)</span>
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
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        <div className="bg-primary/5 p-6 rounded-[2rem] border border-primary/10">
                                            <div className="flex justify-between items-end">
                                                <div>
                                                    <p className="text-xs font-black uppercase text-primary/60 tracking-widest mb-1">Costo Estimado Producción</p>
                                                    <h4 className="text-4xl font-black text-primary">${calculateTotalCost().toFixed(2)}</h4>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs font-black uppercase text-gray-400 tracking-widest mb-1">Margen Bruto</p>
                                                    <p className={`text-2xl font-black ${calculateTotalCost() > parseFloat(formData.price) ? 'text-red-500' : 'text-green-500'}`}>
                                                        {formData.price && calculateTotalCost() > 0
                                                            ? `${(((parseFloat(formData.price) - calculateTotalCost()) / parseFloat(formData.price)) * 100).toFixed(0)}%`
                                                            : '--'
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <label className="text-sm font-bold text-gray-700 ml-1">Añadir Insumos a la Receta</label>
                                            <select
                                                className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 appearance-none"
                                                onChange={(e) => {
                                                    if (e.target.value) {
                                                        handleAddMaterial(e.target.value);
                                                        e.target.value = '';
                                                    }
                                                }}
                                            >
                                                <option value="">Seleccionar material del inventario...</option>
                                                {inventoryItems.map(item => (
                                                    <option key={item.id} value={item.id}>{item.name} (${item.unit_cost}/{item.unit})</option>
                                                ))}
                                            </select>

                                            <div className="space-y-2 mt-4">
                                                <p className="text-xs font-black uppercase text-gray-400 tracking-widest ml-1 mb-2">Materiales en este producto:</p>
                                                {selectedMaterials.length === 0 ? (
                                                    <div className="text-center py-12 border-2 border-dashed border-gray-100 rounded-[2rem] text-gray-400 flex flex-col items-center gap-2">
                                                        <Package size={32} className="opacity-20" />
                                                        <p className="font-medium text-sm">No has añadido materiales todavía</p>
                                                    </div>
                                                ) : (
                                                    selectedMaterials.map((m) => (
                                                        <div key={m.id} className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl group/item border border-transparent hover:border-primary/10 transition-all">
                                                            <div className="flex-1">
                                                                <p className="font-bold text-gray-800">{m.name}</p>
                                                                <p className="text-[10px] font-black uppercase text-gray-400 tracking-tighter">${m.unit_cost} / {m.unit}</p>
                                                            </div>
                                                            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl shadow-sm">
                                                                <input
                                                                    type="number"
                                                                    step="0.001"
                                                                    value={m.quantity}
                                                                    onChange={(e) => updateMaterialQuantity(m.id, e.target.value)}
                                                                    className="w-16 bg-transparent border-none text-right font-black text-primary focus:ring-0 p-0"
                                                                />
                                                                <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest border-l pl-2">{m.unit}</span>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleRemoveMaterial(m.id)}
                                                                className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                                                            >
                                                                <Trash2 size={18} />
                                                            </button>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="flex gap-4 pt-4 sticky bottom-0 bg-white border-t border-gray-50 mt-8 py-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex-1 px-6 py-4 rounded-2xl font-bold bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={uploading}
                                        className="flex-[2] bg-primary text-white px-6 py-4 rounded-2xl font-bold shadow-xl shadow-primary/30 hover:bg-primary-dark transition-all flex items-center justify-center gap-2"
                                    >
                                        {uploading ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        ) : (
                                            editingProduct ? 'Guardar Cambios' : 'Crear Producto'
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

export default Products;
