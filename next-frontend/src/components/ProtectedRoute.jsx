import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import Loading from "./Loading";

const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useAuth();

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


  if (isLoading) return <Loading />
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
