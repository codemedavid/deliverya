import React, { useState } from 'react';
import { X, ShoppingCart, Heart, Minus, Plus } from 'lucide-react';

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

interface QuickViewModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product, quantity?: number) => void;
}

const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  onClose,
  onAddToCart
}) => {
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const formatPrice = (price: number) => {
    return `P${price.toFixed(2)}`;
  };

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercentage = hasDiscount 
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;

  const getStockStatus = (stock: number, isInStock: boolean) => {
    if (!isInStock || stock === 0) {
      return { text: 'Out of Stock', color: 'text-red-600', bg: 'bg-red-100' };
    } else if (stock <= 10) {
      return { text: `Low Stock: ${stock}`, color: 'text-yellow-600', bg: 'bg-yellow-100' };
    } else {
      return { text: `In-Stock: ${stock}`, color: 'text-accent-green', bg: 'bg-green-100' };
    }
  };

  const stockStatus = getStockStatus(product.stock, product.isInStock);

  const handleAddToCart = async () => {
    if (!product.isInStock || product.stock === 0) return;
    
    setIsAddingToCart(true);
    onAddToCart(product, quantity);
    
    // Simulate adding to cart
    setTimeout(() => {
      setIsAddingToCart(false);
      onClose();
    }, 500);
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-secondary-gray">
          <h2 className="text-xl font-bold text-text-black">Product Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Image */}
            <div className="space-y-4">
              <div className="relative h-80 bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=No+Image';
                  }}
                />
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col space-y-2">
                  {product.isPopular && (
                    <span className="bg-primary-orange text-white text-sm px-3 py-1 rounded-full font-medium">
                      Popular
                    </span>
                  )}
                  {hasDiscount && (
                    <span className="bg-red-500 text-white text-sm px-3 py-1 rounded-full font-medium">
                      -{discountPercentage}% OFF
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              {/* Brand */}
              {product.brand && (
                <p className="text-sm text-gray-500 uppercase tracking-wide">{product.brand}</p>
              )}
              
              {/* Product Name */}
              <h1 className="text-2xl font-bold text-text-black">{product.name}</h1>

              {/* Price */}
              <div className="flex items-center space-x-3">
                <span className="text-3xl font-bold text-text-black">
                  {formatPrice(product.price)}
                </span>
                {hasDiscount && (
                  <span className="text-lg text-gray-500 line-through">
                    {formatPrice(product.originalPrice!)}
                  </span>
                )}
                {hasDiscount && (
                  <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm font-medium">
                    Save {formatPrice(product.originalPrice! - product.price)}
                  </span>
                )}
              </div>

              {/* Stock Status */}
              <div>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${stockStatus.color} ${stockStatus.bg}`}>
                  {stockStatus.text}
                </span>
              </div>

              {/* Description */}
              <div>
                <h3 className="font-semibold text-text-black mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
              </div>

              {/* Quantity Selector */}
              {product.isInStock && product.stock > 0 && (
                <div>
                  <h3 className="font-semibold text-text-black mb-2">Quantity</h3>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1}
                      className="w-8 h-8 rounded-full border border-secondary-gray flex items-center justify-center hover:bg-secondary-gray disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-lg font-medium w-12 text-center">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(quantity + 1)}
                      disabled={quantity >= product.stock}
                      className="w-8 h-8 rounded-full border border-secondary-gray flex items-center justify-center hover:bg-secondary-gray disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Available: {product.stock} units
                  </p>
                </div>
              )}

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={!product.isInStock || product.stock === 0 || isAddingToCart}
                className={`
                  w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2
                  ${product.isInStock && product.stock > 0 && !isAddingToCart
                    ? 'bg-primary-orange text-white hover:bg-orange-600'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }
                `}
              >
                <ShoppingCart className="w-5 h-5" />
                <span>
                  {isAddingToCart 
                    ? 'Adding to Cart...' 
                    : product.isInStock && product.stock > 0 
                      ? `Add ${quantity} to Cart - ${formatPrice(product.price * quantity)}`
                      : 'Out of Stock'
                  }
                </span>
              </button>

              {/* Additional Info */}
              <div className="border-t border-secondary-gray pt-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Category:</span>
                    <p className="text-gray-600 capitalize">{product.category}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">SKU:</span>
                    <p className="text-gray-600">{product.id}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;
