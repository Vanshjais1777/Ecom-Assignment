import React, { useState } from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCartStore } from '../store/useCartStore';

export default function Cart() {
  const { items, removeItem, updateQuantity, clearCart, total } = useCartStore();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    if (newQuantity > 0) {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleCheckout = () => {
    setIsProcessing(true);
    setTimeout(() => {
      clearCart();
      toast.success('Order placed successfully!', {
        duration: 4000,
      });
      setIsProcessing(false);
    }, 1500);
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-900">Your cart is empty</h2>
        <p className="mt-2 text-gray-600">Add some products to your cart to see them here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <ul className="divide-y divide-gray-200">
          {items.map((item) => (
            <li key={item.id} className="p-6 flex flex-col sm:flex-row sm:items-center">
              <div className="flex-shrink-0 w-24 h-24 mx-auto sm:mx-0">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-contain"
                />
              </div>
              
              <div className="mt-4 sm:mt-0 sm:ml-6 flex-1">
                <h3 className="text-lg font-medium text-gray-900">{item.title}</h3>
                <p className="mt-1 text-lg font-semibold text-blue-600">
                  ${item.price.toFixed(2)}
                </p>
              </div>
              
              <div className="mt-4 sm:mt-0 sm:ml-6 flex items-center">
                <button
                  onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                  className="p-1 text-gray-500 hover:text-gray-700"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="mx-4 text-gray-900">{item.quantity}</span>
                <button
                  onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                  className="p-1 text-gray-500 hover:text-gray-700"
                >
                  <Plus className="h-4 w-4" />
                </button>
                <button
                  onClick={() => removeItem(item.id)}
                  className="ml-4 p-1 text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center text-lg font-semibold text-gray-900">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
        
        <button
          onClick={handleCheckout}
          disabled={isProcessing}
          className="mt-6 w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
              Processing...
            </>
          ) : (
            'Checkout'
          )}
        </button>
      </div>
    </div>
  );
}