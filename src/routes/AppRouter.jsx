import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAuthenticated, selectUserRole } from "../redux/slices/authSlice";

// Auth Pages
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/Register";
import OtpVerification from "../pages/auth/OtpVerification";

// Admin Components
import App from "../App";
import { DefaultView } from "../adminDashboard/components/DummyForms";

// Manage Account
import AllOffersTable from "../adminDashboard/forms/AllProductsTable";
import AddOffersForm from "../adminDashboard/forms/AddProjectForm";
import ApproveOffersTable from "../adminDashboard/forms/ApproveProjectTable";

// Manage Category
import AllCategoriesTable from "../adminDashboard/forms/AllCategoriesTable";
import AddCategoryForm from "../adminDashboard/forms/AddCategoryForm";

// Leads
import ABCAnalytics from "../adminDashboard/forms/ABCAnalytics";
import LeadsTable from "../adminDashboard/forms/LeadsTable";

// User Management
import UsersTable from "../adminDashboard/forms/UsersTable";

// Slide Board
import AllSlidesTable from "../adminDashboard/forms/AllSlidesTable";
import AddSlideForm from "../adminDashboard/forms/AddSlideForm";

// Payment Withdrawal
import PaymentWithdrawalTable from "../adminDashboard/forms/PaymentWithdrawalTable";

// Miscellaneous
import ResetPasswordForm from "../adminDashboard/forms/ResetPasswordForm";
import AdminLogsTable from "../adminDashboard/forms/AdminLogsTable";
import UserQueriesTable from "../adminDashboard/forms/UserQueriesTable";
import KYCReview from "../adminDashboard/forms/KYCReview";

// Notifications
import AdminDashboard from "../adminDashboard/notifications/AdminDashboard";
import IncompleteProfilePage from "../adminDashboard/notifications/IncompleteProfilePage";
import HotOffersPage from "../adminDashboard/notifications/HotOffersPage";
import HistoryPage from "../adminDashboard/notifications/HistoryPage";

// User Dashboard
import { UserDashboardLayout } from "../userDashboard/pages";
import Dashboard from "../userDashboard/components/Dashboard";
import AllLeads from "../userDashboard/pages/AllLeads";
import ApprovedLeads from "../userDashboard/layouts/ApprovedLeads";
import PendingLeads from "../userDashboard/layouts/PendingLeads";
import RejectedLeads from "../userDashboard/layouts/RejectedLeads";
import Wallet from "../userDashboard/pages/wallet";
import Profile from "../userDashboard/pages/profile";
import DematAccount from "../userDashboard/layouts/DematAccount";
import ZeroFeeDemat from "../userDashboard/layouts/ZeroFreeDemat";
import WalletAndWithdrawl from "../userDashboard/layouts/Wallet&Withdrawl";
import ProfileOverview from "../userDashboard/layouts/ProfileOverview";
import KYCDetails from "../userDashboard/layouts/KYCDetails";
import TotalBalance from "../userDashboard/layouts/TotalBalance";
import NotificationsPage from "../userDashboard/layouts/NotificationPage";
import SharedOfferForm from "../userDashboard/pages/SharedOfferForm";
// Route Components
import ProtectedRoute from "./ProtectedRoute";
import RoleBasedRoute from "./RoleBasedRoute";
import Loader from "../components/Loader";

/**
 * Main Application Router
 */
export default function AppRouter() {
  // ✅ Load and store theme preference
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-otp" element={<OtpVerification />} />

        {/* Public Share Link Route */}
        <Route path="/share/:offerId/:hrUserId" element={<SharedOfferForm darkMode={darkMode} />} />

        {/* Admin Dashboard Routes */}
        <Route 
          path="/admin/*" 
          element={
            <RoleBasedRoute role="admin">
              <App />
            </RoleBasedRoute>
          }
        >
          {/* Default route - redirect to all-Offers */}
          <Route index element={<Navigate to="all-Offers" replace />} />
          
          {/* Manage Account routes */}
          <Route path="manage-account" element={<Navigate to="all-Offers" replace />} />
          <Route path="all-Offers" element={<AllOffersTable />} />
          <Route path="add-Offers" element={<AddOffersForm />} />
          <Route path="approve-Offers" element={<ApproveOffersTable />} />
          
          {/* Manage Category routes */}
          <Route path="manage-category" element={<Navigate to="all-categories" replace />} />
          <Route path="all-categories" element={<AllCategoriesTable />} />
          <Route path="add-category" element={<AddCategoryForm />} />
          
          {/* Leads routes */}
          <Route path="leads" element={<Navigate to="abc-analytics" replace />} />
          <Route path="abc-analytics" element={<ABCAnalytics />} />
          <Route path="leads-pending" element={<LeadsTable status="pending" />} />
          <Route path="leads-approved" element={<LeadsTable status="approved" />} />
          <Route path="leads-completed" element={<LeadsTable status="completed" />} />
          <Route path="leads-rejected" element={<LeadsTable status="rejected" />} />
          
          {/* User Management routes */}
          <Route path="user-management" element={<Navigate to="all-active-users" replace />} />
          <Route path="all-active-users" element={<UsersTable userType="active" />} />
          <Route path="all-hold-users" element={<UsersTable userType="hold" />} />
          <Route path="all-ex-users" element={<UsersTable userType="ex" />} />
          
          {/* Slide Board routes */}
          <Route path="slideboard" element={<Navigate to="all-slides" replace />} />
          <Route path="all-slides" element={<AllSlidesTable />} />
          <Route path="add-slide" element={<AddSlideForm />} />
          
          {/* Payment Withdrawal */}
          <Route path="payment-withdrawal" element={<PaymentWithdrawalTable />} />
          
          {/* Notifications routes */}
          <Route path="notifications" element={<AdminDashboard />} />
          <Route path="notifications/incomplete-profile" element={<IncompleteProfilePage />} />
          <Route path="notifications/hot-offers" element={<HotOffersPage />} />
          <Route path="notifications/history" element={<HistoryPage />} />
          
          {/* Miscellaneous routes */}
          <Route path="miscellaneous" element={<ResetPasswordForm />} />
          <Route path="reset-password" element={<ResetPasswordForm />} />
          <Route path="admin-logs" element={<AdminLogsTable />} />
          <Route path="user-queries" element={<UserQueriesTable />} />
          <Route path="kyc-review" element={<KYCReview />} />
        </Route>

        {/* ✅ User Dashboard */}
        <Route
          path="/user/*"
          element={
            <RoleBasedRoute role="user">
              <UserDashboardLayout darkMode={darkMode} setDarkMode={setDarkMode} />
            </RoleBasedRoute>
          }
        >
          <Route index element={<Dashboard darkMode={darkMode} />} />
          <Route path="dashboard" element={<Dashboard darkMode={darkMode} />} />
          <Route path="all-leads" element={<AllLeads darkMode={darkMode} />} />
          <Route path="pending-leads" element={<PendingLeads darkMode={darkMode} />} />
          <Route path="approved-leads" element={<ApprovedLeads darkMode={darkMode} />} />
          <Route path="rejected-leads" element={<RejectedLeads darkMode={darkMode} />} />
          <Route path="wallet" element={<Wallet darkMode={darkMode} />} />
          <Route path="profile" element={<Profile darkMode={darkMode} />} />
          <Route path="demat-account" element={<DematAccount darkMode={darkMode} />} />
          <Route path="category-offers/:categoryId" element={<DematAccount darkMode={darkMode} />} />
          <Route path="zerofee-demat" element={<ZeroFeeDemat darkMode={darkMode} />} />
          <Route path="zerofee-demat/:offerId" element={<ZeroFeeDemat darkMode={darkMode} />} />
          <Route path="wallet-withdrawl" element={<WalletAndWithdrawl darkMode={darkMode} />} />
          <Route path="profile-overview" element={<ProfileOverview darkMode={darkMode} />} />
          <Route path="kyc-details" element={<KYCDetails darkMode={darkMode} />} />
          <Route path="total-balance" element={<TotalBalance darkMode={darkMode} />} />
          <Route path="notification-page" element={<NotificationsPage darkMode={darkMode} />} />
        </Route>

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

