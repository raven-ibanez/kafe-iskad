import React from 'react';
import { Trash2, Plus, Minus, ArrowLeft } from 'lucide-react';
import { CartItem } from '../types';

interface CartProps {
  cartItems: CartItem[];
  updateQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  onContinueShopping: () => void;
  onCheckout: () => void;
}

const Cart: React.FC<CartProps> = ({
  cartItems,
  updateQuantity,
  removeFromCart,
  clearCart,
  getTotalPrice,
  onContinueShopping,
  onCheckout
}) => {
  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-32">
        <div className="text-center">
          <div className="text-6xl mb-8 grayscale opacity-20">☕</div>
          <h2 className="text-3xl font-playfair font-black text-kafe-black mb-4 uppercase tracking-tight">YOUR CART IS EMPTY</h2>
          <p className="text-kafe-gray-400 mb-10 font-inter uppercase tracking-widest text-xs">Fuel up by adding items from our menu.</p>
          <button
            onClick={onContinueShopping}
            className="bg-kafe-black text-kafe-white px-10 py-4 font-black text-xs tracking-[0.3em] uppercase hover:bg-kafe-gray-800 transition-all duration-300"
          >
            DISCOVER MENU
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <button
            onClick={onContinueShopping}
            className="flex items-center space-x-2 text-kafe-gray-400 hover:text-kafe-black transition-all duration-300 group mb-4"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black tracking-[0.2em] uppercase">CONTINUE SHOPPING</span>
          </button>
          <h1 className="text-5xl font-playfair font-black text-kafe-black uppercase tracking-tighter">YOUR SELECTION</h1>
        </div>
        <button
          onClick={clearCart}
          className="text-kafe-gray-400 hover:text-kafe-black transition-colors duration-300 text-[10px] font-black tracking-[0.2em] uppercase border-b border-transparent hover:border-kafe-black pb-1"
        >
          CLEAR ALL ITEMS
        </button>
      </div>

      <div className="bg-kafe-white border border-kafe-gray-100 shadow-sm mb-12">
        {cartItems.map((item, index) => (
          <div key={item.id} className={`p-8 ${index !== cartItems.length - 1 ? 'border-b border-kafe-gray-50' : ''}`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-2">
                  <h3 className="text-lg font-playfair font-bold text-kafe-black uppercase tracking-tight">{item.name}</h3>
                </div>
                {item.selectedVariation && (
                  <p className="text-[10px] font-black tracking-widest text-kafe-gray-400 uppercase mb-1">SIZE: {item.selectedVariation.name}</p>
                )}
                {item.selectedAddOns && item.selectedAddOns.length > 0 && (
                  <p className="text-[10px] font-black tracking-widest text-kafe-gray-400 uppercase mb-3">
                    EXTRAS: {item.selectedAddOns.map(addOn =>
                      addOn.quantity && addOn.quantity > 1
                        ? `${addOn.name} x${addOn.quantity}`
                        : addOn.name
                    ).join(', ')}
                  </p>
                )}
                <p className="text-sm font-black text-kafe-black">₱{item.totalPrice.toFixed(2)} UNIT</p>
              </div>

              <div className="flex items-center justify-between md:justify-end space-x-8">
                <div className="flex items-center bg-kafe-gray-50 border border-kafe-gray-100 p-1">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-2 hover:bg-kafe-white hover:text-kafe-black transition-all duration-200"
                  >
                    <Minus className="h-3 w-3 text-kafe-gray-500" />
                  </button>
                  <span className="font-bold text-kafe-black min-w-[32px] text-center text-xs">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-2 hover:bg-kafe-white hover:text-kafe-black transition-all duration-200"
                  >
                    <Plus className="h-3 w-3 text-kafe-gray-500" />
                  </button>
                </div>

                <div className="text-right min-w-[100px]">
                  <p className="text-xl font-black text-kafe-black">₱{(item.totalPrice * item.quantity).toFixed(2)}</p>
                </div>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="p-2 text-kafe-gray-300 hover:text-kafe-black transition-all duration-300"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-kafe-black p-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <p className="text-[10px] font-black tracking-[0.3em] text-kafe-gray-500 uppercase mb-2">GRAND TOTAL</p>
          <div className="text-4xl font-playfair font-black text-kafe-white">
            ₱{(getTotalPrice() || 0).toFixed(2)}
          </div>
        </div>

        <button
          onClick={onCheckout}
          className="bg-kafe-white text-kafe-black px-12 py-5 font-black text-xs tracking-[0.3em] uppercase hover:bg-kafe-gray-100 transition-all duration-300 transform active:scale-95 shadow-xl"
        >
          PROCEED TO CHECKOUT
        </button>
      </div>
    </div>
  );
};

export default Cart;