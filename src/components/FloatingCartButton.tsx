import React from 'react';
import { ShoppingCart } from 'lucide-react';

interface FloatingCartButtonProps {
  itemCount: number;
  onCartClick: () => void;
}

const FloatingCartButton: React.FC<FloatingCartButtonProps> = ({ itemCount, onCartClick }) => {
  if (itemCount === 0) return null;

  return (
    <button
      onClick={onCartClick}
      className="fixed bottom-8 right-8 bg-kafe-black text-kafe-white p-5 rounded-none shadow-[0_20px_40px_rgba(0,0,0,0.3)] hover:bg-kafe-gray-800 transition-all duration-300 transform hover:scale-110 active:scale-95 z-[60] md:hidden border border-kafe-gray-800"
    >
      <div className="relative">
        <ShoppingCart className="h-6 w-6" />
        <span className="absolute -top-3 -right-3 bg-kafe-white text-kafe-black text-[10px] font-black rounded-none h-6 w-6 flex items-center justify-center border border-kafe-black shadow-sm">
          {itemCount}
        </span>
      </div>
    </button>
  );
};

export default FloatingCartButton;