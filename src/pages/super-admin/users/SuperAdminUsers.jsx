import { Search, Plus, ChevronDown } from "lucide-react";
import { useState } from "react";

import "../../../styles/super-admin-users.css";

function SuperAdminUsers() {
  const [activeFilter, setActiveFilter] = useState("all");

  const filters = [
    { id: "all", label: "All Users" },
    { id: "admin", label: "Admins" },
    { id: "manager", label: "Managers" },
    { id: "seller", label: "Sellers" },
  ];

  return (
    <section className="super-admin-users">
      {/* PAGE HEADER */}
      <div className="users-page-header">
        <div>
          <p className="users-eyebrow">SUPER ADMIN</p>
          <h1>User Management</h1>
          <p className="users-description">
            Manage admins, managers and sellers across ShopDirect.
          </p>
        </div>

        <button className="users-add-button">
          <Plus size={17} />
          Add User
          <ChevronDown size={15} />
        </button>
      </div>

      {/* SEARCH + FILTERS */}
      <div className="users-toolbar">
        <div className="users-search">
          <Search size={17} />

          <input
            type="text"
            placeholder="Search users by name or email..."
          />
        </div>

        <div className="users-filters">
          {filters.map((filter) => (
            <button
              key={filter.id}
              className={`users-filter-button ${
                activeFilter === filter.id ? "active" : ""
              }`}
              onClick={() => setActiveFilter(filter.id)}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* USERS AREA */}
      <div className="users-table-card">
        <div className="users-table-header">
          <div>
            <p>USER RECORDS</p>
            <h2>All Users</h2>
          </div>

          <span>0 users</span>
        </div>

        <div className="users-empty-state">
          <div className="users-empty-icon">!</div>

          <h3>No users found.</h3>

          <p>
            User records will appear here once data is available.
          </p>
        </div>
      </div>
    </section>
  );
}

export default SuperAdminUsers;