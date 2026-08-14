import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import SuperAdminLayout from "./layouts/SuperAdminLayout";
import SuperAdminDashboard from "./pages/super-admin/dashboard/SuperAdminDashboard";

import ModulePlaceholder from "./components/common/ModulePlaceholder";
import SuperAdminNotFound from "./pages/super-admin/SuperAdminNotFound";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Navigate to="/super-admin" replace />}
        />

        <Route
          path="/super-admin"
          element={<SuperAdminLayout />}
        >
          <Route
            index
            element={<SuperAdminDashboard />}
          />

          <Route
            path="reports"
            element={<ModulePlaceholder title="Reports" />}
          />

          <Route
            path="income-statement"
            element={
              <ModulePlaceholder title="Income Statement" />
            }
          />

          <Route
            path="cash-flow"
            element={
              <ModulePlaceholder title="Cash Flow Statement" />
            }
          />

          <Route
            path="bank-accounts"
            element={
              <ModulePlaceholder title="Bank Accounts" />
            }
          />

          <Route
            path="invoices"
            element={<ModulePlaceholder title="Invoice" />}
          />

          <Route
            path="users"
            element={
              <ModulePlaceholder title="User Management" />
            }
          />

          <Route
            path="investors"
            element={<ModulePlaceholder title="Investors" />}
          />

          <Route
            path="ai-hub"
            element={
              <ModulePlaceholder title="AI Innovation Hub" />
            }
          />

          <Route
            path="chat-monitoring"
            element={
              <ModulePlaceholder title="Chat Monitoring" />
            }
          />

          <Route
            path="deleted-orders"
            element={
              <ModulePlaceholder title="Deleted Orders" />
            }
          />

          <Route
            path="*"
            element={<SuperAdminNotFound />}
          />
        </Route>

        <Route
          path="*"
          element={<Navigate to="/super-admin" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;