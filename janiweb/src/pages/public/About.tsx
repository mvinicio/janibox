import { motion } from 'framer-motion';
import { MapPin, Heart, Truck, CheckCircle2 } from 'lucide-react';
import Navbar from '../../components/public/Navbar';
import { JaniboxLogo } from '../../components/shared/Logos';

const About = () => {
    return (
        <div className="bg-white min-h-screen font-inter">
            <Navbar />

            {/* Hero Section */}
            <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gray-900">
                    <img
                        src="https://images.unsplash.com/photo-1542665952-14513db15293?q=80&w=2070&auto=format&fit=crop"
                        alt="Guayaquil"
                        className="w-full h-full object-cover opacity-40 mix-blend-overlay"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="relative z-10 text-center"
                >
                    <JaniboxLogo className="w-20 h-20 text-white mx-auto mb-8 drop-shadow-2xl" />
                    <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase drop-shadow-lg">
                        Nosotros
                    </h1>
                    <div className="w-24 h-1 bg-primary mx-auto mt-8 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.5)]"></div>
                </motion.div>
            </section>

            {/* Mission & Story */}
            <section className="py-24 max-w-4xl mx-auto px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-sm font-bold tracking-[0.3em] text-primary uppercase mb-6">Nuestra Historia</h2>
                    <p className="text-2xl md:text-4xl font-light text-gray-900 leading-tight mb-12">
                        Nacimos en el corazón de <span className="font-bold text-gray-900 decoration-primary/30 underline decoration-4 underline-offset-4">Guayaquil</span> con una misión simple: simplificar tu vida.
                    </p>
                    <p className="text-gray-500 leading-relaxed text-lg max-w-2xl mx-auto">
                        JaniBox no es solo una tienda, es tu aliado en el día a día. Entendemos el ritmo de la ciudad y sabemos que valoras tu tiempo. Por eso, seleccionamos los mejores productos y te los llevamos a la puerta de tu casa u oficina, con la calidez y rapidez que caracteriza a los guayacos.
                    </p>
                </motion.div>
            </section>

            {/* Values Grid */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                        {[
                            {
                                icon: Heart,
                                title: "Pasión Local",
                                text: "Orgullosamente guayaquileños. Conocemos nuestra ciudad y a nuestra gente."
                            },
                            {
                                icon: Truck,
                                title: "Rapidez Total",
                                text: "Entregas eficientes porque sabemos que no te gusta esperar."
                            },
                            {
                                icon: CheckCircle2,
                                title: "Calidad Garantizada",
                                text: "Solo ofrecemos productos que nosotros mismos usaríamos."
                            }
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.2 }}
                                className="flex flex-col items-center group"
                            >
                                <div className="w-20 h-20 rounded-[2rem] bg-white border border-gray-100 flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 group-hover:shadow-xl group-hover:border-primary/20 transition-all duration-300">
                                    <item.icon size={32} className="text-gray-400 group-hover:text-primary transition-colors" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                                <p className="text-gray-500 leading-relaxed max-w-xs">{item.text}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Location Section */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl font-extralight text-gray-900 mb-8 uppercase tracking-widest">
                            Desde el <br />
                            <span className="font-black text-primary">Puerto Principal</span>
                        </h2>
                        <div className="space-y-6 text-gray-600 text-lg">
                            <p className="flex items-start gap-4">
                                <MapPin className="text-primary mt-1 flex-shrink-0" />
                                <span>
                                    Operamos desde el norte de Guayaquil, cubriendo estratégicamente toda la ciudad y Samborondón.
                                </span>
                            </p>
                            <p>
                                Nuestra logística está optimizada para enfrentar el tráfico la ciudad y llegar a tiempo donde estés.
                            </p>
                            <div className="pt-8">
                                <button className="bg-gray-900 text-white px-10 py-4 rounded-full font-bold tracking-widest uppercase hover:bg-primary transition-colors shadow-xl shadow-gray-900/10 hover:shadow-primary/20">
                                    Contáctanos
                                </button>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="relative h-[500px] rounded-[3rem] overflow-hidden shadow-2xl"
                    >
                        {/* Abstract Map Representation */}
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127641.22238496464!2d-79.96053331908204!3d-2.1524316982260685!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x902d13cbe855805f%3A0x8015a492f4fca473!2sGuayaquil!5e0!3m2!1ses!2sec!4v1706640000000!5m2!1ses!2sec"
                            width="100%"
                            height="100%"
                            style={{ border: 0, filter: 'grayscale(100%) invert(92%) contrast(83%)' }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-primary rounded-full animate-ping opacity-75"></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-full shadow-lg shadow-primary/50"></div>
                    </motion.div>
                </div>
            </section>

            {/* Footer Micro */}
            <div className="text-center py-12 border-t border-gray-100">
                <p className="text-xs text-gray-300 tracking-[0.5em] uppercase">JaniBox Guayaquil</p>
            </div>
        </div>
    );
};

export default About;
