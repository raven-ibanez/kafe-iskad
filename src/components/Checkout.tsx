import React, { useState } from 'react';
import { ArrowLeft, Clock } from 'lucide-react';
import { CartItem, PaymentMethod, ServiceType } from '../types';
import { usePaymentMethods } from '../hooks/usePaymentMethods';

interface CheckoutProps {
  cartItems: CartItem[];
  totalPrice: number;
  onBack: () => void;
}

const Checkout: React.FC<CheckoutProps> = ({ cartItems, totalPrice, onBack }) => {
  const { paymentMethods } = usePaymentMethods();
  const [step, setStep] = useState<'details' | 'payment'>('details');
  const [customerName, setCustomerName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [serviceType, setServiceType] = useState<ServiceType>('dine-in');
  const [address, setAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [pickupTime, setPickupTime] = useState('5-10');
  const [customTime, setCustomTime] = useState('');
  // Dine-in specific state
  const [partySize, setPartySize] = useState(1);
  const [dineInTime, setDineInTime] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('gcash');
  const [notes, setNotes] = useState('');

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  // Set default payment method when payment methods are loaded
  React.useEffect(() => {
    if (paymentMethods.length > 0 && !paymentMethod) {
      setPaymentMethod(paymentMethods[0].id as PaymentMethod);
    }
  }, [paymentMethods, paymentMethod]);

  const selectedPaymentMethod = paymentMethods.find(method => method.id === paymentMethod);

  const handleProceedToPayment = () => {
    setStep('payment');
  };

  const handlePlaceOrder = () => {
    const timeInfo = serviceType === 'pickup'
      ? (pickupTime === 'custom' ? customTime : `${pickupTime} minutes`)
      : '';

    const dineInInfo = serviceType === 'dine-in'
      ? `👥 Party Size: ${partySize} person${partySize !== 1 ? 's' : ''}\n🕐 Preferred Time: ${new Date(dineInTime).toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })}`
      : '';

    const orderDetails = `
🛒 Kafe Sikad ORDER

👤 Customer: ${customerName}
📞 Contact: ${contactNumber}
📍 Service: ${serviceType.charAt(0).toUpperCase() + serviceType.slice(1)}
${serviceType === 'delivery' ? `🏠 Address: ${address}${landmark ? `\n🗺️ Landmark: ${landmark}` : ''}` : ''}
${serviceType === 'pickup' ? `⏰ Pickup Time: ${timeInfo}` : ''}
${serviceType === 'dine-in' ? dineInInfo : ''}


📋 ORDER DETAILS:
${cartItems.map(item => {
      let itemDetails = `• ${item.name}`;
      if (item.selectedVariation) {
        itemDetails += ` (${item.selectedVariation.name})`;
      }
      if (item.selectedAddOns && item.selectedAddOns.length > 0) {
        itemDetails += ` + ${item.selectedAddOns.map(addOn =>
          addOn.quantity && addOn.quantity > 1
            ? `${addOn.name} x${addOn.quantity}`
            : addOn.name
        ).join(', ')}`;
      }
      itemDetails += ` x${item.quantity} - ₱${item.totalPrice * item.quantity}`;
      return itemDetails;
    }).join('\n')}

💰 TOTAL: ₱${totalPrice}
${serviceType === 'delivery' ? `🛵 DELIVERY FEE:` : ''}

💳 Payment: ${selectedPaymentMethod?.name || paymentMethod}
📸 Payment Screenshot: Please attach your payment receipt screenshot

${notes ? `📝 Notes: ${notes}` : ''}

Please confirm this order to proceed. Thank you for choosing Kafe Sikad! 🥟
    `.trim();

    const encodedMessage = encodeURIComponent(orderDetails);
    const messengerUrl = `https://m.me/1924770491097054?text=${encodedMessage}`;

    window.open(messengerUrl, '_blank');

  };

  const isDetailsValid = customerName && contactNumber &&
    (serviceType !== 'delivery' || address) &&
    (serviceType !== 'pickup' || (pickupTime !== 'custom' || customTime)) &&
    (serviceType !== 'dine-in' || (partySize > 0 && dineInTime));

  if (step === 'details') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-kafe-gray-400 hover:text-kafe-black transition-all duration-300 group mb-4"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-[10px] font-black tracking-[0.2em] uppercase">BACK TO SELECTION</span>
            </button>
            <h1 className="text-5xl font-playfair font-black text-kafe-black uppercase tracking-tighter">ORDER DETAILS</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Order Summary */}
          <div className="bg-kafe-white border border-kafe-gray-100 p-8">
            <h2 className="text-xs font-black tracking-[0.3em] text-kafe-black mb-8 uppercase border-l-4 border-kafe-black pl-4">YOUR ORDER</h2>

            <div className="space-y-6 mb-8">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-4 border-b border-kafe-gray-50">
                  <div>
                    <h4 className="text-sm font-bold text-kafe-black uppercase tracking-tight">{item.name}</h4>
                    {item.selectedVariation && (
                      <p className="text-[10px] font-bold text-kafe-gray-400 uppercase tracking-widest mt-1">SIZE: {item.selectedVariation.name}</p>
                    )}
                    {item.selectedAddOns && item.selectedAddOns.length > 0 && (
                      <p className="text-[10px] font-bold text-kafe-gray-400 uppercase tracking-widest mt-0.5">
                        EXTRAS: {item.selectedAddOns.map(addOn => addOn.name).join(', ')}
                      </p>
                    )}
                    <p className="text-[10px] font-black text-kafe-black mt-2">₱{item.totalPrice.toFixed(2)} x {item.quantity}</p>
                  </div>
                  <span className="text-sm font-black text-kafe-black">₱{(item.totalPrice * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black tracking-[0.3em] text-kafe-gray-400 uppercase">SUBTOTAL</span>
                <span className="text-3xl font-playfair font-black text-kafe-black">₱{totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Customer Details Form */}
          <div className="bg-kafe-white border border-kafe-gray-100 p-8">
            <h2 className="text-xs font-black tracking-[0.3em] text-kafe-black mb-8 uppercase border-l-4 border-kafe-black pl-4">INFORMATION</h2>

            <form className="space-y-8">
              {/* Customer Information */}
              <div>
                <label className="block text-[10px] font-black tracking-[0.2em] text-kafe-gray-400 uppercase mb-3">FULL NAME *</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-5 py-4 bg-kafe-gray-50 border border-kafe-gray-100 rounded-none focus:ring-1 focus:ring-kafe-black focus:border-kafe-black transition-all duration-300 text-sm font-bold text-kafe-black uppercase tracking-tight"
                  placeholder="ENTER NAME"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-black tracking-[0.2em] text-kafe-gray-400 uppercase mb-3">CONTACT NUMBER *</label>
                <input
                  type="tel"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  className="w-full px-5 py-4 bg-kafe-gray-50 border border-kafe-gray-100 rounded-none focus:ring-1 focus:ring-kafe-black focus:border-kafe-black transition-all duration-300 text-sm font-bold text-kafe-black tracking-widest"
                  placeholder="09XX XXX XXXX"
                  required
                />
              </div>

              {/* Service Type */}
              <div>
                <label className="block text-[10px] font-black tracking-[0.2em] text-kafe-gray-400 uppercase mb-4">SERVICE PREFERENCE *</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { value: 'dine-in', label: 'DINE IN', icon: '🪑' },
                    { value: 'pickup', label: 'PICKUP', icon: '🚶' },
                    { value: 'delivery', label: 'DELIVERY', icon: '🛵' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setServiceType(option.value as ServiceType)}
                      className={`flex flex-col items-center p-6 border transition-all duration-300 ${serviceType === option.value
                        ? 'border-kafe-black bg-kafe-black text-kafe-white'
                        : 'border-kafe-gray-100 bg-kafe-white text-kafe-gray-400 hover:border-kafe-gray-300'
                        }`}
                    >
                      <div className={`text-2xl mb-2 grayscale ${serviceType === option.value ? 'brightness-0 invert' : ''}`}>{option.icon}</div>
                      <div className="text-[10px] font-black tracking-widest uppercase">{option.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Dine-in Details */}
              {serviceType === 'dine-in' && (
                <div className="space-y-8 p-6 bg-kafe-gray-50 border border-kafe-gray-100">
                  <div>
                    <label className="block text-[10px] font-black tracking-[0.2em] text-kafe-black uppercase mb-4">PARTY SIZE *</label>
                    <div className="flex items-center space-x-6">
                      <button
                        type="button"
                        onClick={() => setPartySize(Math.max(1, partySize - 1))}
                        className="w-12 h-12 bg-kafe-white border border-kafe-gray-200 flex items-center justify-center text-kafe-black hover:bg-kafe-gray-100 transition-all duration-200"
                      >
                        -
                      </button>
                      <span className="text-2xl font-black text-kafe-black min-w-[2rem] text-center">{partySize}</span>
                      <button
                        type="button"
                        onClick={() => setPartySize(Math.min(20, partySize + 1))}
                        className="w-12 h-12 bg-kafe-white border border-kafe-gray-200 flex items-center justify-center text-kafe-black hover:bg-kafe-gray-100 transition-all duration-200"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black tracking-[0.2em] text-kafe-black uppercase mb-4">ARRIVAL TIME *</label>
                    <input
                      type="datetime-local"
                      value={dineInTime}
                      onChange={(e) => setDineInTime(e.target.value)}
                      className="w-full px-5 py-4 bg-kafe-white border border-kafe-gray-200 focus:ring-1 focus:ring-kafe-black focus:border-kafe-black transition-all duration-300 text-sm font-bold text-kafe-black"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Pickup Time Selection */}
              {serviceType === 'pickup' && (
                <div className="space-y-8 p-6 bg-kafe-gray-50 border border-kafe-gray-100">
                  <div>
                    <label className="block text-[10px] font-black tracking-[0.2em] text-kafe-black uppercase mb-4">ESTIMATED PICKUP *</label>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { value: '5-10', label: '5-10 MIN' },
                        { value: '15-20', label: '15-20 MIN' },
                        { value: '25-30', label: '25-30 MIN' },
                        { value: 'custom', label: 'CUSTOM' }
                      ].map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setPickupTime(option.value)}
                          className={`p-4 border transition-all duration-300 flex items-center justify-center space-x-2 ${pickupTime === option.value
                            ? 'border-kafe-black bg-kafe-black text-kafe-white'
                            : 'border-kafe-gray-200 bg-kafe-white text-kafe-gray-400 hover:border-kafe-gray-300'
                            }`}
                        >
                          <Clock className={`h-4 w-4 ${pickupTime === option.value ? '' : 'text-kafe-gray-300'}`} />
                          <span className="text-[10px] font-black tracking-widest">{option.label}</span>
                        </button>
                      ))}
                    </div>

                    {pickupTime === 'custom' && (
                      <input
                        type="text"
                        value={customTime}
                        onChange={(e) => setCustomTime(e.target.value)}
                        className="w-full px-5 py-4 mt-4 bg-kafe-white border border-kafe-gray-200 focus:ring-1 focus:ring-kafe-black focus:border-kafe-black transition-all duration-300 text-sm font-bold text-kafe-black uppercase"
                        placeholder="SPECIFY TIME (e.g. 2:30 PM)"
                        required
                      />
                    )}
                  </div>
                </div>
              )}

              {/* Delivery Address */}
              {serviceType === 'delivery' && (
                <div className="space-y-8 p-6 bg-kafe-gray-50 border border-kafe-gray-100">
                  <div>
                    <label className="block text-[10px] font-black tracking-[0.2em] text-kafe-black uppercase mb-4">DELIVERY ADDRESS *</label>
                    <textarea
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-5 py-4 bg-kafe-white border border-kafe-gray-200 focus:ring-1 focus:ring-kafe-black focus:border-kafe-black transition-all duration-300 text-sm font-bold text-kafe-black uppercase"
                      placeholder="ENTER COMPLETE ADDRESS"
                      rows={3}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black tracking-[0.2em] text-kafe-black uppercase mb-4">LANDMARK</label>
                    <input
                      type="text"
                      value={landmark}
                      onChange={(e) => setLandmark(e.target.value)}
                      className="w-full px-5 py-4 bg-kafe-white border border-kafe-gray-200 focus:ring-1 focus:ring-kafe-black focus:border-kafe-black transition-all duration-300 text-sm font-bold text-kafe-black uppercase"
                      placeholder="E.G. NEAR SCHOOL, BESIDE BANK"
                    />
                  </div>
                </div>
              )}

              {/* Special Notes */}
              <div>
                <label className="block text-[10px] font-black tracking-[0.2em] text-kafe-gray-400 uppercase mb-3">SPECIAL INSTRUCTIONS</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-5 py-4 bg-kafe-gray-50 border border-kafe-gray-100 rounded-none focus:ring-1 focus:ring-kafe-black focus:border-kafe-black transition-all duration-300 text-sm font-bold text-kafe-black uppercase"
                  placeholder="ADD ANY NOTES..."
                  rows={3}
                />
              </div>

              <button
                type="button"
                onClick={handleProceedToPayment}
                disabled={!isDetailsValid}
                className={`w-full py-6 font-black text-xs tracking-[0.3em] uppercase transition-all duration-500 transform ${isDetailsValid
                  ? 'bg-kafe-black text-kafe-white hover:bg-kafe-gray-800 shadow-xl'
                  : 'bg-kafe-gray-100 text-kafe-gray-300 cursor-not-allowed border border-kafe-gray-200'
                  }`}
              >
                PROCEED TO PAYMENT
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Payment Step
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <button
            onClick={() => setStep('details')}
            className="flex items-center space-x-2 text-kafe-gray-400 hover:text-kafe-black transition-all duration-300 group mb-4"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black tracking-[0.2em] uppercase">BACK TO DETAILS</span>
          </button>
          <h1 className="text-5xl font-playfair font-black text-kafe-black uppercase tracking-tighter">PAYMENT</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Payment Method Selection */}
        <div className="bg-kafe-white border border-kafe-gray-100 p-8">
          <h2 className="text-xs font-black tracking-[0.3em] text-kafe-black mb-10 uppercase border-l-4 border-kafe-black pl-4">SECURE PAYMENT</h2>

          <div className="grid grid-cols-1 gap-4 mb-10">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                type="button"
                onClick={() => setPaymentMethod(method.id as PaymentMethod)}
                className={`flex items-center space-x-6 p-6 border transition-all duration-300 ${paymentMethod === method.id
                  ? 'border-kafe-black bg-kafe-black text-kafe-white shadow-lg'
                  : 'border-kafe-gray-100 bg-kafe-white text-kafe-gray-400 hover:border-kafe-gray-300'
                  }`}
              >
                <span className={`text-2xl grayscale ${paymentMethod === method.id ? 'brightness-0 invert' : ''}`}>💳</span>
                <span className="text-sm font-black tracking-widest uppercase">{method.name}</span>
              </button>
            ))}
          </div>

          {/* Payment Details with QR Code */}
          {selectedPaymentMethod && (
            <div className="bg-kafe-gray-50 border border-kafe-gray-100 p-8 mb-10">
              <h3 className="text-[10px] font-black tracking-[0.3em] text-kafe-black mb-6 uppercase">PAYMENT INFORMATION</h3>
              <div className="flex flex-col space-y-8">
                <div className="flex-1 space-y-4">
                  <div>
                    <p className="text-[10px] font-black tracking-widest text-kafe-gray-400 uppercase mb-1">NETWORK</p>
                    <p className="text-sm font-bold text-kafe-black uppercase tracking-tight">{selectedPaymentMethod.name}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black tracking-widest text-kafe-gray-400 uppercase mb-1">ACCOUNT NUMBER</p>
                    <p className="text-lg font-black font-mono tracking-widest text-kafe-black">{selectedPaymentMethod.account_number}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black tracking-widest text-kafe-gray-400 uppercase mb-1">ACCOUNT NAME</p>
                    <p className="text-sm font-bold text-kafe-black uppercase tracking-tight">{selectedPaymentMethod.account_name}</p>
                  </div>
                  <div className="pt-4 border-t border-kafe-gray-200">
                    <p className="text-[10px] font-black tracking-widest text-kafe-gray-400 uppercase mb-1">TOTAL TO PAY</p>
                    <p className="text-4xl font-playfair font-black text-kafe-black">₱{totalPrice.toFixed(2)}</p>
                  </div>
                </div>
                <div className="flex flex-col items-center p-6 bg-kafe-white border border-kafe-gray-200">
                  <img
                    src={selectedPaymentMethod.qr_code_url}
                    alt={`${selectedPaymentMethod.name} QR Code`}
                    className="w-48 h-48 grayscale hover:grayscale-0 transition-all duration-500"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.pexels.com/photos/8867482/pexels-photo-8867482.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop';
                    }}
                  />
                  <p className="text-[10px] font-black tracking-[0.2em] text-kafe-gray-400 text-center mt-6 uppercase">SCAN TO COMPLETE PAYMENT</p>
                </div>
              </div>
            </div>
          )}

          <div className="p-6 border border-kafe-black bg-kafe-black text-kafe-white">
            <h4 className="text-[10px] font-black tracking-[0.3em] mb-3 uppercase">PROOF OF PAYMENT</h4>
            <p className="text-xs font-bold tracking-tight text-kafe-gray-400 uppercase leading-relaxed">
              PLEASE ATTACH A SCREENSHOT OF YOUR PAYMENT RECEIPT TO THE MESSENGER CONVERSATION. ORDERS ARE ONLY PROCESSED UPON VERIFICATION.
            </p>
          </div>
        </div>

        {/* Final Order Summary */}
        <div className="bg-kafe-white border border-kafe-gray-100 p-8">
          <h2 className="text-xs font-black tracking-[0.3em] text-kafe-black mb-10 uppercase border-l-4 border-kafe-black pl-4">FINAL SUMMARY</h2>

          <div className="space-y-8 mb-10">
            <div className="p-6 bg-kafe-gray-50 border border-kafe-gray-100 shadow-inner">
              <h4 className="text-[10px] font-black tracking-[0.3em] text-kafe-black mb-6 uppercase">DETAILS</h4>
              <div className="space-y-4">
                <div className="flex justify-between items-baseline">
                  <span className="text-[10px] font-black text-kafe-gray-400 uppercase tracking-widest">NAME</span>
                  <span className="text-sm font-bold text-kafe-black uppercase">{customerName}</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-[10px] font-black text-kafe-gray-400 uppercase tracking-widest">PHONE</span>
                  <span className="text-sm font-bold text-kafe-black tracking-widest">{contactNumber}</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-[10px] font-black text-kafe-gray-400 uppercase tracking-widest">SERVICE</span>
                  <span className="text-sm font-bold text-kafe-black uppercase">{serviceType.replace('-', ' ')}</span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-4 border-b border-kafe-gray-50">
                  <div>
                    <h4 className="text-sm font-bold text-kafe-black uppercase tracking-tight">{item.name}</h4>
                    <p className="text-[10px] font-black text-kafe-black mt-2">₱{item.totalPrice.toFixed(2)} x {item.quantity}</p>
                  </div>
                  <span className="text-sm font-black text-kafe-black">₱{(item.totalPrice * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-8 border-t-2 border-kafe-black mb-10">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black tracking-[0.3em] text-kafe-gray-400 uppercase">FINAL AMOUNT</span>
              <span className="text-4xl font-playfair font-black text-kafe-black">₱{totalPrice.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={handlePlaceOrder}
            className="w-full py-6 bg-kafe-black text-kafe-white font-black text-xs tracking-[0.3em] uppercase hover:bg-kafe-gray-800 transition-all duration-500 shadow-2xl transform active:scale-95"
          >
            CONFIRM VIA MESSENGER
          </button>

          <p className="text-[10px] font-black tracking-widest text-kafe-gray-400 text-center mt-6 uppercase max-w-xs mx-auto leading-relaxed">
            YOU WILL BE REDIRECTED TO FACEBOOK MESSENGER TO FINALIZE YOUR REQUEST.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Checkout;