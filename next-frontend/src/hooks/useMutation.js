import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createBook,
  deleteBook,
  updateBook,
  updateMyBook,
} from "../services/booksApi";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { contactMe } from "@/services/contact";
import { placeOrder, updateOrderStatus } from "@/services/orderApi";
import { useCart } from "@/context/CartContext";
import { useCheckout } from "@/context/CheckoutContext";

export const useCreateBookMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: createBook,
    onSuccess: () => {
      // 🔑 refresh books list
      queryClient.invalidateQueries({ queryKey: ["books"] });

      // (optional, if dashboard shows book stats later)
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      router.push("/inventory");
    },
  });
};
export const useUpdateBookMutation = ({ onClose }) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: user.role === "admin" ? updateBook : updateMyBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      onClose();
    },
  });
};

export const usedeleteMutation = ({ onClose }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      onClose();
    },
  });
};

//place Order and Payment
export const usePlaceOrderMutation = ({ setNotification }) => {
  const { clearCart } = useCart();
  const { resetCheckout } = useCheckout();

  return useMutation({
    mutationFn: placeOrder,
    onSuccess: (data) => {
      resetCheckout();
      clearCart();
      setNotification(true);
    },
    onError: (error) => {
      console.log(error);
    },
  });
};
export const useUpdateOrderStateMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: updateOrderStatus,
    onSuccess: (data) => {
      queryClient.invalidateQueries(["orders"]);
      router.push("/books");
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

// contactMe
export const useContactMutation = ({ setIsMessage, setName, setMessage }) => {
  return useMutation({
    mutationFn: contactMe,
    onSuccess: (data) => {
      setIsMessage(true);
      setName("");
      setMessage("");
    },
  });
};
