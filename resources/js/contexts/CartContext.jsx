import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { formatPrice } from '../utils/currencyFormatter';
// Cart item structure matching ProductDetailPage
const cartItem = {
  productId: null,
  variantId: null,
  size: '',
  quantity: 1,
  productName: '',
  variantColor: '',
  price: 0,
  image: ''
};

// Initial state
const initialState = {
  items: [],
  total: 0,
  itemCount: 0
};

// Actions
const CART_ACTIONS = {
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
  LOAD_CART: 'LOAD_CART'
};

// Reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTIONS.ADD_ITEM:
      // Check if item already exists (same product, variant, size)
      const existingItemIndex = state.items.findIndex(
        item => 
          item.productId === action.payload.productId &&
          item.variantId === action.payload.variantId &&
          item.size === action.payload.size
      );

      let newItems;
      if (existingItemIndex > -1) {
        // Update quantity if item exists
        newItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
      } else {
        // Add new item
        newItems = [...state.items, action.payload];
      }

      return calculateTotals(newItems);

    case CART_ACTIONS.REMOVE_ITEM:
      const filteredItems = state.items.filter(
        (item, index) => index !== action.payload
      );
      return calculateTotals(filteredItems);

    case CART_ACTIONS.UPDATE_QUANTITY:
      const updatedItems = state.items.map((item, index) =>
        index === action.payload.index
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
      return calculateTotals(updatedItems);

    case CART_ACTIONS.CLEAR_CART:
      return initialState;

    case CART_ACTIONS.LOAD_CART:
      return calculateTotals(action.payload);

    default:
      return state;
  }
};

// Helper function to calculate totals
const calculateTotals = (items) => {
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  
  return {
    items,
    total,
    itemCount
  };
};

// Create Context
const CartContext = createContext();

// Provider Component
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('riderx_cart');
    if (savedCart) {
      try {
        const cartData = JSON.parse(savedCart);
        dispatch({ type: CART_ACTIONS.LOAD_CART, payload: cartData.items });
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('riderx_cart', JSON.stringify(state));
  }, [state]);

  // Actions
  const addItem = (item) => {
    dispatch({ type: CART_ACTIONS.ADD_ITEM, payload: item });
  };

  const removeItem = (index) => {
    dispatch({ type: CART_ACTIONS.REMOVE_ITEM, payload: index });
  };

  const updateQuantity = (index, quantity) => {
    if (quantity < 1) return;
    dispatch({ type: CART_ACTIONS.UPDATE_QUANTITY, payload: { index, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: CART_ACTIONS.CLEAR_CART });
  };

  const value = {
    ...state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use cart
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;