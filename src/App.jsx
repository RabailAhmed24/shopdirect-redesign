import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import ProtectedRoute from "./routes/ProtectedRoute";
import SuperAdminUsers from "./pages/super-admin/users/SuperAdminUsers";

import SuperAdminLayout from "./layouts/SuperAdminLayout";
import SuperAdminDashboard from "./pages/super-admin/dashboard/SuperAdminDashboard";
import SuperAdminReports from "./pages/super-admin/reports/SuperAdminReports";
import SignIn from "./pages/auth/SignIn";

import ModulePlaceholder from "./components/common/ModulePlaceholder";
import SuperAdminNotFound from "./pages/super-admin/SuperAdminNotFound";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

        <Route
          path="/login"
          element={<SignIn />}
        />

        <Route
          path="/super-admin"
          element={
            <ProtectedRoute>
              <SuperAdminLayout />
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={
              <SuperAdminDashboard />
            }
          />

          <Route
            path="reports"
            element={
              <SuperAdminReports />
            }
          />

          <Route
            path="income-statement"
            element={
              <ModulePlaceholder
                title="Income Statement"
              />
            }
          />

          <Route
            path="cash-flow"
            element={
              <ModulePlaceholder
                title="Cash Flow Statement"
              />
            }
          />

          <Route
            path="bank-accounts"
            element={
              <ModulePlaceholder
                title="Bank Accounts"
              />
            }
          />

          <Route
            path="invoices"
            element={
              <ModulePlaceholder
                title="Invoice"
              />
            }
          />

         <Route
  path="users"
  element={<SuperAdminUsers />}
/>

          <Route
            path="investors"
            element={
              <ModulePlaceholder
                title="Investors"
              />
            }
          />

          <Route
            path="ai-hub"
            element={
              <ModulePlaceholder
                title="AI Innovation Hub"
              />
            }
          />

          <Route
            path="chat-monitoring"
            element={
              <ModulePlaceholder
                title="Chat Monitoring"
              />
            }
          />

          <Route
            path="deleted-orders"
            element={
              <ModulePlaceholder
                title="Deleted Orders"
              />
            }
          />

          <Route
            path="*"
            element={
              <SuperAdminNotFound />
            }
          />
        </Route>

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