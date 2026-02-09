import React from 'react';
import { useCategories } from '../hooks/useCategories';

interface SubNavProps {
  selectedCategory: string;
  onCategoryClick: (categoryId: string) => void;
}

const SubNav: React.FC<SubNavProps> = ({ selectedCategory, onCategoryClick }) => {
  const { categories, loading } = useCategories();

  return (
    <div className="sticky top-20 z-40 bg-kafe-white/95 backdrop-blur-md border-b border-kafe-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-2 overflow-x-auto py-4 scrollbar-hide">
          {loading ? (
            <div className="flex space-x-3">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-10 w-24 bg-kafe-gray-50 rounded animate-pulse" />
              ))}
            </div>
          ) : (
            <>
              <button
                onClick={() => onCategoryClick('all')}
                className={`px-6 py-2 rounded-none text-xs font-bold tracking-widest uppercase transition-all duration-200 border-b-2 ${selectedCategory === 'all'
                  ? 'text-kafe-black border-kafe-black'
                  : 'text-kafe-gray-400 border-transparent hover:text-kafe-black hover:marker:border-kafe-gray-200'
                  }`}
              >
                All
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => onCategoryClick(c.id)}
                  className={`px-6 py-2 rounded-none text-xs font-bold tracking-widest uppercase transition-all duration-200 border-b-2 flex items-center space-x-2 whitespace-nowrap ${selectedCategory === c.id
                    ? 'text-kafe-black border-kafe-black'
                    : 'text-kafe-gray-400 border-transparent hover:text-kafe-black hover:border-kafe-gray-200'
                    }`}
                >
                  <span className="text-sm grayscale opacity-70 group-hover:opacity-100">{c.icon}</span>
                  <span>{c.name}</span>
                </button>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubNav;


