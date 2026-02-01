import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import {
    Package,
    Grid,
    LogOut,
    LayoutDashboard,
    Box,
    ChevronRight,
    Settings,
    Layout,
    DollarSign,
    ClipboardList,
    BarChart3,
    ShoppingBag,
    Sparkles,
    Truck,
    Users
} from 'lucide-react';
import { JaniboxLogo } from '../../components/shared/Logos';

const Dashboard = () => {
    const navigate = useNavigate();

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        navigate('/admin/login');
    };

    const menuGroups = [
        {
            title: 'Gestión de Negocio',
            color: 'text-blue-500',
            bgColor: 'bg-blue-50',
            activeBg: 'bg-blue-100',
            activeText: 'text-blue-700',
            items: [
                { icon: ShoppingBag, label: 'Ordenes', path: '/admin/orders' },
                { icon: BarChart3, label: 'Finanzas', path: '/admin/finances' },
                { icon: ClipboardList, label: 'Inventario', path: '/admin/inventory' },
                { icon: Truck, label: 'Proveedores', path: '/admin/providers' },
                { icon: Users, label: 'Clientes', path: '/admin/customers' },
                { icon: DollarSign, label: 'Costos Operativos', path: '/admin/costs' },
                { icon: Settings, label: 'Configuración', path: '/admin/settings' },
            ]
        },
        {
            title: 'Catálogo y Contenido',
            color: 'text-purple-500',
            bgColor: 'bg-purple-50',
            activeBg: 'bg-purple-100',
            activeText: 'text-purple-700',
            items: [
                { icon: Package, label: 'Productos', path: '/admin/products' },
                { icon: Grid, label: 'Categorías', path: '/admin/categories' },
                { icon: Box, label: 'Bases y Dulces', path: '/admin/customization' },
                { icon: Layout, label: 'Secciones Home', path: '/admin/home-sections' },
            ]
        },
        {
            title: 'Marketing e IA',
            color: 'text-pink-500',
            bgColor: 'bg-pink-50',
            activeBg: 'bg-pink-100',
            activeText: 'text-pink-700',
            items: [
                { icon: Sparkles, label: 'Herramientas IA', path: '/admin/marketing' },
                { icon: ShoppingBag, label: 'Cupones', path: '/admin/rewards' },
            ]
        }
    ];

    return (
        <div className="flex min-h-screen bg-gray-50 font-inter">
            {/* Sidebar */}
            <aside className="w-72 bg-white border-r border-gray-100 flex flex-col fixed h-full z-20">
                <div className="p-8">
                    <div className="flex items-center gap-3">
                        <JaniboxLogo className="w-8 h-8 text-primary" />
                        <span className="text-xl font-black tracking-tight text-gray-900">
                            JANI<span className="text-primary">ADMIN</span>
                        </span>
                    </div>
                </div>

                <div className="flex-1 px-4 space-y-8 mt-4 overflow-y-auto pb-8 custom-scrollbar">
                    {/* General Summary */}
                    <nav className="space-y-1">
                        <NavLink
                            to="/admin"
                            end
                            className={({ isActive }) => `
                                flex items-center justify-between p-4 rounded-2xl font-bold transition-all group
                                ${isActive
                                    ? 'bg-primary/10 text-primary'
                                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                }
                            `}
                        >
                            <div className="flex items-center gap-4">
                                <LayoutDashboard size={20} />
                                <span>Resumen</span>
                            </div>
                            <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                        </NavLink>
                    </nav>

                    {menuGroups.map((group, idx) => (
                        <div key={idx} className="space-y-3">
                            <h3 className="px-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                                {group.title}
                            </h3>
                            <nav className="space-y-1">
                                {group.items.map((item) => (
                                    <NavLink
                                        key={item.path}
                                        to={item.path}
                                        className={({ isActive }) => `
                                            flex items-center justify-between p-4 rounded-2xl font-bold transition-all group
                                            ${isActive
                                                ? `${group.activeBg} ${group.activeText}`
                                                : `text-gray-500 hover:${group.bgColor} hover:${group.activeText}`
                                            }
                                        `}
                                    >
                                        {({ isActive }) => (
                                            <>
                                                <div className="flex items-center gap-4">
                                                    <item.icon
                                                        size={20}
                                                        className={isActive ? group.activeText : 'text-gray-400 group-hover:text-current'}
                                                    />
                                                    <span>{item.label}</span>
                                                </div>
                                                <ChevronRight
                                                    size={16}
                                                    className={`transition-all duration-300 group-hover:translate-x-1 ${isActive ? 'opacity-100' : 'opacity-0'}`}
                                                />
                                            </>
                                        )}
                                    </NavLink>
                                ))}
                            </nav>
                        </div>
                    ))}
                </div>

                <div className="p-4 border-t border-gray-50">
                    <button
                        onClick={handleSignOut}
                        className="flex items-center gap-4 w-full p-4 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all font-bold group"
                    >
                        <LogOut size={20} className="group-hover:rotate-12 transition-transform" />
                        <span>Cerrar Sesión</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-72">
                <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-10 sticky top-0 z-10">
                    <h1 className="text-xl font-bold text-gray-800">Panel de Control</h1>
                    <div className="flex items-center gap-4">
                        <button className="p-2 text-gray-400 hover:text-gray-900 transition-colors">
                            <Settings size={20} />
                        </button>
                        <div className="w-10 h-10 bg-primary/20 rounded-full border-2 border-primary/10"></div>
                    </div>
                </header>

                <div className="p-10">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
