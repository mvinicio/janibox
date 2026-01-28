import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import {
    TrendingUp,
    DollarSign,
    AlertCircle,
    PieChart,
    ArrowUpRight
} from 'lucide-react';
import { motion } from 'framer-motion';

const Finances = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [operatingCosts, setOperatingCosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        revenue: 0,
        cogs: 0,
        operatingExpenses: 0,
        netProfit: 0,
        margin: 0
    });

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            const { data: orderData } = await supabase
                .from('orders')
                .select('*')
                .order('created_at', { ascending: false });

            const { data: costData } = await supabase
                .from('operating_costs')
                .select('*');

            const { data: materialData } = await supabase
                .from('product_materials')
                .select('*, inventory_items(*)');

            let totalRevenue = 0;
            let totalCogs = 0;

            const productCostMap: Record<string, number> = {};
            materialData?.forEach(m => {
                const cost = (m.inventory_items.unit_cost * m.quantity);
                productCostMap[m.product_id] = (productCostMap[m.product_id] || 0) + cost;
            });

            const processedOrders = orderData?.map(order => {
                let orderCogs = 0;
                order.items.forEach((item: any) => {
                    const unitCost = productCostMap[item.id] || 0;
                    orderCogs += (unitCost * item.quantity);
                });

                totalRevenue += order.total;
                totalCogs += orderCogs;

                return {
                    ...order,
                    cogs: orderCogs,
                    profit: order.total - orderCogs,
                    margin: order.total > 0 ? ((order.total - orderCogs) / order.total) * 100 : 0
                };
            }) || [];

            const totalOpExpenses = costData?.reduce((acc, c) => acc + c.amount, 0) || 0;
            const netProfit = totalRevenue - totalCogs - totalOpExpenses;

            setStats({
                revenue: totalRevenue,
                cogs: totalCogs,
                operatingExpenses: totalOpExpenses,
                netProfit: netProfit,
                margin: totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0
            });

            setOrders(processedOrders);
            setOperatingCosts(costData || []);

        } catch (error) {
            console.error('Error fetching financial data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="p-10 text-center text-gray-400">Calculando finanzas...</div>;
    }

    return (
        <div className="space-y-10">
            <div>
                <h2 className="text-3xl font-black text-gray-900">Dashboard Financiero</h2>
                <p className="text-gray-500">Visión real de rentabilidad cruzando ventas, insumos y gastos</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card
                    title="Ingresos Totales"
                    value={`$${stats.revenue.toFixed(2)}`}
                    icon={<DollarSign className="text-green-500" />}
                    subtitle="Ventas brutas acumuladas"
                />
                <Card
                    title="Costo de Insumos (COGS)"
                    value={`$${stats.cogs.toFixed(2)}`}
                    icon={<AlertCircle className="text-orange-500" />}
                    subtitle="Materiales consumidos en pedidos"
                />
                <Card
                    title="Gastos Administrativos"
                    value={`$${stats.operatingExpenses.toFixed(2)}`}
                    icon={<PieChart className="text-blue-500" />}
                    subtitle="Alquiler, servicios, publicidad"
                />
                <Card
                    title="Utilidad Neta Real"
                    value={`$${stats.netProfit.toFixed(2)}`}
                    icon={<TrendingUp className="text-primary" />}
                    highlight
                    subtitle={`${stats.margin.toFixed(1)}% de margen neto`}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-8 border-b border-gray-50 flex justify-between items-center">
                        <h3 className="text-xl font-black text-gray-900">Rentabilidad por Pedido</h3>
                        <button className="text-primary font-bold text-sm hover:underline">Ver todos</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50/50">
                                <tr className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
                                    <th className="px-8 py-4">Pedido</th>
                                    <th className="px-8 py-4">Venta</th>
                                    <th className="px-8 py-4">Costo Insumos</th>
                                    <th className="px-8 py-4">Utilidad Bruta</th>
                                    <th className="px-8 py-4 text-right">%</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {orders.slice(0, 8).map((order) => (
                                    <tr key={order.id} className="hover:bg-primary/5 transition-colors group">
                                        <td className="px-8 py-4">
                                            <p className="font-bold text-gray-800 text-sm">#{order.id.slice(0, 8)}</p>
                                            <p className="text-[10px] text-gray-400">{new Date(order.created_at).toLocaleDateString()}</p>
                                        </td>
                                        <td className="px-8 py-4 font-bold text-gray-900">${order.total.toFixed(2)}</td>
                                        <td className="px-8 py-4 text-orange-600 font-medium">${order.cogs.toFixed(2)}</td>
                                        <td className="px-8 py-4">
                                            <span className={`font-black ${order.profit > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                                ${order.profit.toFixed(2)}
                                            </span>
                                        </td>
                                        <td className="px-8 py-4 text-right font-bold text-gray-400 text-sm">
                                            {order.margin.toFixed(0)}%
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                        <h3 className="text-xl font-black text-gray-900 mb-6">Breakdown de Gastos</h3>
                        <div className="space-y-4">
                            {operatingCosts.map(cost => (
                                <div key={cost.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl">
                                    <div>
                                        <p className="font-bold text-gray-800 text-sm">{cost.name}</p>
                                        <p className="text-[10px] uppercase font-black text-gray-400 tracking-tighter">{cost.type}</p>
                                    </div>
                                    <p className="font-black text-gray-900">${cost.amount.toFixed(2)}</p>
                                </div>
                            ))}
                            <div className="pt-4 border-t border-gray-100 flex justify-between items-center px-2">
                                <span className="font-black text-gray-400 uppercase text-xs">Total Gasto Fijo/Mes</span>
                                <span className="font-black text-gray-900 text-xl">${stats.operatingExpenses.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-primary p-8 rounded-[2.5rem] shadow-xl shadow-primary/20 text-white relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="font-black text-lg mb-2">Salud Financiera</h3>
                            <p className="text-white/60 text-sm mb-6">Basado en tus últimos periodos</p>
                            <div className="flex items-end gap-3 mb-2">
                                <h4 className="text-4xl font-black tracking-tighter">{stats.margin.toFixed(1)}%</h4>
                                <ArrowUpRight className="mb-2" />
                            </div>
                            <p className="text-xs font-bold uppercase tracking-widest text-white/40">Margen Neto Promedio</p>
                        </div>
                        <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Card = ({ title, value, icon, subtitle, highlight = false }: any) => (
    <motion.div
        whileHover={{ y: -5 }}
        className={`p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col gap-4 relative overflow-hidden ${highlight ? 'bg-primary text-white border-primary shadow-xl shadow-primary/20' : 'bg-white'}`}
    >
        <div className="flex justify-between items-start">
            <div className={`p-4 rounded-2xl ${highlight ? 'bg-white/20 text-white' : 'bg-gray-50'}`}>
                {icon}
            </div>
            {highlight && <div className="p-2 bg-white/10 rounded-full"><TrendingUp size={16} /></div>}
        </div>
        <div>
            <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${highlight ? 'text-white/60' : 'text-gray-400'}`}>{title}</p>
            <h4 className="text-3xl font-black tracking-tight">{value}</h4>
            <p className={`text-xs mt-2 ${highlight ? 'text-white/70' : 'text-gray-500'}`}>{subtitle}</p>
        </div>
        {highlight && (
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
        )}
    </motion.div>
);

export default Finances;
