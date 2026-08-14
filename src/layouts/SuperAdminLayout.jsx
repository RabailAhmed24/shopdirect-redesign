import { useState } from "react";
import { Outlet } from "react-router-dom";

import SuperAdminSidebar from "../components/common/SuperAdminSidebar";
import SuperAdminTopbar from "../components/common/SuperAdminTopbar";

import "../styles/super-admin-layout.css";
import "../styles/super-admin-sidebar.css";

function SuperAdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  function handleSidebarToggle() {
    setIsSidebarOpen((prev) => !prev);
  }

  return (
    <div
      className={`super-admin-layout${
        isSidebarOpen ? "" : " sidebar-collapsed"
      }`}
    >
      <SuperAdminSidebar
        isOpen={isSidebarOpen}
        onToggle={handleSidebarToggle}
      />

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