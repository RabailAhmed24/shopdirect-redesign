import { NavLink } from "react-router-dom";

import {
  LayoutDashboard,
  BarChart3,
  WalletCards,
  HandCoins,
  Landmark,
  ReceiptText,
  Users,
  Handshake,
  Sparkles,
  MessagesSquare,
  Trash2,
  Menu,
  ChevronLeft,
} from "lucide-react";

const navigationItems = [
  {
    label: "Dashboard",
    path: "/super-admin",
    icon: LayoutDashboard,
    end: true,
  },
  {
    label: "Reports",
    path: "/super-admin/reports",
    icon: BarChart3,
  },
  {
    label: "Income Statement",
    path: "/super-admin/income-statement",
    icon: WalletCards,
  },
  {
    label: "Cash Flow Statement",
    path: "/super-admin/cash-flow",
    icon: HandCoins,
  },
  {
    label: "Bank Accounts",
    path: "/super-admin/bank-accounts",
    icon: Landmark,
  },
  {
    label: "Invoice",
    path: "/super-admin/invoices",
    icon: ReceiptText,
  },
  {
    label: "User Management",
    path: "/super-admin/users",
    icon: Users,
  },
  {
    label: "Investors",
    path: "/super-admin/investors",
    icon: Handshake,
  },
  {
    label: "AI Innovation Hub",
    path: "/super-admin/ai-hub",
    icon: Sparkles,
  },
  {
    label: "Chat Monitoring",
    path: "/super-admin/chat-monitoring",
    icon: MessagesSquare,
  },
  {
    label: "Deleted Orders",
    path: "/super-admin/deleted-orders",
    icon: Trash2,
  },
];

function SuperAdminSidebar({ isOpen, onToggle }) {
  return (
    <aside className="super-admin-sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-brand-main">
          <div className="brand-mark">S</div>

          <div className="brand-copy">
            <h2>ShopDirect</h2>
            <span>Super Admin</span>
          </div>
        </div>

        <button
          type="button"
          className="sidebar-close-button"
          onClick={onToggle}
          aria-label={
            isOpen ? "Collapse sidebar" : "Expand sidebar"
          }
          title={
            isOpen ? "Collapse sidebar" : "Expand sidebar"
          }
        >
          {isOpen ? (
            <ChevronLeft size={19} strokeWidth={1.9} />
          ) : (
            <Menu size={20} strokeWidth={1.9} />
          )}
        </button>
      </div>

      <nav className="sidebar-nav">
        {navigationItems.map(({ label, path, icon: Icon, end }) => (
          <NavLink
            key={path}
            to={path}
            end={end}
            title={!isOpen ? label : undefined}
            className={({ isActive }) =>
              `sidebar-link${isActive ? " active" : ""}`
            }
          >
            <Icon size={18} strokeWidth={1.8} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default SuperAdminSidebar;