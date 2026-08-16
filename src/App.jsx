import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import ProtectedRoute from "./routes/ProtectedRoute";

import SuperAdminLayout from "./layouts/SuperAdminLayout";

import SuperAdminDashboard from "./pages/super-admin/dashboard/SuperAdminDashboard";
import SuperAdminReports from "./pages/super-admin/reports/SuperAdminReports";
import SuperAdminIncomeStatement from "./pages/super-admin/income-statement/SuperAdminIncomeStatement";
import SuperAdminCashFlow from "./pages/super-admin/cash-flow/SuperAdminCashFlow";
import SuperAdminBankAccounts from "./pages/super-admin/bank-accounts/SuperAdminBankAccounts";
import SuperAdminInvoices from "./pages/super-admin/invoices/SuperAdminInvoices";
import SuperAdminUsers from "./pages/super-admin/users/SuperAdminUsers";
import AIInnovationHub from "./pages/super-admin/ai-hub/AIInnovationHub";

import SignIn from "./pages/auth/SignIn";

import ModulePlaceholder from "./components/common/ModulePlaceholder";
import SuperAdminNotFound from "./pages/super-admin/SuperAdminNotFound";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* =====================================================
            ROOT
        ===================================================== */}
        <Route
          path="/"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

        {/* =====================================================
            AUTH
        ===================================================== */}
        <Route
          path="/login"
          element={<SignIn />}
        />

        {/* =====================================================
            SUPER ADMIN
        ===================================================== */}
        <Route
          path="/super-admin"
          element={
            <ProtectedRoute>
              <SuperAdminLayout />
            </ProtectedRoute>
          }
        >
          {/* Dashboard */}
          <Route
            index
            element={<SuperAdminDashboard />}
          />

          {/* Reports */}
          <Route
            path="reports"
            element={<SuperAdminReports />}
          />

          {/* Income Statement */}
          <Route
            path="income-statement"
            element={<SuperAdminIncomeStatement />}
          />

          {/* Cash Flow Statement */}
          <Route
            path="cash-flow"
            element={<SuperAdminCashFlow />}
          />

          {/* Bank Accounts */}
          <Route
            path="bank-accounts"
            element={<SuperAdminBankAccounts />}
          />

          {/* Invoice */}
          <Route
            path="invoices"
            element={<SuperAdminInvoices />}
          />

          {/* User Management */}
          <Route
            path="users"
            element={<SuperAdminUsers />}
          />

          {/* Investors */}
          <Route
            path="investors"
            element={
              <ModulePlaceholder
                title="Investors"
              />
            }
          />

          {/* AI Innovation Hub */}
          <Route
            path="ai-hub"
            element={<AIInnovationHub />}
          />

          {/* Chat Monitoring */}
          <Route
            path="chat-monitoring"
            element={
              <ModulePlaceholder
                title="Chat Monitoring"
              />
            }
          />

          {/* Deleted Orders */}
          <Route
            path="deleted-orders"
            element={
              <ModulePlaceholder
                title="Deleted Orders"
              />
            }
          />

          {/* Super Admin 404 */}
          <Route
            path="*"
            element={<SuperAdminNotFound />}
          />
        </Route>

        {/* =====================================================
            GLOBAL FALLBACK
        ===================================================== */}
        <Route
          path="*"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;