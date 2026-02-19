"use client";

import { createContext, useContext, useMemo, useCallback, useState } from "react";
import { addToCartApi, clearCartApi, getMyCart, removeFromCartApi, updateCartApi } from "../services/cartApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [toast, setToast] = useState("");



  const { data, isLoading, error } = useQuery({
    queryKey: ["cart", user?._id],
    queryFn: ({ signal }) => getMyCart({ signal }),
    enabled: !!user,
    retry: false,                 // STOP retrying on 401
    refetchOnWindowFocus: false,  // STOP refetch spam
  })
  const cart = useMemo(() => {
    return data?.data?.data ?? { items: [], totalAmount: 0 };
  }, [data]);



  const addToCartMutation = useMutation({
    mutationFn: addToCartApi,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['cart', user?._id] });
      setToast("Added to cart")
      setTimeout(() => {
        setToast("");
      }, 1500);
    },
    onError: (error) => {
      console.error(error);
    }
  });
  const updateCartMutation = useMutation({
    mutationFn: updateCartApi,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['cart', user?._id] });
    },
    onError: (error) => {
      console.error(error);
    }
  });
  const removeFromCartMutation = useMutation({
    mutationFn: removeFromCartApi,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['cart', user?._id] });
    },
    onError: (error) => {
      console.error(error);
    }
  });
  const clearCartMutation = useMutation({
    mutationFn: clearCartApi,
    onSuccess: (data) => {
      console.log("cart cleared successfully")
      queryClient.invalidateQueries({ queryKey: ['cart', user?._id] });
    },
    onError: (error) => {
      console.error(error);
    }
  });

  const addToCart = useCallback(({ book, quantity }) => {
    addToCartMutation.mutate({
      book: book._id,
      quantity,
    })
  }, [addToCartMutation]);

  const updateCart = useCallback(({ book, quantity }) => {
    updateCartMutation.mutate({ book, quantity })
  }, [updateCartMutation]);

  const removeFromCart = useCallback((id) => {
    removeFromCartMutation.mutate({ id })
  }, [removeFromCartMutation]);

  const clearCart = useCallback(() => {
    clearCartMutation.mutate()
  }, [clearCartMutation]);

  const mutationPending =
    addToCartMutation.isPending ||
    updateCartMutation.isPending ||
    removeFromCartMutation.isPending ||
    clearCartMutation.isPending;

  const mutationError = addToCartMutation.error ||
    updateCartMutation.error ||
    removeFromCartMutation.error ||
    clearCartMutation.error;

  const value = useMemo(() => ({
    cart,
    isLoading,
    error,
    mutationPending,
    mutationError,
    toast,
    addToCart,
    removeFromCart,
    clearCart,
    updateCart,

  }), [cart, isLoading, error, mutationPending, mutationError, toast, addToCart, removeFromCart, clearCart, updateCart]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext)
