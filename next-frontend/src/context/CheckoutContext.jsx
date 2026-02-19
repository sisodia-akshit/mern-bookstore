"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { createContext, useContext, useState, useMemo, useCallback } from "react";

import { checkoutPreviewApi } from "../services/cartApi";
import { addAddress, setDefaultAddress } from "../services/userApi";
import { useAuth } from "./AuthContext";

const CheckoutContext = createContext(null);

export const CheckoutProvider = ({ children }) => {
    const { user } = useAuth();
    const [userAddresses, setUserAddresses] = useState(undefined);
    const [selectedAddress, setSelectedAddress] = useState(undefined);
    const [paymentMethod, setPaymentMethod] = useState("COD");

    const { data, isLoading, error } = useQuery({
        queryKey: ["preview"],
        queryFn: checkoutPreviewApi,
        enabled: user !== null,
        retry: false,                 // STOP retrying on 401
        refetchOnWindowFocus: false,  // STOP refetch spam
    });

    const preview = useMemo(() => {
        return data?.data ?? {};
    }, [data])

    const addAddressMutation = useMutation({
        mutationFn: addAddress,
        onSuccess: (data) => {
            setUserAddresses(data.data.addresses)
            setSelectedAddress(data.data.defaultAddress)
        },
        onError: (error) => {
            console.log(error)
        }
    });

    const setDefaultAddressMutation = useMutation({
        mutationFn: setDefaultAddress,
        onSuccess: (data) => {
            setUserAddresses(data.data.addresses)
            setSelectedAddress(data.data.defaultAddress)
        },
        onError: (error) => {
            console.log(error)
        }
    });

    const addNewAddress = useCallback((address) => {
        addAddressMutation.mutate(address)
    }, [addAddressMutation])

    const setDefaultAddressHandler = useCallback((address) => {
        setDefaultAddressMutation.mutate(address)
    }, [setDefaultAddressMutation])

    const resetCheckout = () => {
        setSelectedAddress(null);
        setPaymentMethod("COD");
    };

    const isPending = setDefaultAddressMutation.isPending || addAddressMutation.isPending;
    const mutationError = setDefaultAddressMutation.error || addAddressMutation.error;

    const value = useMemo(() => ({
        preview,
        isLoading,
        error,

        isPending,
        mutationError,
        userAddresses,
        selectedAddress,
        addNewAddress,
        setDefaultAddressHandler,
        setSelectedAddress,

        paymentMethod,
        setPaymentMethod,
        resetCheckout,
    }), [
        preview,
        isLoading,
        error,

        isPending,
        mutationError,
        userAddresses,
        selectedAddress,
        addNewAddress,
        setDefaultAddressHandler,
        setSelectedAddress,

        paymentMethod
    ]);

    return (
        <CheckoutContext.Provider value={value}>
            {children}
        </CheckoutContext.Provider>
    );
};

export const useCheckout = () => {
    const context = useContext(CheckoutContext);
    if (!context) {
        throw new Error("useCheckout must be used within CheckoutProvider");
    }
    return context;
};
