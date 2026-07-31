import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import AdminLayout from "@/components/layout/AdminLayout";
import Login from "@/pages/auth/Login";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import ResetPassword from "@/pages/auth/ResetPassword";
import Dashboard from "@/pages/dashboard/Dashboard";
import PeptidesPage from "@/pages/peptides/PeptidesPage";
import VendorsPage from "@/pages/vendors/VendorsPage";
import BlogPage from "@/pages/blog/BlogPage";
import FaqPage from "@/pages/faq/FaqPage";
import DisclaimerPage from "@/pages/disclaimer/DisclaimerPage";
import BannerPage from "@/pages/banner/BannerPage";
import SupportPage from "@/pages/support/SupportPage";
import ApplicationPage from "@/pages/application/ApplicationPage";
import ProfilePage from "@/pages/profile/ProfilePage";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      <Route
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Dashboard />} />
        <Route path="/peptides" element={<PeptidesPage />} />
        <Route path="/vendors" element={<VendorsPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/disclaimer" element={<DisclaimerPage />} />
        <Route path="/banner" element={<BannerPage />} />
        <Route path="/support" element={<SupportPage />} />
        <Route path="/applications" element={<ApplicationPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
