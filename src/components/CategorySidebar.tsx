import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  icon: string;
  subcategories?: Category[];
}

interface CategorySidebarProps {
  selectedCategory: string;
  onCategoryClick: (categoryId: string) => void;
}

const categories: Category[] = [
  {
    id: 'personal-care',
    name: 'Personal Care',
    icon: '🧴',
    subcategories: [
      { id: 'shaving', name: 'Shaving Products', icon: '🪒' },
      { id: 'skincare', name: 'Skincare', icon: '🧼' },
      { id: 'oral-care', name: 'Oral Care', icon: '🦷' },
      { id: 'hair-care', name: 'Hair Care', icon: '💇‍♀️' }
    ]
  },
  {
    id: 'laundry-items',
    name: 'Laundry Items',
    icon: '🧺',
    subcategories: [
      { id: 'detergents', name: 'Detergents', icon: '🧽' },
      { id: 'fabric-softeners', name: 'Fabric Softeners', icon: '👕' },
      { id: 'stain-removers', name: 'Stain Removers', icon: '🧽' }
    ]
  },
  {
    id: 'adult-care',
    name: 'Adult Care',
    icon: '👴',
    subcategories: [
      { id: 'vitamins', name: 'Vitamins & Supplements', icon: '💊' },
      { id: 'medical-supplies', name: 'Medical Supplies', icon: '🏥' },
      { id: 'wellness', name: 'Wellness Products', icon: '🌿' }
    ]
  },
  {
    id: 'tea-coffee',
    name: 'Tea & Coffee',
    icon: '☕',
    subcategories: [
      { id: 'coffee-beans', name: 'Coffee Beans', icon: '☕' },
      { id: 'tea-bags', name: 'Tea Bags', icon: '🍵' },
      { id: 'instant-coffee', name: 'Instant Coffee', icon: '☕' },
      { id: 'coffee-accessories', name: 'Coffee Accessories', icon: '🥄' }
    ]
  },
  {
    id: 'beverages',
    name: 'Beverages',
    icon: '🥤',
    subcategories: [
      { id: 'soft-drinks', name: 'Soft Drinks', icon: '🥤' },
      { id: 'juices', name: 'Juices', icon: '🧃' },
      { id: 'energy-drinks', name: 'Energy Drinks', icon: '⚡' },
      { id: 'water', name: 'Water', icon: '💧' }
    ]
  },
  {
    id: 'snacks',
    name: 'Snacks',
    icon: '🍿',
    subcategories: [
      { id: 'chips', name: 'Chips & Crackers', icon: '🍿' },
      { id: 'candy', name: 'Candy & Chocolate', icon: '🍫' },
      { id: 'nuts', name: 'Nuts & Seeds', icon: '🥜' }
    ]
  }
];

const CategorySidebar: React.FC<CategorySidebarProps> = ({
  selectedCategory,
  onCategoryClick
}) => {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleCategorySelect = (categoryId: string) => {
    onCategoryClick(categoryId);
  };

  const renderCategory = (category: Category, level: number = 0) => {
    const isExpanded = expandedCategories.includes(category.id);
    const isSelected = selectedCategory === category.id;
    const hasSubcategories = category.subcategories && category.subcategories.length > 0;

    return (
      <div key={category.id} className="mb-1">
        <div
          className={`
            flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200
            ${isSelected 
              ? 'bg-primary-orange text-white' 
              : 'hover:bg-secondary-gray text-text-black'
            }
            ${level > 0 ? 'ml-4 text-sm' : ''}
          `}
          onClick={() => {
            if (hasSubcategories) {
              toggleCategory(category.id);
            } else {
              handleCategorySelect(category.id);
            }
          }}
        >
          <div className="flex items-center space-x-3">
            <span className="text-lg">{category.icon}</span>
            <span className="font-medium">{category.name}</span>
          </div>
          {hasSubcategories && (
            <div className="text-gray-500">
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </div>
          )}
        </div>

        {hasSubcategories && isExpanded && (
          <div className="mt-1 space-y-1">
            {category.subcategories!.map(subcategory =>
              renderCategory(subcategory, level + 1)
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-64 bg-white border-r border-secondary-gray h-full overflow-y-auto">
      <div className="p-4">
        <h2 className="text-lg font-bold text-text-black mb-4">Categories</h2>
        
        {/* All Products Option */}
        <div
          className={`
            flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 mb-2
            ${selectedCategory === 'all' 
              ? 'bg-primary-orange text-white' 
              : 'hover:bg-secondary-gray text-text-black'
            }
          `}
          onClick={() => handleCategorySelect('all')}
        >
          <span className="text-lg mr-3">🛍️</span>
          <span className="font-medium">All Products</span>
        </div>

        {/* Category List */}
        <div className="space-y-1">
          {categories.map(category => renderCategory(category))}
        </div>
      </div>
    </div>
  );
};

export default CategorySidebar;
