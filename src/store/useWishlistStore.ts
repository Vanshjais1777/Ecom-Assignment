import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product, WishlistItem } from '../types';

interface WishlistState {
  items: WishlistItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: number) => void;
  isInWishlist: (productId: number) => boolean;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) => {
        const isExisting = get().items.some(item => item.id === product.id);
        if (!isExisting) {
          set((state) => ({
            items: [...state.items, { ...product, addedAt: new Date().toISOString() }],
          }));
        }
      },
      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        }));
      },
      isInWishlist: (productId) => {
        return get().items.some(item => item.id === productId);
      },
    }),
    {
      name: 'wishlist-storage',
    }
  )
);