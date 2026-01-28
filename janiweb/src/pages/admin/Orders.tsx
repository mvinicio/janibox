import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import {
    ShoppingBag,
    Search,
    Filter,
    Download,
    Edit2,
    CheckCircle2,
    Clock,
    Truck,
    AlertCircle,
    Calendar,
    ChevronLeft,
    ChevronRight,
    MapPin,
    Phone,
    User
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const Orders = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sourceFilter, setSourceFilter] = useState('all');
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setOrders(data || []);
        } catch (error: any) {
            toast.error('Error al cargar órdenes: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (orderId: string, newStatus: string) => {
        setIsSaving(true);
        try {
            const { error } = await supabase
                .from('orders')
                .update({ status: newStatus })
                .eq('id', orderId);

            if (error) throw error;
            toast.success('Estado actualizado');
            setIsModalOpen(false);
            fetchOrders();
        } catch (error: any) {
            toast.error('Error al actualizar: ' + error.message);
        } finally {
            setIsSaving(false);
        }
    };

    const exportToCSV = () => {
        const headers = ['ID', 'Fecha', 'Cliente', 'Telefono', 'Direccion', 'Detalles Direccion', 'Total', 'Estado', 'Fuente', 'Tipo', 'Items'];
        const csvData = filteredOrders.map(order => [
            order.id,
            new Date(order.created_at).toLocaleDateString(),
            order.customer_name || 'N/A',
            order.customer_phone || 'N/A',
            order.delivery_address || 'N/A',
            order.address_details || 'N/A',
            order.total,
            order.status,
            order.order_source || 'app',
            order.order_type || 'delivery',
            order.items.map((i: any) => `${i.name} (x${i.quantity})`).join('; ')
        ]);

        const csvContent = [headers, ...csvData].map(e => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `ventas_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const filteredOrders = orders.filter(order => {
        const idMatch = order.id.toLowerCase().includes(searchTerm.toLowerCase());
        const customerMatch = order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSearch = idMatch || customerMatch;
        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
        const matchesSource = sourceFilter === 'all' || order.order_source === sourceFilter;
        return matchesSearch && matchesStatus && matchesSource;
    });

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'delivered': return 'bg-green-100 text-green-700 border-green-200';
            case 'out_for_delivery': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'preparing': return 'bg-orange-100 text-orange-700 border-orange-200';
            case 'received': return 'bg-purple-100 text-purple-700 border-purple-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'delivered': return <CheckCircle2 size={12} />;
            case 'out_for_delivery': return <Truck size={12} />;
            case 'preparing': return <Clock size={12} />;
            case 'received': return <ShoppingBag size={12} />;
            default: return <AlertCircle size={12} />;
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black text-gray-900">Gestión de Órdenes</h2>
                    <p className="text-gray-500">Control de pedidos locales, a domicilio y por la app</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl border border-red-100 animate-pulse">
                        <AlertCircle size={14} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Atención Requerida</span>
                    </div>
                    <button
                        onClick={exportToCSV}
                        className="flex items-center gap-2 px-5 py-3 bg-white border border-gray-200 rounded-2xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-sm"
                    >
                        <Download size={18} />
                        Exportar CSV
                    </button>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-wrap items-center gap-4">
                <div className="flex-grow relative min-w-[300px]">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar por ID o cliente..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-primary/20 transition-all font-inter"
                    />
                </div>

                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-6 py-3.5 bg-gray-50 border-none rounded-2xl text-sm font-bold text-gray-600 focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer"
                >
                    <option value="all">Todos los Estados</option>
                    <option value="received">Recibido</option>
                    <option value="preparing">Preparando</option>
                    <option value="out_for_delivery">En Camino</option>
                    <option value="delivered">Entregado</option>
                </select>

                <select
                    value={sourceFilter}
                    onChange={(e) => setSourceFilter(e.target.value)}
                    className="px-6 py-3.5 bg-gray-50 border-none rounded-2xl text-sm font-bold text-gray-600 focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer"
                >
                    <option value="all">Todas las Fuentes</option>
                    <option value="app">Web App</option>
                    <option value="local">Tienda Local</option>
                </select>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden font-inter">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50 border-b border-gray-100">
                            <tr className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
                                <th className="px-8 py-5">Orden</th>
                                <th className="px-8 py-5">Cliente</th>
                                <th className="px-8 py-5">Productos</th>
                                <th className="px-8 py-5">Total</th>
                                <th className="px-8 py-5">Estado</th>
                                <th className="px-8 py-5 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-8 py-10 text-center text-gray-400 font-bold uppercase tracking-widest text-[10px]">Cargando órdenes...</td>
                                </tr>
                            ) : filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-8 py-10 text-center text-gray-400 font-bold uppercase tracking-widest text-[10px]">No se encontraron órdenes.</td>
                                </tr>
                            ) : filteredOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-primary/5 transition-colors group">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                                                <ShoppingBag size={18} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900 text-sm">#{order.id.slice(-8).toUpperCase()}</p>
                                                <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-black uppercase tracking-tighter">
                                                    <Calendar size={10} />
                                                    {new Date(order.created_at).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="space-y-0.5">
                                            <p className="font-bold text-gray-800 text-sm">{order.customer_name || 'Sin nombre'}</p>
                                            <p className="text-xs text-gray-500 font-medium">{order.customer_phone || 'Sin telefono'}</p>
                                            <div className="flex items-center gap-1 mt-1">
                                                <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-black uppercase tracking-tighter ${order.order_source === 'local' ? 'bg-indigo-100 text-indigo-600' : 'bg-primary/10 text-primary'}`}>
                                                    {order.order_source || 'app'}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex -space-x-2 overflow-hidden">
                                            {order.items.slice(0, 3).map((item: any, idx: number) => (
                                                <div key={idx} className="w-8 h-8 rounded-full bg-white border-2 border-gray-50 overflow-hidden flex items-center justify-center text-[10px] font-bold text-gray-400">
                                                    {item.image_url ? (
                                                        <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        item.name.charAt(0)
                                                    )}
                                                </div>
                                            ))}
                                            {order.items.length > 3 && (
                                                <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-gray-500">
                                                    +{order.items.length - 3}
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-[10px] text-gray-400 mt-1.5 font-bold uppercase tracking-tighter">
                                            {order.items.length} {order.items.length === 1 ? 'Producto' : 'Productos'}
                                        </p>
                                    </td>
                                    <td className="px-8 py-5">
                                        <p className="text-lg font-black text-gray-900 tracking-tight">${order.total.toFixed(2)}</p>
                                        <p className="text-[9px] uppercase font-black text-gray-400 tracking-widest">{order.payment_status || 'pending'}</p>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-3">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border shadow-sm ${getStatusStyle(order.status)}`}>
                                                {getStatusIcon(order.status)}
                                                {order.status === 'received' ? 'Recibido' :
                                                    order.status === 'preparing' ? 'Preparando' :
                                                        order.status === 'out_for_delivery' ? 'En Camino' :
                                                            order.status === 'delivered' ? 'Entregado' : (order.status || 'Recibido')}
                                            </span>
                                            {order.status !== 'delivered' && (new Date().getTime() - new Date(order.created_at).getTime() > 30 * 60 * 1000) && (
                                                <div className="text-red-500 animate-bounce" title="Orden pausada o sin movimiento">
                                                    <AlertCircle size={16} />
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <button
                                            onClick={() => { setSelectedOrder(order); setIsModalOpen(true); }}
                                            className="p-3 bg-gray-50 rounded-2xl text-gray-400 hover:bg-primary/10 hover:text-primary transition-all group-hover:scale-105"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="bg-gray-50/50 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                        Mostrando <span className="text-gray-900">{filteredOrders.length}</span> resultados
                    </p>
                    <div className="flex items-center gap-2">
                        <button className="p-3 bg-white border border-gray-200 rounded-xl text-gray-400 disabled:opacity-50" disabled>
                            <ChevronLeft size={16} />
                        </button>
                        <div className="flex items-center gap-1 px-4">
                            <span className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center text-xs font-black shadow-sm">1</span>
                        </div>
                        <button className="p-3 bg-white border border-gray-200 rounded-xl text-gray-400 disabled:opacity-50" disabled>
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Edit Order Modal */}
            <AnimatePresence>
                {isModalOpen && selectedOrder && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.95 }}
                            className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden font-inter"
                        >
                            <div className="bg-gray-50/50 p-8 border-b border-gray-100 flex justify-between items-center">
                                <div>
                                    <h3 className="text-2xl font-black text-gray-900 tracking-tight">Detalles de Orden</h3>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">#{selectedOrder.id.toUpperCase()}</p>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-white rounded-2xl transition-all">
                                    <ChevronLeft size={20} className="text-gray-400 rotate-45" />
                                </button>
                            </div>

                            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div>
                                        <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-4 block">Estado de la Orden</label>
                                        <div className="grid grid-cols-1 gap-2">
                                            {[
                                                { id: 'received', label: 'Recibido', color: 'bg-purple-500' },
                                                { id: 'preparing', label: 'Preparando', color: 'bg-orange-500' },
                                                { id: 'out_for_delivery', label: 'En Camino', color: 'bg-blue-500' },
                                                { id: 'delivered', label: 'Entregado', color: 'bg-green-500' }
                                            ].map((status) => (
                                                <button
                                                    key={status.id}
                                                    onClick={() => handleUpdateStatus(selectedOrder.id, status.id)}
                                                    className={`p-4 rounded-2xl border-2 flex items-center justify-between transition-all ${selectedOrder.status === status.id ? 'border-primary bg-primary/5' : 'border-gray-50 bg-gray-50 hover:border-gray-200'}`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-3 h-3 rounded-full ${status.color}`} />
                                                        <span className={`text-sm font-bold ${selectedOrder.status === status.id ? 'text-primary' : 'text-gray-600'}`}>
                                                            {status.label}
                                                        </span>
                                                    </div>
                                                    {selectedOrder.status === status.id && <CheckCircle2 size={16} className="text-primary" />}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100">
                                        <h4 className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-4">Información del Cliente</h4>
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-primary shadow-sm group">
                                                    <User size={14} />
                                                </div>
                                                <p className="text-sm font-bold text-gray-700">{selectedOrder.customer_name || 'No proporcionado'}</p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-primary shadow-sm">
                                                    <Phone size={14} />
                                                </div>
                                                <p className="text-sm font-bold text-gray-700">{selectedOrder.customer_phone || 'No proporcionado'}</p>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-primary shadow-sm shrink-0">
                                                    <MapPin size={14} />
                                                </div>
                                                <p className="text-sm font-bold text-gray-700 leading-tight">
                                                    {typeof selectedOrder.delivery_address === 'string' ? selectedOrder.delivery_address : (selectedOrder.address?.full || 'Sin dirección')}
                                                    {selectedOrder.address_details && (
                                                        <span className="block text-[10px] text-gray-400 font-medium mt-1">
                                                            Ref: {selectedOrder.address_details}
                                                        </span>
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-primary/5 p-6 rounded-[2rem] border border-primary/10">
                                        <h4 className="text-[10px] uppercase font-black text-primary/60 tracking-widest mb-4">Resumen de Pago</h4>
                                        <div className="flex justify-between items-end">
                                            <div>
                                                <p className="text-2xl font-black text-primary tracking-tighter">${selectedOrder.total.toFixed(2)}</p>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-primary/40">Vía {selectedOrder.payment_method || 'Tarjeta'}</p>
                                            </div>
                                            <div className={`px-3 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-widest border ${selectedOrder.payment_status === 'paid' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-orange-100 text-orange-700 border-orange-200'}`}>
                                                {selectedOrder.payment_status === 'paid' ? 'Pagado' : 'Pendiente'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 bg-gray-50/50 border-t border-gray-100 flex justify-end gap-3">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-8 py-4 bg-white border border-gray-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:bg-gray-100 transition-all"
                                >
                                    Cerrar
                                </button>
                                <button
                                    disabled={isSaving}
                                    className="px-8 py-4 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                                >
                                    {isSaving ? 'Guardando...' : 'Guardar'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Orders;
