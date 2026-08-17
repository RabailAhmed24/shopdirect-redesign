import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import SuperAdminSidebar from "../components/common/SuperAdminSidebar";
import SuperAdminTopbar from "../components/common/SuperAdminTopbar";

import "../styles/super-admin-layout.css";
import "../styles/super-admin-sidebar.css";

function SuperAdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(
    () => window.innerWidth > 768
  );

  const [isMobile, setIsMobile] = useState(
    () => window.innerWidth <= 768
  );

  useEffect(() => {
    function handleResize() {
      const mobile = window.innerWidth <= 768;

      setIsMobile(mobile);

      if (mobile) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  function handleSidebarToggle() {
    setIsSidebarOpen((prev) => !prev);
  }

  function handleBackdropClick() {
    setIsSidebarOpen(false);
  }

  return (
    <div
      className={`super-admin-layout ${
        isMobile
          ? isSidebarOpen
            ? "mobile-sidebar-open"
            : "mobile-sidebar-closed"
          : isSidebarOpen
            ? ""
            : "sidebar-collapsed"
      }`}
    >
      <SuperAdminSidebar
        isOpen={isSidebarOpen}
        onToggle={handleSidebarToggle}
      />

      {isMobile && isSidebarOpen && (
        <button
          type="button"
          className="sidebar-mobile-backdrop"
          onClick={handleBackdropClick}
          aria-label="Close sidebar"
        />
      )}

      <div className="super-admin-main">
        <SuperAdminTopbar
          onMenuClick={handleSidebarToggle}
          isMobile={isMobile}
        />

        <main className="super-admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default SuperAdminLayout;