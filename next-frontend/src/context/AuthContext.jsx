"use client";

import { createContext, useContext } from "react";
import { getUser, logoutUser } from "../services/authApi";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data, isLoading, error } = useQuery({
    queryKey: ["user"],
    queryFn: ({ signal }) => getUser({ signal }),
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });

  const user = data?.user ?? null;

  const login = async () => {
    await queryClient.invalidateQueries({ queryKey: ["user"] });
    router.push("/books");
  };

  const logout = async () => {
    await logoutUser();
    queryClient.clear();
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
