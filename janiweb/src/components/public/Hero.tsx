import { motion } from 'framer-motion';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { JaniboxLogo } from '../shared/Logos';

const Hero = () => {
    return (
        <section className="relative h-screen min-h-[700px] flex items-center justify-center pt-24">
            {/* Video Background */}
            <div className="absolute inset-0 z-0">
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover filter brightness-[0.85]"
                >
                    <source src="/assets/banner.mp4" type="video/mp4" />
                </video>
                {/* Subtle Overlay */}
                <div className="absolute inset-0 bg-black/10"></div>
            </div>

            {/* Watermark Mask */}
            <div className="absolute bottom-1 right-1 z-20 flex items-center gap-3 bg-black/40 backdrop-blur-sm px-6 py-3 rounded-2xl border border-white/10 group hover:bg-black/60 transition-all cursor-default scale-90 origin-bottom-right">
                <JaniboxLogo className="w-6 h-6 text-primary" />
                <div className="flex flex-col">
                    <span className="text-white text-[10px] font-black tracking-widest uppercase leading-none mb-1">JaniBox</span>
                    <span className="text-white/40 text-[8px] tracking-widest uppercase leading-none">Original Content</span>
                </div>
            </div>

            {/* Content at Bottom */}
            <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-10 w-full px-4 max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <button className="bg-transparent text-white border border-white px-12 py-4 tracking-[0.25em] uppercase text-sm font-medium hover:bg-white hover:text-black transition-all duration-500 backdrop-blur-sm">
                            Explorar Colección
                        </button>
                        <Link
                            to="/custom"
                            className="bg-primary text-white border border-primary px-12 py-4 tracking-[0.25em] uppercase text-sm font-medium hover:bg-opacity-90 transition-all duration-500 flex items-center gap-3 group"
                        >
                            Diseña tu Box
                            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </motion.div>
            </div>

            {/* Scroll Down Indicator */}
            <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10 text-white flex flex-col items-center gap-2 cursor-pointer opacity-70 hover:opacity-100 transition-opacity"
                onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
            >
                <div className="w-10 h-10 border border-white rounded-full flex items-center justify-center">
                    <ChevronDown size={20} />
                </div>
            </motion.div>
        </section>
    );
};

export default Hero;
