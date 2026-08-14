import { Outlet } from "react-router-dom";
import SuperAdminSidebar from "../components/common/SuperAdminSidebar";
import SuperAdminTopbar from "../components/common/SuperAdminTopbar";
import "../styles/super-admin-layout.css";

function SuperAdminLayout() {
  return (
    <div className="super-admin-layout">
      <SuperAdminSidebar />

      <div className="super-admin-main">
        <SuperAdminTopbar />

        <main className="super-admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default SuperAdminLayout;