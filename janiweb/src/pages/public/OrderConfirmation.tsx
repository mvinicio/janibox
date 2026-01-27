import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Truck } from 'lucide-react';

const OrderConfirmation = () => {
    const { orderId } = useParams();

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center font-inter">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-xl w-full"
            >
                <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8">
                    <CheckCircle2 size={48} className="text-green-500" />
                </div>

                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-4 block">Pedido Realizado</span>
                <h1 className="text-4xl md:text-5xl font-extralight tracking-tight text-gray-900 mb-6 uppercase">
                    ¡Gracias por <br /> tu confianza!
                </h1>

                <p className="text-gray-500 leading-relaxed mb-12 italic">
                    Estamos preparando tu sorpresa con todo el amor que Janibox ofrece. <br />
                    Te hemos enviado un correo con los detalles de tu pedido.
                </p>

                <div className="bg-[#FBFBFB] p-8 rounded-[48px] border border-gray-50 mb-12 space-y-4">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Número de Orden</span>
                        <span className="font-mono text-gray-900 font-bold">#{orderId?.slice(-8).toUpperCase()}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Estado</span>
                        <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-black uppercase">Recibido</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Link
                        to={`/tracking/${orderId}`}
                        className="bg-primary text-white py-5 rounded-full font-black uppercase tracking-[0.2em] text-[10px] shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                        Rastrear Pedido
                        <Truck size={16} />
                    </Link>
                    <Link
                        to="/"
                        className="bg-white text-gray-900 border border-gray-100 py-5 rounded-full font-black uppercase tracking-[0.2em] text-[10px] hover:bg-gray-50 transition-all"
                    >
                        Volver al Inicio
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default OrderConfirmation;
