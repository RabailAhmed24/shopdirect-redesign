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

function SuperAdminSidebar() {
  return (
    <aside className="super-admin-sidebar">
      <div className="sidebar-brand">
        <div className="brand-mark">S</div>

        <div>
          <h2>ShopDirect</h2>
          <span>Super Admin</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navigationItems.map(({ label, path, icon: Icon, end }) => (
          <NavLink
            key={path}
            to={path}
            end={end}
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