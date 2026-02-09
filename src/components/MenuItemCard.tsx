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
      <div className={`bg-kafe-white rounded-none shadow-[0_1px_3px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-500 overflow-hidden group border border-kafe-gray-100 ${!item.available ? 'opacity-50 grayscale' : ''}`}>
        {/* Image Container with Badges */}
        <div className="relative h-64 bg-kafe-gray-50 overflow-hidden">
          {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
              loading="lazy"
              decoding="async"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : null}
          <div className={`absolute inset-0 flex items-center justify-center bg-kafe-gray-50 ${item.image ? 'hidden' : ''}`}>
            <div className="text-5xl opacity-10 text-kafe-black">☕</div>
          </div>

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {item.isOnDiscount && item.discountPrice && (
              <div className="bg-kafe-black text-kafe-white text-[10px] font-bold tracking-widest px-3 py-1 uppercase rounded-none shadow-sm">
                SALE
              </div>
            )}
            {item.popular && (
              <div className="bg-kafe-white text-kafe-black border border-kafe-black text-[10px] font-bold tracking-widest px-3 py-1 uppercase rounded-none shadow-sm">
                FEATURED
              </div>
            )}
          </div>

          {!item.available && (
            <div className="absolute inset-0 bg-kafe-white/80 backdrop-blur-[2px] flex items-center justify-center">
              <span className="text-kafe-black text-xs font-black tracking-[0.3em] uppercase border-y-2 border-kafe-black py-2 px-4">
                Sold Out
              </span>
            </div>
          )}

          {/* Discount Percentage Badge */}
          {item.isOnDiscount && item.discountPrice && (
            <div className="absolute bottom-4 right-4 bg-kafe-white text-kafe-black text-[10px] font-bold tracking-widest px-2 py-1 uppercase">
              -{Math.round(((item.basePrice - item.discountPrice) / item.basePrice) * 100)}%
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-7">
          <div className="flex items-start justify-between mb-4">
            <h4 className="text-lg font-playfair font-bold text-kafe-black uppercase tracking-tight leading-tight flex-1 pr-4">{item.name}</h4>
          </div>

          <p className={`text-xs font-inter uppercase tracking-wider mb-6 leading-relaxed ${!item.available ? 'text-kafe-gray-400' : 'text-kafe-gray-500'}`}>
            {item.description}
          </p>

          {/* Pricing Section */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              {item.isOnDiscount && item.discountPrice ? (
                <div className="flex items-center space-x-3">
                  <span className="text-xl font-bold text-kafe-black">
                    ₱{item.discountPrice.toFixed(2)}
                  </span>
                  <span className="text-xs text-kafe-gray-400 line-through">
                    ₱{item.basePrice.toFixed(2)}
                  </span>
                </div>
              ) : (
                <div className="text-xl font-bold text-kafe-black">
                  ₱{item.basePrice.toFixed(2)}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div>
              {item.available && (
                quantity === 0 ? (
                  <button
                    onClick={handleAddToCart}
                    className="group flex items-center space-x-2 bg-kafe-black text-kafe-white px-6 py-3 rounded-none hover:bg-kafe-gray-800 transition-all duration-300 transform active:scale-95 font-bold text-[10px] tracking-widest uppercase"
                  >
                    <span>{item.variations?.length || item.addOns?.length ? 'OPTIONS' : 'ADD'}</span>
                  </button>
                ) : (
                  <div className="flex items-center bg-kafe-gray-100 rounded-none p-1 border border-kafe-gray-200">
                    <button
                      onClick={handleDecrement}
                      className="p-2 hover:bg-kafe-white hover:text-kafe-black transition-all duration-200"
                    >
                      <Minus className="h-3 w-3 text-kafe-gray-500" />
                    </button>
                    <span className="font-bold text-kafe-black min-w-[32px] text-center text-xs">{quantity}</span>
                    <button
                      onClick={handleIncrement}
                      className="p-2 hover:bg-kafe-white hover:text-kafe-black transition-all duration-200"
                    >
                      <Plus className="h-3 w-3 text-kafe-gray-500" />
                    </button>
                  </div>
                )
              )}
            </div>
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