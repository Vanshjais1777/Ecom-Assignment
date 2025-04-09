import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, ShoppingCart } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { useWishlistStore } from '../store/useWishlistStore';
import { useCartStore } from '../store/useCartStore';

export default function Wishlist() {
  const { items, removeItem } = useWishlistStore();
  const addToCart = useCartStore((state) => state.addItem);

  const handleAddToCart = (productId: number) => {
    const product = items.find(item => item.id === productId);
    if (product) {
      addToCart(product);
      removeItem(productId);
      toast.success('Added to cart!');
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-900">Your wishlist is empty</h2>
        <p className="mt-2 text-gray-600">Save items you want to buy later!</p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">My Wishlist</h1>
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <ul className="divide-y divide-gray-200">
          {items.map((item) => (
            <li key={item.id} className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center">
                <div className="flex-shrink-0 w-24 h-24 mx-auto sm:mx-0">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-contain"
                  />
                </div>
                
                <div className="mt-4 sm:mt-0 sm:ml-6 flex-1">
                  <Link to={`/product/${item.id}`} className="hover:text-blue-600">
                    <h3 className="text-lg font-medium text-gray-900">{item.title}</h3>
                  </Link>
                  <p className="mt-1 text-lg font-semibold text-blue-600">
                    ${item.price.toFixed(2)}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Added {format(new Date(item.addedAt), 'MMM d, yyyy')}
                  </p>
                </div>
                
                <div className="mt-4 sm:mt-0 sm:ml-6 flex items-center space-x-4">
                  <button
                    onClick={() => handleAddToCart(item.id)}
                    className="flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </button>
                  <button
                    onClick={() => {
                      removeItem(item.id);
                      toast.success('Removed from wishlist');
                    }}
                    className="p-2 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}