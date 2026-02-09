import React from 'react';
import { useCategories } from '../hooks/useCategories';

interface MobileNavProps {
  activeCategory: string;
  onCategoryClick: (categoryId: string) => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ activeCategory, onCategoryClick }) => {
  const { categories } = useCategories();

  return (
    <div className="sticky top-20 z-40 bg-kafe-white/95 backdrop-blur-sm border-b border-kafe-gray-100 md:hidden shadow-sm">
      <div className="flex overflow-x-auto scrollbar-hide px-4 py-4">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryClick(category.id)}
            className={`flex-shrink-0 flex items-center space-x-2 px-6 py-2 rounded-none mr-2 transition-all duration-200 border-b-2 font-bold tracking-widest uppercase text-[10px] ${activeCategory === category.id
              ? 'text-kafe-black border-kafe-black'
              : 'text-kafe-gray-400 border-transparent'
              }`}
          >
            <span className="grayscale">{category.icon}</span>
            <span className="whitespace-nowrap">{category.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MobileNav;