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
          {/* DASHBOARD */}
          <Route
            index
            element={<SuperAdminDashboard />}
          />

          {/* REPORTS */}
          <Route
            path="reports"
            element={<SuperAdminReports />}
          />

          {/* INCOME STATEMENT */}
          <Route
            path="income-statement"
            element={<SuperAdminIncomeStatement />}
          />

          {/* CASH FLOW STATEMENT */}
          <Route
            path="cash-flow"
            element={
              <ModulePlaceholder
                title="Cash Flow Statement"
              />
            }
          />

          {/* BANK ACCOUNTS */}
          <Route
            path="bank-accounts"
            element={
              <ModulePlaceholder
                title="Bank Accounts"
              />
            }
          />

          {/* INVOICES */}
          <Route
            path="invoices"
            element={
              <ModulePlaceholder
                title="Invoice"
              />
            }
          />

          {/* USER MANAGEMENT */}
          <Route
            path="users"
            element={<SuperAdminUsers />}
          />

          {/* INVESTORS */}
          <Route
            path="investors"
            element={
              <ModulePlaceholder
                title="Investors"
              />
            }
          />

          {/* AI INNOVATION HUB */}
          <Route
            path="ai-hub"
            element={<AIInnovationHub />}
          />

          {/* CHAT MONITORING */}
          <Route
            path="chat-monitoring"
            element={
              <ModulePlaceholder
                title="Chat Monitoring"
              />
            }
          />

          {/* DELETED ORDERS */}
          <Route
            path="deleted-orders"
            element={
              <ModulePlaceholder
                title="Deleted Orders"
              />
            }
          />

          {/* SUPER ADMIN 404 */}
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