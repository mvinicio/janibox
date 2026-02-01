import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { JaniboxLogo } from '../../components/shared/Logos';
import { motion } from 'framer-motion';

const LoginCustomer = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Handle Supabase tokens that arrive in the hash (HashRouter issues)
        const handleHashToken = async () => {
            const hash = window.location.hash;
            if (hash && (hash.includes('access_token=') || hash.includes('error='))) {
                const { data } = await supabase.auth.getSession();
                if (data.session) {
                    navigate('/profile', { replace: true });
                }
            }
        };

        handleHashToken();

        // Standard session observer
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session) {
                navigate('/profile', { replace: true });
            }
        });

        return () => subscription.unsubscribe();
    }, [navigate]);

    const handleGoogleLogin = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                // Redirect to root, let the app handle the state change
                redirectTo: window.location.origin
            }
        });
        if (error) console.error('Error logging in:', error.message);
    };

    return (
        <div className="min-h-screen bg-[#FBFBFB] flex flex-col items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white p-12 rounded-[3.5rem] shadow-xl border border-gray-100 text-center"
            >
                <div className="flex justify-center mb-8">
                    <JaniboxLogo className="w-16 h-16 text-primary" />
                </div>

                <h1 className="text-3xl font-light tracking-[0.2em] uppercase text-gray-900 mb-4">
                    Bienvenido a JaniBox
                </h1>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-12">
                    Ingresa para gestionar tus pedidos y perfil
                </p>

                <button
                    onClick={handleGoogleLogin}
                    className="w-full bg-white border-2 border-gray-100 py-4 rounded-2xl flex items-center justify-center gap-4 hover:border-primary/20 hover:bg-gray-50 transition-all group"
                >
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
                    <span className="text-sm font-black uppercase tracking-widest text-gray-700 group-hover:text-primary transition-colors">
                        Continuar con Google
                    </span>
                </button>

                <div className="mt-12 pt-8 border-t border-gray-50">
                    <button
                        onClick={() => navigate('/')}
                        className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 hover:text-primary transition-colors"
                    >
                        Volver a la Tienda
                    </button>
                </div>
            </motion.div>

            <p className="mt-8 text-[10px] text-gray-300 uppercase tracking-widest text-center px-12">
                Al ingresar, aceptas nuestros términos de servicio y políticas de privacidad.
            </p>
        </div>
    );
};

export default LoginCustomer;
