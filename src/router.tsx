import { createBrowserRouter, Navigate } from "react-router-dom";
import { ActivationPage } from "@/screens/activation-page";
import { AdminPage } from "@/screens/admin-page";
import { BillingPage } from "@/screens/billing-page";
import { CustomersPage } from "@/screens/customers-page";
import { ForgotPasswordPage } from "@/screens/forgot-password-page";
import { HomePage } from "@/screens/home-page";
import { InterestPaymentPage } from "@/screens/interest-payment-page";
import { LoginPage } from "@/screens/login-page";
import { LoanPage } from "@/screens/loan-page";
import { ProfilePage } from "@/screens/profile-page";
import { ResetPasswordPage } from "@/screens/reset-password-page";
import { RiskReportsPage } from "@/screens/risk-reports-page";

export const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/login" replace /> },
  { path: "/admin", element: <AdminPage /> },
  { path: "/billing", element: <BillingPage /> },
  { path: "/customers", element: <CustomersPage /> },
  { path: "/home", element: <HomePage /> },
  { path: "/interest-payment", element: <InterestPaymentPage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/loan", element: <LoanPage /> },
  { path: "/profile", element: <ProfilePage /> },
  { path: "/risk-reports", element: <RiskReportsPage /> },
  { path: "/forgot-password", element: <ForgotPasswordPage /> },
  { path: "/reset-password", element: <ResetPasswordPage /> },
  { path: "/invitation-set-password", element: <ActivationPage /> },
]);
