import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface WorkoutItem {
  id: string;
  name: string;
  duration: string;
  description: string;
  battlePlan: string;
  imageUrl: string;
  intensityReason: string;
  equipment: string;
  difficulty: string;
  workoutType: string;
  moodTips: {
    icon: string;
    title: string;
    description: string;
  }[];
}

interface CartContextType {
  cartItems: WorkoutItem[];
  addToCart: (workout: WorkoutItem) => void;
  removeFromCart: (workoutId: string) => void;
  clearCart: () => void;
  isInCart: (workoutId: string) => boolean;
  reorderCart: (startIndex: number, endIndex: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<WorkoutItem[]>([]);

  const addToCart = (workout: WorkoutItem) => {
    setCartItems(prevItems => {
      const isAlreadyInCart = prevItems.some(item => item.id === workout.id);
      if (isAlreadyInCart) {
        return prevItems;
      }
      return [...prevItems, workout];
    });
  };

  const removeFromCart = (workoutId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== workoutId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const isInCart = (workoutId: string) => {
    return cartItems.some(item => item.id === workoutId);
  };

  const reorderCart = (startIndex: number, endIndex: number) => {
    const result = Array.from(cartItems);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    setCartItems(result);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        isInCart,
        reorderCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};