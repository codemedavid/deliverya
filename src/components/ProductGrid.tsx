import React, { useState } from 'react';
import { Eye, ShoppingCart, Heart } from 'lucide-react';
import QuickViewModal from './QuickViewModal';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  imageUrl: string;
  stock: number;
  isInStock: boolean;
  isPopular?: boolean;
  brand?: string;
  discount?: number;
}

interface ProductGridProps {
  products: Product[];
  onAddToCart: (product: Product, quantity?: number) => void;
  loading?: boolean;
}

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  onAddToCart,
  loading = false
}) => {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const handleQuickView = (product: Product) => {
    setQuickViewProduct(product);
  };

  const handleCloseQuickView = () => {
    setQuickViewProduct(null);
  };

  const formatPrice = (price: number) => {
    return `P${price.toFixed(2)}`;
  };

  const getStockStatus = (stock: number, isInStock: boolean) => {
    if (!isInStock || stock === 0) {
      return { text: 'Out of Stock', color: 'text-red-600', bg: 'bg-red-100' };
    } else if (stock <= 10) {
      return { text: `Low Stock: ${stock}`, color: 'text-yellow-600', bg: 'bg-yellow-100' };
    } else {
      return { text: `In-Stock: ${stock}`, color: 'text-accent-green', bg: 'bg-green-100' };
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-2">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="bg-white rounded-md border border-gray-100 shadow-sm overflow-hidden animate-pulse">
            <div className="h-28 bg-secondary-gray"></div>
            <div className="p-2 space-y-1.5">
              <div className="h-4 bg-secondary-gray rounded"></div>
              <div className="h-3.5 bg-secondary-gray rounded w-3/4"></div>
              <div className="h-4 bg-secondary-gray rounded w-1/2"></div>
              <div className="h-6 bg-secondary-gray rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No products found</h3>
        <p className="text-gray-500">Try adjusting your search or filter criteria</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-2">
        {products.map((product) => {
          const stockStatus = getStockStatus(product.stock, product.isInStock);
          const hasDiscount = product.originalPrice && product.originalPrice > product.price;
          const discountPercentage = hasDiscount 
            ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
            : 0;

          return (
            <div
              key={product.id}
              className="bg-white rounded-md border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden group"
            >
              {/* Product Image */}
              <div className="relative h-28 bg-gray-100 overflow-hidden">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=No+Image';
                  }}
                />
                
                {/* Badges */}
                <div className="absolute top-2 left-2 flex flex-col space-y-1">
                  {product.isPopular && (
                    <span className="bg-primary-orange/90 text-white text-[10px] px-1.5 py-0.5 rounded-full font-medium">
                      Popular
                    </span>
                  )}
                  {hasDiscount && (
                    <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-medium">
                      -{discountPercentage}%
                    </span>
                  )}
                </div>

                {/* Quick View Button */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 flex items-center justify-center">
                  <button
                    onClick={() => handleQuickView(product)}
                    className="opacity-0 group-hover:opacity-100 bg-white/90 text-primary-orange px-3 py-1.5 rounded-full font-medium transition-all duration-200 hover:bg-primary-orange hover:text-white flex items-center space-x-2 text-xs"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Quick View</span>
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-2 font-pretendard">
                {/* Brand */}
                {product.brand && (
                  <p className="text-xs text-gray-500 mb-1">{product.brand}</p>
                )}
                
                {/* Product Name */}
                <h3 className="font-medium text-gray-900 mb-1 line-clamp-2 group-hover:text-primary-orange transition-colors text-[13px]">
                  {product.name}
                </h3>

                {/* Price */}
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-[13px] font-semibold text-gray-900">
                    {formatPrice(product.price)}
                  </span>
                  {hasDiscount && (
                    <span className="text-[11px] text-gray-500 line-through">
                      {formatPrice(product.originalPrice!)}
                    </span>
                  )}
                </div>

                {/* Stock Status */}
                <div className="mb-2.5">
                  <span className={`inline-block px-1.5 py-0.5 rounded-full text-[10px] font-medium ${stockStatus.color} ${stockStatus.bg}`}>
                    {stockStatus.text}
                  </span>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={() => onAddToCart(product)}
                  disabled={!product.isInStock || product.stock === 0}
                  className={`
                    w-full h-8 px-3 rounded-md font-medium transition-all duration-200 flex items-center justify-center space-x-2 text-[11px]
                    ${product.isInStock && product.stock > 0
                      ? 'bg-gray-900 text-white hover:bg-black'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }
                  `}
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>
                    {product.isInStock && product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                  </span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={handleCloseQuickView}
          onAddToCart={onAddToCart}
        />
      )}
    </>
  );
};

export default ProductGrid;
