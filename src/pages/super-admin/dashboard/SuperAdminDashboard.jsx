import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import "../../../styles/super-admin-dashboard.css";

import {
  CircleDollarSign,
  ShoppingCart,
  TrendingUp,
  Clock3,
  AlertTriangle,
  ArrowUpRight,
  ShieldCheck,
  BriefcaseBusiness,
  Store,
  FileWarning,
  Trash2,
  PauseCircle,
} from "lucide-react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const dashboardData = {
  "7d": {
    stats: [
      {
        label: "Total Sales",
        value: "£24,580",
        change: "+12.5%",
        icon: CircleDollarSign,
        tone: "purple",
        data: [
          { value: 18 },
          { value: 24 },
          { value: 21 },
          { value: 32 },
          { value: 29 },
          { value: 39 },
          { value: 35 },
        ],
      },
      {
        label: "Total Orders",
        value: "1,284",
        change: "+8.2%",
        icon: ShoppingCart,
        tone: "blue",
        data: [
          { value: 14 },
          { value: 19 },
          { value: 17 },
          { value: 26 },
          { value: 23 },
          { value: 30 },
          { value: 34 },
        ],
      },
      {
        label: "Estimated Profit",
        value: "£6,420",
        change: "+4.8%",
        icon: TrendingUp,
        tone: "green",
        data: [
          { value: 15 },
          { value: 18 },
          { value: 16 },
          { value: 23 },
          { value: 22 },
          { value: 28 },
          { value: 31 },
        ],
      },
      {
        label: "Current On Hold",
        value: "£7,890",
        change: "-2.1%",
        icon: Clock3,
        tone: "amber",
        data: [
          { value: 31 },
          { value: 29 },
          { value: 32 },
          { value: 27 },
          { value: 28 },
          { value: 24 },
          { value: 22 },
        ],
      },
    ],

    finance: {
      receivable: "£12,480",
      payable: "£4,220",
      received: "£18,760",
      onHold: "£7,890",
    },

    salesChart: [
      { label: "Mon", sales: 4200, cost: 2600, profit: 1600, orders: 154, onHold: 1180 },
      { label: "Tue", sales: 5100, cost: 3000, profit: 2100, orders: 181, onHold: 1120 },
      { label: "Wed", sales: 4700, cost: 2900, profit: 1800, orders: 169, onHold: 1240 },
      { label: "Thu", sales: 6200, cost: 3400, profit: 2800, orders: 203, onHold: 1080 },
      { label: "Fri", sales: 5800, cost: 3300, profit: 2500, orders: 190, onHold: 1040 },
      { label: "Sat", sales: 7200, cost: 3900, profit: 3300, orders: 214, onHold: 1110 },
      { label: "Sun", sales: 6800, cost: 3700, profit: 3100, orders: 173, onHold: 1120 },
    ],
  },

  "30d": {
    stats: [
      {
        label: "Total Sales",
        value: "£86,420",
        change: "+18.3%",
        icon: CircleDollarSign,
        tone: "purple",
        data: [
          { value: 22 },
          { value: 31 },
          { value: 28 },
          { value: 42 },
          { value: 39 },
          { value: 51 },
          { value: 48 },
        ],
      },
      {
        label: "Total Orders",
        value: "4,920",
        change: "+11.6%",
        icon: ShoppingCart,
        tone: "blue",
        data: [
          { value: 19 },
          { value: 25 },
          { value: 23 },
          { value: 34 },
          { value: 31 },
          { value: 40 },
          { value: 44 },
        ],
      },
      {
        label: "Estimated Profit",
        value: "£22,860",
        change: "+9.4%",
        icon: TrendingUp,
        tone: "green",
        data: [
          { value: 16 },
          { value: 21 },
          { value: 20 },
          { value: 29 },
          { value: 27 },
          { value: 36 },
          { value: 39 },
        ],
      },
      {
        label: "Current On Hold",
        value: "£10,240",
        change: "-5.7%",
        icon: Clock3,
        tone: "amber",
        data: [
          { value: 37 },
          { value: 35 },
          { value: 33 },
          { value: 30 },
          { value: 28 },
          { value: 25 },
          { value: 23 },
        ],
      },
    ],

    finance: {
      receivable: "£34,900",
      payable: "£12,780",
      received: "£71,520",
      onHold: "£10,240",
    },

    salesChart: [
      { label: "Week 1", sales: 17000, cost: 9800, profit: 7200, orders: 1080, onHold: 2900 },
      { label: "Week 2", sales: 20500, cost: 11200, profit: 9300, orders: 1190, onHold: 2740 },
      { label: "Week 3", sales: 22400, cost: 12600, profit: 9800, orders: 1265, onHold: 2500 },
      { label: "Week 4", sales: 26520, cost: 14500, profit: 12020, orders: 1385, onHold: 2100 },
    ],
  },

  "3m": {
    stats: [
      {
        label: "Total Sales",
        value: "£248,900",
        change: "+21.7%",
        icon: CircleDollarSign,
        tone: "purple",
        data: [
          { value: 28 },
          { value: 35 },
          { value: 33 },
          { value: 47 },
          { value: 44 },
          { value: 57 },
          { value: 61 },
        ],
      },
      {
        label: "Total Orders",
        value: "13,540",
        change: "+15.2%",
        icon: ShoppingCart,
        tone: "blue",
        data: [
          { value: 24 },
          { value: 31 },
          { value: 29 },
          { value: 38 },
          { value: 36 },
          { value: 45 },
          { value: 51 },
        ],
      },
      {
        label: "Estimated Profit",
        value: "£67,300",
        change: "+13.1%",
        icon: TrendingUp,
        tone: "green",
        data: [
          { value: 21 },
          { value: 27 },
          { value: 26 },
          { value: 34 },
          { value: 32 },
          { value: 41 },
          { value: 47 },
        ],
      },
      {
        label: "Current On Hold",
        value: "£15,880",
        change: "-8.4%",
        icon: Clock3,
        tone: "amber",
        data: [
          { value: 42 },
          { value: 39 },
          { value: 36 },
          { value: 34 },
          { value: 30 },
          { value: 27 },
          { value: 24 },
        ],
      },
    ],

    finance: {
      receivable: "£96,320",
      payable: "£31,410",
      received: "£214,870",
      onHold: "£15,880",
    },

    salesChart: [
      { label: "Jun", sales: 72400, cost: 42000, profit: 30400, orders: 4020, onHold: 5900 },
      { label: "Jul", sales: 81900, cost: 46200, profit: 35700, orders: 4470, onHold: 5310 },
      { label: "Aug", sales: 94600, cost: 53400, profit: 41200, orders: 5050, onHold: 4670 },
    ],
  },

  year: {
    stats: [
      {
        label: "Total Sales",
        value: "£782,400",
        change: "+26.4%",
        icon: CircleDollarSign,
        tone: "purple",
        data: [
          { value: 31 },
          { value: 38 },
          { value: 36 },
          { value: 49 },
          { value: 52 },
          { value: 61 },
          { value: 68 },
        ],
      },
      {
        label: "Total Orders",
        value: "41,860",
        change: "+19.8%",
        icon: ShoppingCart,
        tone: "blue",
        data: [
          { value: 27 },
          { value: 33 },
          { value: 31 },
          { value: 42 },
          { value: 45 },
          { value: 51 },
          { value: 58 },
        ],
      },
      {
        label: "Estimated Profit",
        value: "£214,600",
        change: "+17.5%",
        icon: TrendingUp,
        tone: "green",
        data: [
          { value: 22 },
          { value: 29 },
          { value: 28 },
          { value: 37 },
          { value: 40 },
          { value: 46 },
          { value: 53 },
        ],
      },
      {
        label: "Current On Hold",
        value: "£21,440",
        change: "-10.2%",
        icon: Clock3,
        tone: "amber",
        data: [
          { value: 48 },
          { value: 44 },
          { value: 41 },
          { value: 37 },
          { value: 33 },
          { value: 29 },
          { value: 25 },
        ],
      },
    ],

    finance: {
      receivable: "£302,580",
      payable: "£106,240",
      received: "£689,300",
      onHold: "£21,440",
    },

    salesChart: [
      { label: "Jan", sales: 51000, cost: 30000, profit: 21000, orders: 2850, onHold: 2650 },
      { label: "Feb", sales: 56800, cost: 32300, profit: 24500, orders: 3010, onHold: 2540 },
      { label: "Mar", sales: 60300, cost: 34100, profit: 26200, orders: 3220, onHold: 2480 },
      { label: "Apr", sales: 58500, cost: 32900, profit: 25600, orders: 3140, onHold: 2380 },
      { label: "May", sales: 64600, cost: 35800, profit: 28800, orders: 3370, onHold: 2260 },
      { label: "Jun", sales: 68100, cost: 37900, profit: 30200, orders: 3490, onHold: 2160 },
      { label: "Jul", sales: 72300, cost: 39200, profit: 33100, orders: 3610, onHold: 2050 },
      { label: "Aug", sales: 79600, cost: 42100, profit: 37500, orders: 3890, onHold: 1940 },
      { label: "Sep", sales: 75400, cost: 40900, profit: 34500, orders: 3740, onHold: 1850 },
      { label: "Oct", sales: 82100, cost: 43800, profit: 38300, orders: 4010, onHold: 1770 },
      { label: "Nov", sales: 88700, cost: 46700, profit: 42000, orders: 4260, onHold: 1690 },
      { label: "Dec", sales: 95200, cost: 49800, profit: 45400, orders: 4520, onHold: 1580 },
    ],
  },
};


const metricConfig = {
  sales: {
    label: "Total Sales",
    dataKey: "sales",
    color: "#6b3fa0",
    valuePrefix: "£",
  },
  orders: {
    label: "Total Orders",
    dataKey: "orders",
    color: "#2563eb",
    valuePrefix: "",
  },
  profit: {
    label: "Estimated Profit",
    dataKey: "profit",
    color: "#16a34a",
    valuePrefix: "£",
  },
  onHold: {
    label: "Current On Hold",
    dataKey: "onHold",
    color: "#d97706",
    valuePrefix: "£",
  },
};

const financeContext = {
  "7d": {
    receivable: { fill: 67, caption: "+6.4% vs last period" },
    received: { fill: 92, caption: "+11.2% vs last period" },
    payable: { fill: 38, caption: "-3.1% vs last period" },
    onHold: { fill: 52, caption: "-2.1% vs last period" },
  },
  "30d": {
    receivable: { fill: 74, caption: "+8.6% vs last period" },
    received: { fill: 88, caption: "+14.7% vs last period" },
    payable: { fill: 46, caption: "+1.9% vs last period" },
    onHold: { fill: 44, caption: "-5.7% vs last period" },
  },
  "3m": {
    receivable: { fill: 79, caption: "+12.1% vs prior quarter" },
    received: { fill: 94, caption: "+18.3% vs prior quarter" },
    payable: { fill: 41, caption: "-2.6% vs prior quarter" },
    onHold: { fill: 36, caption: "-8.4% vs prior quarter" },
  },
  year: {
    receivable: { fill: 82, caption: "+16.8% vs last year" },
    received: { fill: 96, caption: "+21.4% vs last year" },
    payable: { fill: 43, caption: "+4.2% vs last year" },
    onHold: { fill: 31, caption: "-10.2% vs last year" },
  },
};

const networkRoles = [
  { label: "Admins", value: 7, icon: ShieldCheck, tone: "purple" },
  { label: "Managers", value: 14, icon: BriefcaseBusiness, tone: "blue" },
  { label: "Sellers", value: 34, icon: Store, tone: "green" },
];

function SuperAdminDashboard() {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState("7d");
  const [activeMetric, setActiveMetric] = useState("sales");

  const currentData = useMemo(() => {
    return dashboardData[selectedPeriod];
  }, [selectedPeriod]);

  const currentMetric = metricConfig[activeMetric];
  const currentFinanceContext = financeContext[selectedPeriod];
  const networkTotal = networkRoles.reduce((total, role) => total + role.value, 0);

  return (
    <div className="dashboard-page">
      {/* WELCOME SECTION */}

      <section className="dashboard-header">
        <div className="dashboard-header-text">
          <h1 className="dashboard-title">
            Welcome back, <span>Super Admin</span>
          </h1>

          <p className="dashboard-updated">
            Last updated 2 minutes ago
          </p>
        </div>

        <select
          id="dashboard-period-filter"
          name="dashboardPeriodFilter"
          className="dashboard-period"
          value={selectedPeriod}
          onChange={(event) => setSelectedPeriod(event.target.value)}
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="3m">Last 3 months</option>
          <option value="year">This year</option>
        </select>
      </section>

      {/* KPI CARDS */}

      <section className="dashboard-stats-grid">
        {currentData.stats.map((stat, index) => {
          const Icon = stat.icon;
          const metricKeys = ["sales", "orders", "profit", "onHold"];
          const metricKey = metricKeys[index];
          const isActive = activeMetric === metricKey;
          const isRisk = metricKey === "onHold";

          return (
            <button
              type="button"
              key={stat.label}
              className={`dashboard-stat-card dashboard-stat-${stat.tone} ${
                isActive ? "dashboard-stat-active" : ""
              } ${isRisk ? "dashboard-stat-risk" : ""}`}
              onClick={() => setActiveMetric(metricKey)}
              aria-pressed={isActive}
            >
              <div className="dashboard-stat-top">
                <div className="dashboard-stat-icon">
                  <Icon size={19} />
                </div>

                <span className="dashboard-stat-change">
                  {stat.change}
                </span>
              </div>

              <p className="dashboard-stat-label">{stat.label}</p>

              <div className="dashboard-stat-value-row">
                <h2>{stat.value}</h2>
              </div>

              <div className="dashboard-stat-chart">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stat.data}>
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="currentColor"
                      strokeWidth={2}
                      fill="currentColor"
                      fillOpacity={0.08}
                      dot={false}
                      isAnimationActive
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </button>
          );
        })}
      </section>

      {/* SALES + NETWORK */}

      <section className="dashboard-main-grid">
        <article className="dashboard-card dashboard-sales-card">
          <div className="dashboard-card-header">
            <div>
              <h3>{currentMetric.label} Overview</h3>
              <p className="dashboard-chart-context">
                Click any KPI card above to switch this chart.
              </p>
            </div>

            <button
              type="button"
              className="dashboard-link-button"
              onClick={() => navigate("/super-admin/reports")}
            >
              View report
              <ArrowUpRight size={16} />
            </button>
          </div>

          <div className="dashboard-sales-chart">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={currentData.salesChart}
                margin={{
                  top: 24,
                  right: 18,
                  left: 0,
                  bottom: 0,
                }}
              >
                <defs>
                  <linearGradient
                    id="activeMetricGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor={currentMetric.color}
                      stopOpacity={0.22}
                    />
                    <stop
                      offset="95%"
                      stopColor={currentMetric.color}
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  stroke="#eef0f4"
                  strokeDasharray="4 4"
                  vertical={false}
                />

                <XAxis
                  dataKey="label"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "#8f96a3",
                    fontSize: 11,
                  }}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  width={56}
                  tick={{
                    fill: "#8f96a3",
                    fontSize: 11,
                  }}
                  tickFormatter={(value) => {
                    if (activeMetric === "orders") {
                      return value >= 1000
                        ? `${Math.round(value / 100) / 10}k`
                        : value;
                    }

                    if (value >= 1000) {
                      return `£${Math.round(value / 1000)}k`;
                    }

                    return `£${value}`;
                  }}
                />

                <Tooltip
                  cursor={{
                    stroke: "#c8c3d7",
                    strokeWidth: 1,
                    strokeDasharray: "4 4",
                  }}
                  offset={20}
                  allowEscapeViewBox={{ x: true, y: true }}
                  formatter={(value) => {
                    const formattedValue =
                      activeMetric === "orders"
                        ? Number(value).toLocaleString()
                        : `£${Number(value).toLocaleString()}`;

                    return [formattedValue, currentMetric.label];
                  }}
                  contentStyle={{
                    borderRadius: "10px",
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 10px 28px rgba(15, 23, 42, 0.12)",
                    fontSize: "12px",
                    padding: "10px 12px",
                  }}
                  wrapperStyle={{
                    pointerEvents: "none",
                    zIndex: 10,
                  }}
                  labelStyle={{
                    color: "#111827",
                    fontWeight: 600,
                    marginBottom: "4px",
                  }}
                />

                <Area
                  type="monotone"
                  dataKey={currentMetric.dataKey}
                  stroke={currentMetric.color}
                  strokeWidth={2.6}
                  fill="url(#activeMetricGradient)"
                  dot={false}
                  activeDot={{
                    r: 4,
                    fill: currentMetric.color,
                    stroke: "#ffffff",
                    strokeWidth: 2,
                  }}
                  isAnimationActive
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="dashboard-chart-legend dashboard-metric-switcher">
            {Object.entries(metricConfig).map(([key, metric]) => (
              <button
                type="button"
                key={key}
                className={activeMetric === key ? "is-active" : ""}
                onClick={() => setActiveMetric(key)}
              >
                <i
                  className="legend-dot"
                  style={{ background: metric.color }}
                />
                {metric.label.replace("Total ", "").replace("Estimated ", "")}
              </button>
            ))}
          </div>
        </article>

        <article className="dashboard-card dashboard-network-card">
          <div className="dashboard-card-header">
            <div>
              <h3>Network Overview</h3>
              <p className="dashboard-network-subtitle">
                {networkTotal} users across the platform
              </p>
            </div>

            <button
              type="button"
              className="dashboard-network-total"
              onClick={() => navigate("/super-admin/users")}
              aria-label="Open User Management"
            >
              {networkTotal}
            </button>
          </div>

          <div className="dashboard-network-bar" aria-label="User role distribution">
            {networkRoles.map((role) => (
              <span
                key={role.label}
                className={`dashboard-network-segment network-${role.tone}`}
                style={{ width: `${(role.value / networkTotal) * 100}%` }}
                title={`${role.label}: ${role.value}`}
              />
            ))}
          </div>

          <div className="dashboard-network-list">
            {networkRoles.map((role) => {
              const RoleIcon = role.icon;
              const percentage = Math.round((role.value / networkTotal) * 100);

              const roleParam = role.label.toLowerCase();

              return (
                <button
                  type="button"
                  className="dashboard-network-row"
                  key={role.label}
                  onClick={() =>
                    navigate(`/super-admin/users?role=${roleParam}`)
                  }
                >
                  <span
                    className={`dashboard-network-icon network-icon-${role.tone}`}
                  >
                    <RoleIcon size={16} />
                  </span>

                  <span className="dashboard-network-copy">
                    <strong>{role.label}</strong>
                    <small>{percentage}% of network</small>
                  </span>

                  <strong className="dashboard-network-value">
                    {role.value}
                  </strong>
                </button>
              );
            })}
          </div>
        </article>
      </section>

      {/* FINANCE + ATTENTION */}

      {/* FINANCE + ATTENTION */}

      <section className="dashboard-bottom-grid">
        <article className="dashboard-card dashboard-finance-card">
          <div className="dashboard-card-header dashboard-finance-header">
            <div>
              <h3>Financial Snapshot</h3>

              <p className="dashboard-finance-subtitle">
                Quick view of money movement for the selected period.
              </p>
            </div>
          </div>

          <div className="dashboard-finance-stats">
            {[
              ["receivable", "Receivable", currentData.finance.receivable],
              ["received", "Received", currentData.finance.received],
              ["payable", "Payable", currentData.finance.payable],
              ["onHold", "On Hold", currentData.finance.onHold],
            ].map(([key, label, value]) => {
              const context = currentFinanceContext[key];

              return (
                <div className="dashboard-finance-stat" key={key}>
                  <div className="dashboard-finance-stat-row">
                    <span>{label}</span>
                    <strong>{value}</strong>
                  </div>

                  <div className="dashboard-finance-track">
                    <span
                      className={`dashboard-finance-fill finance-${key}`}
                      style={{ width: `${context.fill}%` }}
                    />
                  </div>

                  <small className="dashboard-finance-caption">
                    {context.caption}
                  </small>
                </div>
              );
            })}
          </div>
        </article>

        <article className="dashboard-card dashboard-attention-card">
          <div className="dashboard-attention-glow" />

          <div className="dashboard-card-header dashboard-attention-header">
            <div>
              <p className="dashboard-card-eyebrow dashboard-attention-eyebrow">
                Action Required
              </p>

              <h3>Needs Attention</h3>

              <p className="dashboard-attention-subtitle">
                Priority items first, audit activity last.
              </p>
            </div>

            <div className="dashboard-attention-icon">
              <AlertTriangle size={20} />
            </div>
          </div>

          <div className="dashboard-attention-list">
            <button
              type="button"
              className="dashboard-attention-row attention-invoice"
              onClick={() => navigate("/super-admin/invoices")}
            >
              <span className="dashboard-attention-row-icon">
                <FileWarning size={17} />
              </span>

              <span className="dashboard-attention-copy">
                <strong>Pending invoices</strong>
                <small>Require review</small>
              </span>

              <span className="dashboard-attention-count attention-count-warning">
                4
              </span>
            </button>

            <button
              type="button"
              className="dashboard-attention-row attention-hold"
              onClick={() => navigate("/super-admin/cash-flow")}
            >
              <span className="dashboard-attention-row-icon">
                <PauseCircle size={17} />
              </span>

              <span className="dashboard-attention-copy">
                <strong>Payments on hold</strong>
                <small>Currently awaiting action</small>
              </span>

              <span className="dashboard-attention-count attention-count-danger">
                6
              </span>
            </button>

            <button
              type="button"
              className="dashboard-attention-row attention-deleted"
              onClick={() => navigate("/super-admin/deleted-orders")}
            >
              <span className="dashboard-attention-row-icon">
                <Trash2 size={17} />
              </span>

              <span className="dashboard-attention-copy">
                <strong>Deleted orders</strong>
                <small>Audit information only</small>
              </span>

              <span className="dashboard-attention-count attention-count-neutral">
                114
              </span>
            </button>
          </div>
        </article>
      </section>
    </div>
  );
}

export default SuperAdminDashboard;