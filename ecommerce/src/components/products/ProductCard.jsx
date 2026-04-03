import { ShoppingCart, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/useCart';
import { getImageUrl, toCurrency } from '../../utils/api';

export default function ProductCard({ product }) {
    const { addToCart } = useCart();
    const imageUrl = getImageUrl(product.image_url || product.image);

    return (
        <div className="group bg-white rounded-[2rem] border border-slate-100 p-4 hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-500">
            <div className="relative aspect-square overflow-hidden rounded-[1.5rem] bg-slate-50 mb-4">
                {imageUrl ?
                    <img
                        src={imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" /> :

                    <div className="w-full h-full flex items-center justify-center text-slate-300 font-bold">
                        No image
                    </div>
                }

                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Link
                        to={`/product/${product.id}`}
                        className="p-3 bg-white rounded-full hover:bg-blue-600 hover:text-white transition-colors">

                        <Eye size={20} />
                    </Link>
                </div>
            </div>

            <div className="px-2">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">
                    {product.category?.name || product.category_name || product.category || 'Featured'}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1 truncate">{product.name}</h3>

                <div className="flex items-center justify-between mt-4">
                    <span className="text-2xl font-black text-slate-900">{toCurrency(product.price)}</span>
                    <button
                        onClick={() => addToCart(product)}
                        className="p-3 bg-slate-900 text-white rounded-2xl hover:bg-blue-600 transition-all active:scale-95 shadow-lg shadow-slate-200">

                        <ShoppingCart size={20} />
                    </button>
                </div>
            </div>
        </div>);

}
