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

export const superAdminModules = [
  {
    name: "Dashboard",
    route: "/super-admin",
    icon: LayoutDashboard,
    keywords: ["home", "overview"],
    end: true,
  },
  {
    name: "Reports",
    route: "/super-admin/reports",
    icon: BarChart3,
    keywords: ["summary", "reports", "analytics"],
  },
  {
    name: "Income Statement",
    route: "/super-admin/income-statement",
    icon: WalletCards,
    keywords: ["income", "profit", "expenses", "statement"],
  },
  {
    name: "Cash Flow Statement",
    route: "/super-admin/cash-flow",
    icon: HandCoins,
    keywords: ["cash", "flow", "received", "on hold"],
  },
  {
    name: "Bank Accounts",
    route: "/super-admin/bank-accounts",
    icon: Landmark,
    keywords: ["bank", "accounts", "beneficiary"],
  },
  {
    name: "Invoice",
    route: "/super-admin/invoices",
    icon: ReceiptText,
    keywords: ["invoice", "billing", "payment"],
  },
  {
    name: "User Management",
    route: "/super-admin/users",
    icon: Users,
    keywords: ["user", "admin", "manager", "seller"],
  },
  {
    name: "Investors",
    route: "/super-admin/investors",
    icon: Handshake,
    keywords: ["investor", "ledger", "payout", "timeline"],
  },
  {
    name: "AI Innovation Hub",
    route: "/super-admin/ai-hub",
    icon: Sparkles,
    keywords: ["ai", "innovation", "forecasting", "pricing"],
  },
  {
    name: "Chat Monitoring",
    route: "/super-admin/chat-monitoring",
    icon: MessagesSquare,
    keywords: ["chat", "messages", "conversations"],
  },
  {
    name: "Deleted Orders",
    route: "/super-admin/deleted-orders",
    icon: Trash2,
    keywords: ["deleted", "orders", "audit"],
  },
];