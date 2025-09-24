import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useCart } from './hooks/useCart';
import Header from './components/Header';
// Removed sidebar to free horizontal space
import { useCategories } from './hooks/useCategories';
import ProductSearch from './components/ProductSearch';
import ProductGrid from './components/ProductGrid';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import FloatingCartButton from './components/FloatingCartButton';
import AdminDashboard from './components/AdminDashboard';
import { useMenu } from './hooks/useMenu';

function MainApp() {
  const cart = useCart();
  const { menuItems } = useMenu();
  const { categories } = useCategories();
  const [currentView, setCurrentView] = useState<'products' | 'cart' | 'checkout'>('products');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredProducts, setFilteredProducts] = useState(menuItems);

  const handleViewChange = (view: 'products' | 'cart' | 'checkout') => {
    setCurrentView(view);
  };

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    // Clear search when changing category
    setSearchQuery('');
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Clear category filter when searching
    if (query) {
      setSelectedCategory('all');
    }
  };

  // Filter products based on category and search
  useEffect(() => {
    let filtered = menuItems;

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
      );
    }

    setFilteredProducts(filtered);
  }, [menuItems, selectedCategory, searchQuery]);

  // Adapt menu items to ProductGrid's expected shape
  const adaptedProducts = filteredProducts.map((item) => {
    const hasManualDiscount = typeof item.discountPrice === 'number' && item.discountPrice! > 0 && item.discountPrice! < item.basePrice;
    const price = hasManualDiscount
      ? (item.discountPrice as number)
      : ((item.effectivePrice ?? item.basePrice) as number);
    const originalPrice = hasManualDiscount ? item.basePrice : (item.isOnDiscount ? item.basePrice : undefined);

    return {
      id: item.id,
      name: item.name,
      description: item.description,
      price,
      originalPrice,
      category: item.category,
      imageUrl: item.image || 'https://via.placeholder.com/300x200?text=No+Image',
      stock: item.available === false ? 0 : 999,
      isInStock: item.available !== false,
      isPopular: item.popular === true
    };
  });

  return (
    <div className="min-h-screen bg-background-light">
      <Header 
        cartItemsCount={cart.getTotalItems()}
        onCartClick={() => handleViewChange('cart')}
        onMenuClick={() => handleViewChange('products')}
      />
      
      {currentView === 'products' && (
        <div className="p-6">
          {/* Top Categories Bar */}
          <div className="mb-4 overflow-x-auto">
            <div className="flex items-center space-x-2 min-w-max">
              <button
                onClick={() => handleCategoryClick('all')}
                className={`px-3 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                  selectedCategory === 'all' ? 'bg-primary-orange text-white' : 'bg-secondary-gray text-text-black hover:bg-gray-300'
                }`}
              >
                All Products
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.id)}
                  className={`px-3 py-2 rounded-full text-sm whitespace-nowrap transition-colors flex items-center space-x-2 ${
                    selectedCategory === cat.id ? 'bg-primary-orange text-white' : 'bg-secondary-gray text-text-black hover:bg-gray-300'
                  }`}
                >
                  <span className="text-base">{cat.icon}</span>
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="">
            {/* Search Bar */}
            <div className="mb-6">
              <ProductSearch onSearch={handleSearch} />
            </div>
            
            {/* Results Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-text-black mb-2">
                {searchQuery 
                  ? `Search Results for "${searchQuery}"` 
                  : selectedCategory === 'all' 
                    ? 'All Products' 
                    : selectedCategory.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())
                }
              </h1>
              <p className="text-gray-600">
                {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
              </p>
            </div>
            
            {/* Product Grid */}
            <ProductGrid 
              products={adaptedProducts}
              onAddToCart={(product) => {
                const original = filteredProducts.find(p => p.id === product.id);
                if (original) {
                  cart.addToCart(original);
                }
              }}
            />
          </div>
        </div>
      )}
      
      {currentView === 'cart' && (
        <div className="max-w-4xl mx-auto p-6">
          <Cart 
            cartItems={cart.cartItems}
            updateQuantity={cart.updateQuantity}
            removeFromCart={cart.removeFromCart}
            clearCart={cart.clearCart}
            getTotalPrice={cart.getTotalPrice}
            onContinueShopping={() => handleViewChange('products')}
            onCheckout={() => handleViewChange('checkout')}
          />
        </div>
      )}
      
      {currentView === 'checkout' && (
        <div className="max-w-4xl mx-auto p-6">
          <Checkout 
            cartItems={cart.cartItems}
            totalPrice={cart.getTotalPrice()}
            onBack={() => handleViewChange('cart')}
          />
        </div>
      )}
      
      {currentView === 'products' && (
        <FloatingCartButton 
          itemCount={cart.getTotalItems()}
          onCartClick={() => handleViewChange('cart')}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainApp />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;