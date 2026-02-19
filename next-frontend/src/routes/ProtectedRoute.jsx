"use client"

import Loading from "@/components/states/Loading";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isLoading, user } = useAuth();

  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.replace("/login");
      } else if (allowedRoles && !allowedRoles.includes(user?.role)) {
        router.replace("/");
      }
    }
  }, [isLoading, user, allowedRoles, router]);

  if (isLoading || !user) {
    return <Loading fullScreen={isLoading} />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Loading fullScreen={isLoading} />;
  }

  return children;
};

export default ProtectedRoute;
