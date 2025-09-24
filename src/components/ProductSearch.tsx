import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

interface ProductSearchProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

const ProductSearch: React.FC<ProductSearchProps> = ({
  onSearch,
  placeholder = "Search products..."
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = () => {
    if (searchQuery.length >= 2) {
      setIsSearching(true);
      onSearch(searchQuery);
      // Reset searching state after a brief delay
      setTimeout(() => setIsSearching(false), 500);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    onSearch('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const canSearch = searchQuery.length >= 2;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="relative">
        <div className="flex items-center bg-white rounded-lg shadow-md border border-secondary-gray overflow-hidden">
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={placeholder}
              className="w-full px-4 py-3 text-text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-orange"
              disabled={isSearching}
            />
            
            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                disabled={isSearching}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          
          <button
            onClick={handleSearch}
            disabled={!canSearch || isSearching}
            className={`
              px-6 py-3 font-semibold text-white transition-all duration-200 flex items-center space-x-2
              ${canSearch && !isSearching
                ? 'bg-primary-orange hover:bg-orange-600 cursor-pointer'
                : 'bg-gray-400 cursor-not-allowed'
              }
            `}
          >
            <Search className={`w-4 h-4 ${isSearching ? 'animate-pulse' : ''}`} />
            <span>{isSearching ? 'Searching...' : 'Search'}</span>
          </button>
        </div>
        
        {/* Search hint */}
        {searchQuery.length > 0 && searchQuery.length < 2 && (
          <p className="text-sm text-gray-500 mt-2 px-1">
            Enter at least 2 characters to search
          </p>
        )}
        
        {/* Search suggestions could go here */}
        {searchQuery.length >= 2 && (
          <div className="absolute top-full left-0 right-0 bg-white border border-secondary-gray rounded-lg shadow-lg mt-1 z-10 max-h-60 overflow-y-auto">
            <div className="p-2">
              <p className="text-sm text-gray-600 px-3 py-2">
                Press Enter or click Search to find products matching "{searchQuery}"
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductSearch;
