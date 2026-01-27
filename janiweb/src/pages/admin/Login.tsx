import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { motion } from 'framer-motion';
import { Lock, Mail } from 'lucide-react';
import { JaniboxLogo } from '../../components/shared/Logos';
import toast from 'react-hot-toast';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            toast.error(error.message);
        } else {
            toast.success('¡Bienvenido!');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full"
            >
                <div className="text-center mb-10 flex flex-col items-center">
                    <div className="mb-4">
                        <JaniboxLogo className="w-16 h-16 text-primary" />
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">JANI<span className="text-primary">ADMIN</span></h2>
                    <p className="text-gray-500 mt-2 font-medium">Panel de Gestión Exclusivo</p>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl border border-gray-100">
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 ml-1">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all outline-none border focus:border-primary/20"
                                    placeholder="admin@janibox.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 ml-1">Contraseña</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all outline-none border focus:border-primary/20"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            disabled={loading}
                            className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-primary/30 hover:bg-primary-dark transition-all flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                'Entrar al Panel'
                            )}
                        </button>
                    </form>
                </div>
                <p className="text-center mt-8 text-gray-400 text-sm">
                    JANIBOX Boutique Administrativa
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
