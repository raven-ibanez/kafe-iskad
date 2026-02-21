import React, { useState } from 'react';
import { Plus, Minus, X, ShoppingCart } from 'lucide-react';
import { MenuItem, Variation, AddOn } from '../types';

interface MenuItemCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem, quantity?: number, variation?: Variation, addOns?: AddOn[]) => void;
  quantity: number;
  onUpdateQuantity: (id: string, quantity: number) => void;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({
  item,
  onAddToCart,
  quantity,
  onUpdateQuantity
}) => {
  const [showCustomization, setShowCustomization] = useState(false);
  const [selectedVariation, setSelectedVariation] = useState<Variation | undefined>(
    item.variations?.[0]
  );
  const [selectedAddOns, setSelectedAddOns] = useState<(AddOn & { quantity: number })[]>([]);

  const calculatePrice = () => {
    // Use effective price (discounted or regular) as base
    let price = item.effectivePrice || item.basePrice;
    if (selectedVariation) {
      price = (item.effectivePrice || item.basePrice) + selectedVariation.price;
    }
    selectedAddOns.forEach(addOn => {
      price += addOn.price * addOn.quantity;
    });
    return price;
  };

  const handleAddToCart = () => {
    if (item.variations?.length || item.addOns?.length) {
      setShowCustomization(true);
    } else {
      onAddToCart(item, 1);
    }
  };

  const handleCustomizedAddToCart = () => {
    // Convert selectedAddOns back to regular AddOn array for cart
    const addOnsForCart: AddOn[] = selectedAddOns.flatMap(addOn =>
      Array(addOn.quantity).fill({ ...addOn, quantity: undefined })
    );
    onAddToCart(item, 1, selectedVariation, addOnsForCart);
    setShowCustomization(false);
    setSelectedAddOns([]);
  };

  const handleIncrement = () => {
    onUpdateQuantity(item.id, quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 0) {
      onUpdateQuantity(item.id, quantity - 1);
    }
  };

  const updateAddOnQuantity = (addOn: AddOn, quantity: number) => {
    setSelectedAddOns(prev => {
      const existingIndex = prev.findIndex(a => a.id === addOn.id);

      if (quantity === 0) {
        // Remove add-on if quantity is 0
        return prev.filter(a => a.id !== addOn.id);
      }

      if (existingIndex >= 0) {
        // Update existing add-on quantity
        const updated = [...prev];
        updated[existingIndex] = { ...updated[existingIndex], quantity };
        return updated;
      } else {
        // Add new add-on with quantity
        return [...prev, { ...addOn, quantity }];
      }
    });
  };

  const groupedAddOns = item.addOns?.reduce((groups, addOn) => {
    const category = addOn.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(addOn);
    return groups;
  }, {} as Record<string, AddOn[]>);

  return (
    <>
      <div className={`bg-kafe-white rounded-none transition-all duration-500 overflow-hidden group border border-kafe-gray-100 hover:border-kafe-black ${!item.available ? 'opacity-50' : ''}`}>

        {/* Top accent bar */}
        <div className="h-[2px] bg-kafe-black w-0 group-hover:w-full transition-all duration-500 ease-out" />

        {/* Card Body */}
        <div className="p-4 flex flex-col">

          {/* Badges row — only render if there's something to show */}
          {(item.popular || (item.isOnDiscount && item.discountPrice) || !item.available) && (
            <div className="flex items-center gap-1.5 mb-3">
              {item.popular && (
                <span className="text-[8px] font-black tracking-[0.2em] text-kafe-gray-400 uppercase border border-kafe-gray-200 px-2 py-0.5">
                  FEATURED
                </span>
              )}
              {item.isOnDiscount && item.discountPrice && (
                <span className="text-[8px] font-black tracking-[0.2em] text-kafe-white bg-kafe-black px-2 py-0.5 uppercase">
                  -{Math.round(((item.basePrice - item.discountPrice) / item.basePrice) * 100)}% OFF
                </span>
              )}
              {!item.available && (
                <span className="text-[8px] font-black tracking-[0.2em] text-kafe-white bg-kafe-gray-400 px-2 py-0.5 uppercase">
                  SOLD OUT
                </span>
              )}
            </div>
          )}

          {/* Name */}
          <h4 className="text-sm font-playfair font-bold text-kafe-black uppercase tracking-tight leading-snug mb-1">
            {item.name}
          </h4>

          {/* Description */}
          <p className={`text-[10px] font-inter tracking-wide leading-relaxed mb-4 ${!item.available ? 'text-kafe-gray-300' : 'text-kafe-gray-400'}`}>
            {item.description || '—'}
          </p>

          {/* Price + Action */}
          <div className="flex items-center justify-between border-t border-kafe-gray-100 pt-3 mt-auto">
            <div>
              {item.isOnDiscount && item.discountPrice ? (
                <div className="flex items-baseline gap-1.5">
                  <span className="text-base font-playfair font-black text-kafe-black">
                    ₱{item.discountPrice.toFixed(2)}
                  </span>
                  <span className="text-[10px] text-kafe-gray-300 line-through font-inter">
                    ₱{item.basePrice.toFixed(2)}
                  </span>
                </div>
              ) : (
                <span className="text-base font-playfair font-black text-kafe-black">
                  ₱{item.basePrice.toFixed(2)}
                </span>
              )}
            </div>

            {item.available && (
              quantity === 0 ? (
                <button
                  onClick={handleAddToCart}
                  className="bg-kafe-black text-kafe-white px-3 py-1.5 hover:bg-kafe-gray-800 active:scale-95 transition-all duration-300 font-black text-[8px] tracking-[0.25em] uppercase"
                >
                  {item.variations?.length || item.addOns?.length ? 'OPTIONS' : 'ADD'}
                </button>
              ) : (
                <div className="flex items-center border border-kafe-gray-200">
                  <button
                    onClick={handleDecrement}
                    className="p-1.5 hover:bg-kafe-gray-50 transition-all duration-200"
                  >
                    <Minus className="h-3 w-3 text-kafe-gray-500" />
                  </button>
                  <span className="font-bold text-kafe-black min-w-[32px] text-center text-xs">{quantity}</span>
                  <button
                    onClick={handleIncrement}
                    className="p-2.5 hover:bg-kafe-white transition-all duration-200"
                  >
                    <Plus className="h-3 w-3 text-kafe-gray-500" />
                  </button>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* Customization Modal */}
      {showCustomization && (
        <div className="fixed inset-0 bg-kafe-black/90 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-fade-in">
          <div className="bg-kafe-white rounded-none max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl relative border border-kafe-gray-200">
            <div className="sticky top-0 bg-kafe-white border-b border-kafe-gray-100 p-8 flex items-center justify-between z-10">
              <div>
                <h3 className="text-2xl font-playfair font-black text-kafe-black uppercase tracking-tight">CUSTOMIZE</h3>
                <p className="text-[10px] font-inter font-bold tracking-[0.2em] text-kafe-gray-400 mt-2 uppercase">{item.name}</p>
              </div>
              <button
                onClick={() => setShowCustomization(false)}
                className="p-2 hover:bg-kafe-gray-50 rounded-full transition-all duration-200 group"
              >
                <X className="h-6 w-6 text-kafe-gray-400 group-hover:text-kafe-black group-hover:rotate-90 transition-all duration-300" />
              </button>
            </div>

            <div className="p-8">
              {/* Size Variations */}
              {item.variations && item.variations.length > 0 && (
                <div className="mb-10">
                  <h4 className="text-xs font-black tracking-[0.3em] text-kafe-black mb-6 uppercase border-l-4 border-kafe-black pl-3">
                    {['chicken-poppers', 'waffles-fries-sides'].includes(item.category) ? 'SELECT FLAVOR' : 'SELECT SIZE'}
                  </h4>
                  <div className="grid grid-cols-1 gap-4">
                    {item.variations.map((variation) => (
                      <label
                        key={variation.id}
                        className={`group flex items-center justify-between p-6 border transition-all duration-300 cursor-pointer ${selectedVariation?.id === variation.id
                          ? 'border-kafe-black bg-kafe-gray-50 ring-1 ring-kafe-black'
                          : 'border-kafe-gray-100 hover:border-kafe-gray-300 bg-kafe-white'
                          }`}
                      >
                        <div className="flex items-center space-x-4">
                          <input
                            type="radio"
                            name="variation"
                            checked={selectedVariation?.id === variation.id}
                            onChange={() => setSelectedVariation(variation)}
                            className="w-4 h-4 text-kafe-black focus:ring-kafe-black border-kafe-gray-300"
                          />
                          <span className={`text-sm font-bold tracking-widest uppercase transition-colors duration-200 ${selectedVariation?.id === variation.id ? 'text-kafe-black' : 'text-kafe-gray-500'
                            }`}>
                            {variation.name}
                          </span>
                        </div>
                        <span className="text-sm font-black text-kafe-black">
                          ₱{((item.effectivePrice || item.basePrice) + variation.price).toFixed(2)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Add-ons */}
              {groupedAddOns && Object.keys(groupedAddOns).length > 0 && (
                <div className="mb-10">
                  <h4 className="text-xs font-black tracking-[0.3em] text-kafe-black mb-6 uppercase border-l-4 border-kafe-black pl-3">EXTRAS</h4>
                  {Object.entries(groupedAddOns).map(([category, addOns]) => (
                    <div key={category} className="mb-8 last:mb-0">
                      <h5 className="text-[10px] font-black tracking-[0.2em] text-kafe-gray-400 mb-4 uppercase">
                        {category.replace(/-/g, ' ')}
                      </h5>
                      <div className="space-y-4">
                        {addOns.map((addOn) => (
                          <div
                            key={addOn.id}
                            className="flex items-center justify-between p-5 border border-kafe-gray-100 bg-kafe-white transition-all duration-300 hover:border-kafe-gray-200"
                          >
                            <div className="flex-1">
                              <span className="text-sm font-bold tracking-tight text-kafe-black uppercase">{addOn.name}</span>
                              <div className="text-[10px] font-bold tracking-widest text-kafe-gray-400 mt-1 uppercase">
                                {addOn.price > 0 ? `+ ₱${addOn.price.toFixed(2)}` : 'FREE'}
                              </div>
                            </div>

                            <div className="flex items-center space-x-3">
                              {selectedAddOns.find(a => a.id === addOn.id) ? (
                                <div className="flex items-center bg-kafe-gray-50 border border-kafe-gray-100 p-1">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const current = selectedAddOns.find(a => a.id === addOn.id);
                                      updateAddOnQuantity(addOn, (current?.quantity || 1) - 1);
                                    }}
                                    className="p-2 hover:bg-kafe-white transition-all duration-200"
                                  >
                                    <Minus className="h-3 w-3 text-kafe-gray-500" />
                                  </button>
                                  <span className="font-bold text-kafe-black min-w-[28px] text-center text-xs">
                                    {selectedAddOns.find(a => a.id === addOn.id)?.quantity || 0}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const current = selectedAddOns.find(a => a.id === addOn.id);
                                      updateAddOnQuantity(addOn, (current?.quantity || 0) + 1);
                                    }}
                                    className="p-2 hover:bg-kafe-white transition-all duration-200"
                                  >
                                    <Plus className="h-3 w-3 text-kafe-gray-500" />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => updateAddOnQuantity(addOn, 1)}
                                  className="px-5 py-2.5 bg-kafe-black text-kafe-white font-bold text-[10px] tracking-widest uppercase hover:bg-kafe-gray-800 transition-all duration-300"
                                >
                                  ADD
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Price Summary */}
              <div className="border-t-2 border-kafe-black pt-8 mb-8">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black tracking-[0.3em] text-kafe-gray-400 uppercase">TOTAL PRICE</span>
                  <span className="text-3xl font-playfair font-black text-kafe-black">₱{calculatePrice().toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleCustomizedAddToCart}
                className="w-full bg-kafe-black text-kafe-white py-6 font-black text-xs tracking-[0.3em] uppercase hover:bg-kafe-gray-800 transition-all duration-300 flex items-center justify-center space-x-3 group"
              >
                <ShoppingCart className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                <span>CONFIRM ORDER</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MenuItemCard;