import { motion } from 'framer-motion';

interface ProductCardProps {
    product: any;
    onClick?: (product: any) => void;
}

const ProductCard = ({ product, onClick }: ProductCardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="group cursor-pointer"
            onClick={() => onClick?.(product)}
        >
            <div className="relative aspect-square overflow-hidden bg-[#F9F9F9] mb-6">
                <img
                    src={product.image_url || 'https://via.placeholder.com/600'}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                />
                {/* Centered Button on Hover */}
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button className="bg-white/95 text-gray-900 px-6 py-3 text-[10px] font-bold tracking-[0.2em] uppercase shadow-xl">
                        Añadir al Carrito
                    </button>
                </div>
            </div>

            <div className="text-center space-y-2">
                <h3 className="text-sm font-medium tracking-[0.1em] uppercase text-gray-800">
                    {product.name}
                </h3>
                <p className="text-gray-500 font-serif italic text-lg">
                    ${product.price.toFixed(2)}
                </p>
            </div>
        </motion.div>
    );
};

export default ProductCard;
