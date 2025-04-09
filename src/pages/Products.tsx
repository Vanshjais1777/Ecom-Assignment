import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Heart, HeartOff } from 'lucide-react';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ProductSort } from '../components/ProductSort';
import { useWishlistStore } from '../store/useWishlistStore';
import type { Product, SortOption } from '../types';
import toast from 'react-hot-toast';

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('price-asc');
  const [isLoading, setIsLoading] = useState(true);
  const { addItem, removeItem, isInWishlist } = useWishlistStore();

  useEffect(() => {
    Promise.all([
      fetch('https://fakestoreapi.com/products').then(res => res.json()),
      fetch('https://fakestoreapi.com/products/categories').then(res => res.json())
    ])
      .then(([productsData, categoriesData]) => {
        setProducts(productsData);
        setCategories(categoriesData);
        setIsLoading(false);
      })
      .catch(() => {
        toast.error('Failed to load products');
        setIsLoading(false);
      });
  }, []);

  const handleWishlistToggle = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    if (isInWishlist(product.id)) {
      removeItem(product.id);
      toast.success('Removed from wishlist');
    } else {
      addItem(product);
      toast.success('Added to wishlist');
    }
  };

  const sortProducts = (products: Product[]): Product[] => {
    return [...products].sort((a, b) => {
      switch (sortOption) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'rating-desc':
          return b.rating.rate - a.rating.rate;
        case 'name-asc':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });
  };

  const filteredProducts = products.filter(product => {
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sortedProducts = sortProducts(filteredProducts);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search products..."
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-4 w-full sm:w-auto">
          <select
            className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
          <ProductSort value={sortOption} onChange={setSortOption} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sortedProducts.map((product) => (
          <Link
            key={product.id}
            to={`/product/${product.id}`}
            className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden relative"
          >
            <button
              onClick={(e) => handleWishlistToggle(e, product)}
              className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md z-10 transition-colors hover:bg-gray-100"
            >
              {isInWishlist(product.id) ? (
                <Heart className="h-5 w-5 text-red-500 fill-current" />
              ) : (
                <HeartOff className="h-5 w-5 text-gray-400" />
              )}
            </button>
            <div className="aspect-square overflow-hidden bg-white">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-200"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-medium text-gray-900 truncate">
                {product.title}
              </h3>
              <p className="mt-1 text-xl font-semibold text-blue-600">
                ${product.price.toFixed(2)}
              </p>
              <div className="mt-2 flex items-center">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.round(product.rating.rate)
                          ? 'text-yellow-400'
                          : 'text-gray-200'
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-500">
                  ({product.rating.count})
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {sortedProducts.length === 0 && (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-900">No products found</h2>
          <p className="mt-2 text-gray-600">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}