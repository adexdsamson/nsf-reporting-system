import { Dashboard } from "@/layouts/Dashboard";
import { ErrorFallback } from "@/components/layouts/Error";
import { ProtectedRoute } from "./PrivateRoute";
import { Route } from "react-router-dom";
import { AuthLayout } from "@/layouts/AuthLayout";
import { NotFound } from "@/layouts/NotFound";
import { PublicRoute } from "./PublicRoute";
import { Login } from "@/pages/Login";
import { DashboardPage } from "@/pages/DashboardPage";
import { TransactionDetail } from "@/pages/Detail";
import { Reports } from '@/pages/Reports/index';

export const routes = (
  <>
    <Route
      path="/"
      element={<AuthLayout />}
      errorElement={<NotFound></NotFound>}
    >
      {[{ path: "/", element: <Login /> }].map((item, index) => (
        <Route
          key={index}
          path={item.path}
          element={<PublicRoute key={index}>{item.element}</PublicRoute>}
        />
      ))}
    </Route>

    <Route
      path="/dashboard"
      errorElement={<ErrorFallback />}
      element={<Dashboard />}
    >
      {[
        { path: "/dashboard/home", element: <DashboardPage /> },
        { path: "/dashboard/detail/:id", element: <TransactionDetail /> },
        { path: "/dashboard/reports/:id", element: <Reports /> },
      ].map((item, index) => (
        <Route
          key={index}
          path={item.path}
          element={<ProtectedRoute key={index}>{item.element}</ProtectedRoute>}
        />
      ))}
    </Route>
  </>
);
