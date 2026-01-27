import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import {
    Package,
    Grid,
    LogOut,
    LayoutDashboard,
    Box,
    ChevronRight,
    Settings
} from 'lucide-react';
import { JaniboxLogo } from '../../components/shared/Logos';

const Dashboard = () => {
    const navigate = useNavigate();

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        navigate('/admin/login');
    };

    const menuItems = [
        { icon: LayoutDashboard, label: 'Resumen', path: '/admin', end: true },
        { icon: Package, label: 'Productos', path: '/admin/products' },
        { icon: Grid, label: 'Categorías', path: '/admin/categories' },
        { icon: Box, label: 'Bases y Dulces', path: '/admin/customization' },
    ];

    return (
        <div className="flex min-h-screen bg-gray-50">
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

                <nav className="flex-1 px-4 space-y-2 mt-4">
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.end}
                            className={({ isActive }) => `
                flex items-center justify-between p-4 rounded-2xl font-bold transition-all group
                ${isActive
                                    ? 'bg-primary/10 text-primary'
                                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                }
              `}
                        >
                            {({ isActive }) => (
                                <>
                                    <div className="flex items-center gap-4">
                                        <item.icon size={20} />
                                        <span>{item.label}</span>
                                    </div>
                                    <ChevronRight size={16} className={`transition-transform duration-300 group-hover:translate-x-1 ${isActive ? 'opacity-100' : 'opacity-0'}`} />
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-50">
                    <button
                        onClick={handleSignOut}
                        className="flex items-center gap-4 w-full p-4 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all font-bold"
                    >
                        <LogOut size={20} />
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
