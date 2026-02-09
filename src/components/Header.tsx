import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useSiteSettings } from '../hooks/useSiteSettings';

interface HeaderProps {
  cartItemsCount: number;
  onCartClick: () => void;
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ cartItemsCount, onCartClick, onMenuClick }) => {
  const { siteSettings, loading } = useSiteSettings();

  return (
    <header className="sticky top-0 z-50 bg-kafe-white/90 backdrop-blur-md border-b border-kafe-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <button
            onClick={onMenuClick}
            className="flex items-center space-x-3 text-kafe-black hover:opacity-80 transition-opacity duration-200"
          >
            {loading ? (
              <div className="w-12 h-12 bg-kafe-gray-100 rounded-full animate-pulse" />
            ) : (
              <img
                src={siteSettings?.site_logo || "/logo.jpg"}
                alt={siteSettings?.site_name || "Kafe Sikad"}
                className="w-12 h-12 object-contain"
                onError={(e) => {
                  e.currentTarget.src = "/logo.jpg";
                }}
              />
            )}
            <div className="flex flex-col items-start">
              <h1 className="text-xl font-playfair font-bold tracking-tight leading-none">
                {loading ? (
                  <div className="w-24 h-6 bg-kafe-gray-100 rounded animate-pulse" />
                ) : (
                  "KAFE SIKAD"
                )}
              </h1>
              <span className="text-[10px] font-inter tracking-[0.2em] text-kafe-gray-500 mt-1 uppercase">Brew & Ride</span>
            </div>
          </button>

          <div className="flex items-center space-x-4">
            <button
              onClick={onCartClick}
              className="relative p-2 text-kafe-black hover:bg-kafe-gray-100 rounded-full transition-all duration-200"
            >
              <ShoppingCart className="h-6 w-6" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-kafe-black text-kafe-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-kafe-white">
                  {cartItemsCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;