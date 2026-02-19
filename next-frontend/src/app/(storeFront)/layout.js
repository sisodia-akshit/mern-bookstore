import MainLayout from "@/components/layout/MainLayout";
import ProtectedRoute from "@/routes/ProtectedRoute";

export default function RootLayout({ children }) {
  return (
    <MainLayout>
      <ProtectedRoute>{children}</ProtectedRoute>
    </MainLayout>
  );
}
