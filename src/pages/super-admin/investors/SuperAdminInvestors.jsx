import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

import {
  Banknote,
  ChevronDown,
  CircleDollarSign,
  Clock3,
  Edit3,
  Eye,
  FileText,
  LineChart,
  Plus,
  RefreshCcw,
  Search,
  Trash2,
  TrendingUp,
  Users,
  WalletCards,
  X,
} from "lucide-react";

import "../../../styles/super-admin-investors.css";

const INVESTORS_STORAGE_KEY =
  "shopdirect-super-admin-investors";

const TIMELINES_STORAGE_KEY =
  "shopdirect-super-admin-investor-timelines";

const LEDGER_STORAGE_KEY =
  "shopdirect-super-admin-investor-ledger";

const BANK_STORAGE_KEY =
  "shopdirect-super-admin-bank-accounts";

const emptyInvestorForm = {
  fullName: "",
  email: "",
  phone: "",
  password: "",
  capital: "",
  bankAccount: "",
  notes: "",
};

const emptyTimelineForm = {
  investorId: "",
  title: "",
  totalDays: "",
  productDescription: "",
};

const emptyLedgerForm = {
  investorId: "",
  type: "Payment Received",
  date: "",
  amount: "",
  bankAccount: "",
  referenceId: "",
  notes: "",
};

const defaultStages = [
  {
    id: 1,
    name: "Order Placed",
    estimatedDays: "",
    status: "Pending",
    note: "",
  },
  {
    id: 2,
    name: "In Processing",
    estimatedDays: "",
    status: "Pending",
    note: "",
  },
  {
    id: 3,
    name: "Quality Check",
    estimatedDays: "",
    status: "Pending",
    note: "",
  },
  {
    id: 4,
    name: "Shipped / In Transit",
    estimatedDays: "",
    status: "Pending",
    note: "",
  },
];

function readLocalStorage(key, fallback = []) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

function SuperAdminInvestors() {
  const [activeTab, setActiveTab] =
    useState("overview");

  const [investors, setInvestors] = useState(() =>
    readLocalStorage(INVESTORS_STORAGE_KEY)
  );

  const [timelines, setTimelines] = useState(() =>
    readLocalStorage(TIMELINES_STORAGE_KEY)
  );

  const [ledgerEntries, setLedgerEntries] =
    useState(() =>
      readLocalStorage(LEDGER_STORAGE_KEY)
    );

  const [bankAccounts] = useState(() =>
    readLocalStorage(BANK_STORAGE_KEY)
  );

  const [investorSearch, setInvestorSearch] =
    useState("");

  const [timelineSearch, setTimelineSearch] =
    useState("");

  const [ledgerSearch, setLedgerSearch] =
    useState("");

  const [
    showInvestorModal,
    setShowInvestorModal,
  ] = useState(false);

  const [
    showTimelineModal,
    setShowTimelineModal,
  ] = useState(false);

  const [
    showLedgerModal,
    setShowLedgerModal,
  ] = useState(false);

  const [
    selectedInvestor,
    setSelectedInvestor,
  ] = useState(null);

  const [investorForm, setInvestorForm] =
    useState(emptyInvestorForm);

  const [timelineForm, setTimelineForm] =
    useState(emptyTimelineForm);

  const [ledgerForm, setLedgerForm] =
    useState(emptyLedgerForm);

  const [timelineStages, setTimelineStages] =
    useState(defaultStages);

  const [formError, setFormError] =
    useState("");

  useEffect(() => {
    try {
      localStorage.setItem(
        INVESTORS_STORAGE_KEY,
        JSON.stringify(investors)
      );
    } catch {
      // ignore storage failures
    }
  }, [investors]);

  useEffect(() => {
    try {
      localStorage.setItem(
        TIMELINES_STORAGE_KEY,
        JSON.stringify(timelines)
      );
    } catch {
      // ignore storage failures
    }
  }, [timelines]);

  useEffect(() => {
    try {
      localStorage.setItem(
        LEDGER_STORAGE_KEY,
        JSON.stringify(ledgerEntries)
      );
    } catch {
      // ignore storage failures
    }
  }, [ledgerEntries]);

  useEffect(() => {
    const modalOpen =
      showInvestorModal ||
      showTimelineModal ||
      showLedgerModal ||
      Boolean(selectedInvestor);

    if (!modalOpen) {
      return undefined;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    function handleEscape(event) {
      if (event.key === "Escape") {
        closeAllModals();
      }
    }

    document.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [
    showInvestorModal,
    showTimelineModal,
    showLedgerModal,
    selectedInvestor,
  ]);

  const totalCapital = useMemo(
    () =>
      investors.reduce(
        (sum, investor) =>
          sum +
          Number(investor.capital || 0),
        0
      ),
    [investors]
  );

  const activeTimelines = useMemo(
    () =>
      timelines.filter(
        (timeline) =>
          String(
            timeline.status || ""
          ).toLowerCase() !== "completed"
      ).length,
    [timelines]
  );

  const totalPayouts = useMemo(
    () =>
      ledgerEntries
        .filter((entry) =>
          String(entry.type || "")
            .toLowerCase()
            .includes("payout")
        )
        .reduce(
          (sum, entry) =>
            sum +
            Number(entry.amount || 0),
          0
        ),
    [ledgerEntries]
  );

  const filteredInvestors = useMemo(() => {
    const query =
      investorSearch.trim().toLowerCase();

    return investors.filter((investor) => {
      if (!query) {
        return true;
      }

      return (
        String(investor.fullName || "")
          .toLowerCase()
          .includes(query) ||
        String(investor.email || "")
          .toLowerCase()
          .includes(query) ||
        String(investor.phone || "")
          .toLowerCase()
          .includes(query)
      );
    });
  }, [investors, investorSearch]);

  const filteredTimelines = useMemo(() => {
    const query =
      timelineSearch.trim().toLowerCase();

    return timelines.filter((timeline) => {
      if (!query) {
        return true;
      }

      return (
        String(timeline.title || "")
          .toLowerCase()
          .includes(query) ||
        String(timeline.investorName || "")
          .toLowerCase()
          .includes(query)
      );
    });
  }, [timelines, timelineSearch]);

  const filteredLedgerEntries = useMemo(() => {
    const query =
      ledgerSearch.trim().toLowerCase();

    return ledgerEntries.filter((entry) => {
      if (!query) {
        return true;
      }

      return (
        String(entry.investorName || "")
          .toLowerCase()
          .includes(query) ||
        String(entry.type || "")
          .toLowerCase()
          .includes(query) ||
        String(entry.referenceId || "")
          .toLowerCase()
          .includes(query)
      );
    });
  }, [ledgerEntries, ledgerSearch]);

  function closeAllModals() {
    setShowInvestorModal(false);
    setShowTimelineModal(false);
    setShowLedgerModal(false);

    setSelectedInvestor(null);

    setInvestorForm(emptyInvestorForm);
    setTimelineForm(emptyTimelineForm);
    setLedgerForm(emptyLedgerForm);

    setFormError("");
  }

  function getInvestorName(id) {
    const investor = investors.find(
      (item) =>
        String(item.id) === String(id)
    );

    return investor?.fullName || "Investor";
  }

  function getBankName(id) {
    const bank = bankAccounts.find(
      (item) =>
        String(item.id) === String(id)
    );

    if (!bank) {
      return "Bank Account";
    }

    return `${bank.bankName || "Bank"}${
      bank.accountNumber
        ? ` • ${bank.accountNumber}`
        : ""
    }`;
  }

  function formatCurrency(value) {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      minimumFractionDigits: 2,
    }).format(Number(value || 0));
  }

  function formatDate(value) {
    if (!value) {
      return "—";
    }

    return new Date(
      `${value}T00:00:00`
    ).toLocaleDateString("en-GB");
  }

  function openInvestorModal() {
    setInvestorForm(emptyInvestorForm);
    setFormError("");
    setShowInvestorModal(true);
  }

  function handleInvestorChange(event) {
    const { name, value } = event.target;

    setInvestorForm((current) => ({
      ...current,
      [name]: value,
    }));

    setFormError("");
  }

  function createInvestor(event) {
    event.preventDefault();

    if (
      !investorForm.fullName.trim() ||
      !investorForm.email.trim() ||
      !investorForm.phone.trim() ||
      !investorForm.password
    ) {
      setFormError(
        "Please complete all required investor fields."
      );

      return;
    }

    const duplicateEmail =
      investors.some(
        (investor) =>
          String(investor.email || "")
            .trim()
            .toLowerCase() ===
          investorForm.email
            .trim()
            .toLowerCase()
      );

    if (duplicateEmail) {
      setFormError(
        "An investor with this email already exists."
      );

      return;
    }

    const newInvestor = {
      id: Date.now(),

      ...investorForm,

      fullName:
        investorForm.fullName.trim(),

      email: investorForm.email
        .trim()
        .toLowerCase(),

      phone: investorForm.phone.trim(),

      capital: Number(
        investorForm.capital || 0
      ),

      earnings: 0,

      balance: Number(
        investorForm.capital || 0
      ),

      status: "Active",

      products: 0,

      createdAt: new Date()
        .toISOString()
        .split("T")[0],
    };

    setInvestors((current) => [
      newInvestor,
      ...current,
    ]);

    closeAllModals();
  }

  function openTimelineModal() {
    setTimelineForm(emptyTimelineForm);

    setTimelineStages(
      defaultStages.map((stage) => ({
        ...stage,
      }))
    );

    setFormError("");
    setShowTimelineModal(true);
  }

  function handleTimelineChange(event) {
    const { name, value } = event.target;

    setTimelineForm((current) => ({
      ...current,
      [name]: value,
    }));

    setFormError("");
  }

  function updateStage(
    stageId,
    field,
    value
  ) {
    setTimelineStages((current) =>
      current.map((stage) =>
        stage.id === stageId
          ? {
              ...stage,
              [field]: value,
            }
          : stage
      )
    );
  }

  function addStage() {
    setTimelineStages((current) => [
      ...current,
      {
        id: Date.now(),
        name: "",
        estimatedDays: "",
        status: "Pending",
        note: "",
      },
    ]);
  }

  function removeStage(stageId) {
    setTimelineStages((current) =>
      current.filter(
        (stage) =>
          stage.id !== stageId
      )
    );
  }

  function createTimeline(event) {
    event.preventDefault();

    if (
      !timelineForm.investorId ||
      !timelineForm.title.trim()
    ) {
      setFormError(
        "Select an investor and enter a timeline title."
      );

      return;
    }

    const validStages =
      timelineStages.filter((stage) =>
        String(stage.name || "").trim()
      );

    if (!validStages.length) {
      setFormError(
        "Add at least one timeline stage."
      );

      return;
    }

    const timeline = {
      id: Date.now(),

      ...timelineForm,

      title: timelineForm.title.trim(),

      investorName: getInvestorName(
        timelineForm.investorId
      ),

      totalDays: Number(
        timelineForm.totalDays || 0
      ),

      stages: validStages,

      status: "In Progress",

      createdAt: new Date()
        .toISOString()
        .split("T")[0],
    };

    setTimelines((current) => [
      timeline,
      ...current,
    ]);

    closeAllModals();
  }

  function openLedgerModal() {
    setLedgerForm({
      ...emptyLedgerForm,

      date: new Date()
        .toISOString()
        .split("T")[0],
    });

    setFormError("");
    setShowLedgerModal(true);
  }

  function handleLedgerChange(event) {
    const { name, value } = event.target;

    setLedgerForm((current) => ({
      ...current,

      [name]: value,

      ...(name === "bankAccount"
        ? {
            referenceId: value
              ? `TX-${String(
                  Date.now()
                ).slice(-6)}`
              : current.referenceId,
          }
        : {}),
    }));

    setFormError("");
  }

  function createLedgerEntry(event) {
    event.preventDefault();

    if (
      !ledgerForm.investorId ||
      !ledgerForm.type ||
      !ledgerForm.date ||
      !ledgerForm.amount
    ) {
      setFormError(
        "Please complete all required ledger fields."
      );

      return;
    }

    const entry = {
      id: Date.now(),

      ...ledgerForm,

      investorName: getInvestorName(
        ledgerForm.investorId
      ),

      bankName: ledgerForm.bankAccount
        ? getBankName(
            ledgerForm.bankAccount
          )
        : "—",

      amount: Number(
        ledgerForm.amount || 0
      ),

      status: "Completed",
    };

    setLedgerEntries((current) => [
      entry,
      ...current,
    ]);

    closeAllModals();
  }

  function deleteInvestor(investorId) {
    setInvestors((current) =>
      current.filter(
        (investor) =>
          investor.id !== investorId
      )
    );
  }

  return (
    <section className="super-admin-investors">
      {/* PAGE HEADER */}

      <div className="investors-page-header">
        <div className="investors-heading-group">
          <p className="investors-eyebrow">
            Super Admin
          </p>

          <h1>Investors</h1>

          <p className="investors-description">
            Manage investor accounts,
            portfolios, order progress and
            financial activity.
          </p>
        </div>

        <button
          type="button"
          className="investors-primary-button"
          onClick={openInvestorModal}
        >
          <Plus size={17} />
          Add Investor
        </button>
      </div>

      {/* TABS */}

      <div className="investors-tabs">
        <button
          type="button"
          className={
            activeTab === "overview"
              ? "active"
              : ""
          }
          onClick={() =>
            setActiveTab("overview")
          }
        >
          Overview
        </button>

        <button
          type="button"
          className={
            activeTab === "investors"
              ? "active"
              : ""
          }
          onClick={() =>
            setActiveTab("investors")
          }
        >
          Investors
        </button>

        <button
          type="button"
          className={
            activeTab === "timelines"
              ? "active"
              : ""
          }
          onClick={() =>
            setActiveTab("timelines")
          }
        >
          Order Timelines
        </button>

        <button
          type="button"
          className={
            activeTab === "ledger"
              ? "active"
              : ""
          }
          onClick={() =>
            setActiveTab("ledger")
          }
        >
          Ledger & Payouts
        </button>
      </div>

      {/* OVERVIEW */}

      {activeTab === "overview" && (
        <div className="investors-overview">
          <div className="investor-stat-grid">
            <StatCard
              icon={Users}
              label="Total Investors"
              value={investors.length}
            />

            <StatCard
              icon={WalletCards}
              label="Invested Capital"
              value={formatCurrency(
                totalCapital
              )}
            />

            <StatCard
              icon={TrendingUp}
              label="Active Orders"
              value={activeTimelines}
            />

            <StatCard
              icon={CircleDollarSign}
              label="Total Payouts"
              value={formatCurrency(
                totalPayouts
              )}
            />
          </div>

          <div className="investor-overview-card">
            <div className="investor-section-heading">
              <div>
                <p>
                  Portfolio Overview
                </p>

                <h2>
                  Investor Snapshot
                </h2>
              </div>

              <span>
                {investors.length}{" "}
                {investors.length === 1
                  ? "investor"
                  : "investors"}
              </span>
            </div>

            {investors.length === 0 ? (
              <EmptyState
                icon={Users}
                title="No investors yet"
                text="Add your first investor to start building the portfolio."
              />
            ) : (
              <div className="investor-overview-table">
                {investors
                  .slice(0, 5)
                  .map((investor) => (
                    <div
                      className="investor-overview-row"
                      key={investor.id}
                    >
                      <div>
                        <strong>
                          {investor.fullName}
                        </strong>

                        <span>
                          {investor.email}
                        </span>
                      </div>

                      <div>
                        <span>
                          Capital
                        </span>

                        <strong>
                          {formatCurrency(
                            investor.capital
                          )}
                        </strong>
                      </div>

                      <div>
                        <span>
                          Earnings
                        </span>

                        <strong>
                          {formatCurrency(
                            investor.earnings
                          )}
                        </strong>
                      </div>

                      <div>
                        <span>Status</span>

                        <strong className="investor-active-status">
                          {investor.status}
                        </strong>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* INVESTORS TAB */}

      {activeTab === "investors" && (
        <div className="investor-record-card">
          <div className="investor-record-toolbar">
            <div className="investor-search">
              <Search size={16} />

              <input
                id="investor-search"
                name="investorSearch"
                type="search"
                autoComplete="off"
                placeholder="Search investors..."
                value={investorSearch}
                onChange={(event) =>
                  setInvestorSearch(
                    event.target.value
                  )
                }
              />
            </div>

            <div className="investor-toolbar-actions">
              <button
                type="button"
                className="investor-refresh-button"
                title="Refresh"
              >
                <RefreshCcw size={16} />
              </button>

              <button
                type="button"
                className="investors-primary-button"
                onClick={
                  openInvestorModal
                }
              >
                <Plus size={16} />
                Add Investor
              </button>
            </div>
          </div>

          <div className="investor-section-heading">
            <div>
              <p>
                Investor Records
              </p>

              <h2>
                All Investors
              </h2>
            </div>

            <span>
              {filteredInvestors.length}{" "}
              {filteredInvestors.length ===
              1
                ? "investor"
                : "investors"}
            </span>
          </div>

          {filteredInvestors.length ===
          0 ? (
            <EmptyState
              icon={Users}
              title="No investors found"
              text="Add an investor or adjust your search."
            />
          ) : (
            <div className="investor-table-wrap">
              <table className="investor-table">
                <thead>
                  <tr>
                    <th>Investor</th>
                    <th>Capital</th>
                    <th>Earnings</th>
                    <th>Balance</th>
                    <th>Products</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredInvestors.map(
                    (investor) => (
                      <tr
                        key={investor.id}
                      >
                        <td>
                          <div className="investor-name-cell">
                            <div className="investor-avatar">
                              {getInitials(
                                investor.fullName
                              )}
                            </div>

                            <div>
                              <strong>
                                {
                                  investor.fullName
                                }
                              </strong>

                              <span>
                                {
                                  investor.email
                                }
                              </span>
                            </div>
                          </div>
                        </td>

                        <td>
                          {formatCurrency(
                            investor.capital
                          )}
                        </td>

                        <td>
                          {formatCurrency(
                            investor.earnings
                          )}
                        </td>

                        <td>
                          {formatCurrency(
                            investor.balance
                          )}
                        </td>

                        <td>
                          {investor.products ||
                            0}
                        </td>

                        <td>
                          <span className="investor-status">
                            {
                              investor.status
                            }
                          </span>
                        </td>

                        <td>
                          <div className="investor-row-actions">
                            <button
                              type="button"
                              className="investor-view-button"
                              onClick={() =>
                                setSelectedInvestor(
                                  investor
                                )
                              }
                            >
                              <Eye
                                size={15}
                              />
                            </button>

                            <button
                              type="button"
                              className="investor-edit-button"
                            >
                              <Edit3
                                size={15}
                              />
                            </button>

                            <button
                              type="button"
                              className="investor-delete-button"
                              onClick={() =>
                                deleteInvestor(
                                  investor.id
                                )
                              }
                            >
                              <Trash2
                                size={15}
                              />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TIMELINES TAB */}

      {activeTab === "timelines" && (
        <div className="investor-record-card">
          <div className="investor-record-toolbar">
            <div className="investor-search">
              <Search size={16} />

              <input
                id="timeline-search"
                name="timelineSearch"
                type="search"
                autoComplete="off"
                placeholder="Search timelines..."
                value={timelineSearch}
                onChange={(event) =>
                  setTimelineSearch(
                    event.target.value
                  )
                }
              />
            </div>

            <button
              type="button"
              className="investors-primary-button"
              onClick={
                openTimelineModal
              }
            >
              <Plus size={16} />
              New Timeline
            </button>
          </div>

          <div className="investor-section-heading">
            <div>
              <p>
                Order Progress
              </p>

              <h2>
                Order Timelines
              </h2>
            </div>

            <span>
              {filteredTimelines.length}{" "}
              {filteredTimelines.length ===
              1
                ? "timeline"
                : "timelines"}
            </span>
          </div>

          {filteredTimelines.length ===
          0 ? (
            <EmptyState
              icon={LineChart}
              title="No timelines yet"
              text="Create a timeline to track an investor order."
            />
          ) : (
            <div className="timeline-list">
              {filteredTimelines.map(
                (timeline) => {
                  const completedStages =
                    timeline.stages.filter(
                      (stage) =>
                        String(
                          stage.status
                        ).toLowerCase() ===
                        "completed"
                    ).length;

                  const progress =
                    timeline.stages.length
                      ? Math.round(
                          (completedStages /
                            timeline.stages
                              .length) *
                            100
                        )
                      : 0;

                  return (
                    <article
                      className="timeline-card"
                      key={timeline.id}
                    >
                      <div className="timeline-card-top">
                        <div>
                          <span>
                            {
                              timeline.investorName
                            }
                          </span>

                          <h3>
                            {
                              timeline.title
                            }
                          </h3>
                        </div>

                        <span className="timeline-status">
                          {
                            timeline.status
                          }
                        </span>
                      </div>

                      <p>
                        {timeline.productDescription ||
                          "No description."}
                      </p>

                      <div className="timeline-progress-row">
                        <div className="timeline-progress-track">
                          <span
                            style={{
                              width: `${progress}%`,
                            }}
                          />
                        </div>

                        <strong>
                          {progress}%
                        </strong>
                      </div>

                      <div className="timeline-stage-summary">
                        <span>
                          {completedStages} of{" "}
                          {
                            timeline.stages
                              .length
                          }{" "}
                          stages completed
                        </span>

                        <span>
                          <Clock3
                            size={13}
                          />

                          {timeline.totalDays ||
                            0}{" "}
                          est. days
                        </span>
                      </div>
                    </article>
                  );
                }
              )}
            </div>
          )}
        </div>
      )}

      {/* LEDGER TAB */}

      {activeTab === "ledger" && (
        <div className="investor-record-card">
          <div className="investor-record-toolbar">
            <div className="investor-search">
              <Search size={16} />

              <input
                id="ledger-search"
                name="ledgerSearch"
                type="search"
                autoComplete="off"
                placeholder="Search ledger entries..."
                value={ledgerSearch}
                onChange={(event) =>
                  setLedgerSearch(
                    event.target.value
                  )
                }
              />
            </div>

            <button
              type="button"
              className="investors-primary-button"
              onClick={
                openLedgerModal
              }
            >
              <Plus size={16} />
              Record Entry
            </button>
          </div>

          <div className="investor-section-heading">
            <div>
              <p>
                Financial Records
              </p>

              <h2>
                Ledger & Payouts
              </h2>
            </div>

            <span>
              {
                filteredLedgerEntries.length
              }{" "}
              {filteredLedgerEntries.length ===
              1
                ? "entry"
                : "entries"}
            </span>
          </div>

          {filteredLedgerEntries.length ===
          0 ? (
            <EmptyState
              icon={Banknote}
              title="No ledger entries yet"
              text="Record a payment, payout or adjustment."
            />
          ) : (
            <div className="investor-table-wrap">
              <table className="investor-table">
                <thead>
                  <tr>
                    <th>Investor</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Reference</th>
                    <th>Bank</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredLedgerEntries.map(
                    (entry) => (
                      <tr key={entry.id}>
                        <td>
                          <strong>
                            {
                              entry.investorName
                            }
                          </strong>
                        </td>

                        <td>
                          {entry.type}
                        </td>

                        <td>
                          <strong>
                            {formatCurrency(
                              entry.amount
                            )}
                          </strong>
                        </td>

                        <td>
                          {entry.referenceId ||
                            "—"}
                        </td>

                        <td>
                          {entry.bankName ||
                            "—"}
                        </td>

                        <td>
                          <span className="investor-status">
                            {
                              entry.status
                            }
                          </span>
                        </td>

                        <td>
                          {formatDate(
                            entry.date
                          )}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ADD INVESTOR MODAL */}

      {showInvestorModal &&
        createPortal(
          <InvestorModalOverlay
            onClose={closeAllModals}
          >
            <div className="investor-modal">
              <ModalHeader
                eyebrow="Investor Management"
                title="Add Investor"
                description="Create a new investor account and financial profile."
                icon={
                  <Users size={22} />
                }
                onClose={
                  closeAllModals
                }
              />

              <form
                className="investor-modal-form"
                onSubmit={
                  createInvestor
                }
              >
                <div className="investor-modal-scroll">
                  <div className="investor-form-section">
                    <SectionTitle>
                      Personal Information
                    </SectionTitle>

                    <div className="investor-form-grid">
                      <InvestorField label="Full Name">
                        <input
                          id="investor-full-name"
                          type="text"
                          name="fullName"
                          autoComplete="name"
                          value={
                            investorForm.fullName
                          }
                          onChange={
                            handleInvestorChange
                          }
                          placeholder="Enter full name"
                        />
                      </InvestorField>

                      <InvestorField label="Phone Number">
                        <input
                          id="investor-phone"
                          type="text"
                          name="phone"
                          autoComplete="tel"
                          value={
                            investorForm.phone
                          }
                          onChange={
                            handleInvestorChange
                          }
                          placeholder="Enter phone number"
                        />
                      </InvestorField>

                      <InvestorField label="Email">
                        <input
                          id="investor-email"
                          type="email"
                          name="email"
                          autoComplete="email"
                          value={
                            investorForm.email
                          }
                          onChange={
                            handleInvestorChange
                          }
                          placeholder="Enter email address"
                        />
                      </InvestorField>

                      <InvestorField label="Password">
                        <input
                          id="investor-password"
                          type="password"
                          name="password"
                          autoComplete="new-password"
                          value={
                            investorForm.password
                          }
                          onChange={
                            handleInvestorChange
                          }
                          placeholder="Enter password"
                        />
                      </InvestorField>
                    </div>
                  </div>

                  <div className="investor-form-section">
                    <SectionTitle>
                      Financial Information
                    </SectionTitle>

                    <div className="investor-form-grid">
                      <InvestorField label="Initial Capital">
                        <input
                          id="investor-capital"
                          type="number"
                          min="0"
                          step="0.01"
                          name="capital"
                          autoComplete="off"
                          value={
                            investorForm.capital
                          }
                          onChange={
                            handleInvestorChange
                          }
                          placeholder="0.00"
                        />
                      </InvestorField>

                      <InvestorField label="Bank Account">
                        <SelectWrapper>
                          <select
                            id="investor-bank-account"
                            name="bankAccount"
                            value={
                              investorForm.bankAccount
                            }
                            onChange={
                              handleInvestorChange
                            }
                          >
                            <option value="">
                              Select bank account
                            </option>

                            {bankAccounts.map(
                              (bank) => (
                                <option
                                  key={
                                    bank.id
                                  }
                                  value={
                                    bank.id
                                  }
                                >
                                  {getBankName(
                                    bank.id
                                  )}
                                </option>
                              )
                            )}
                          </select>
                        </SelectWrapper>
                      </InvestorField>
                    </div>
                  </div>

                  <div className="investor-form-section">
                    <SectionTitle>
                      Additional Information
                    </SectionTitle>

                    <InvestorField label="Notes">
                      <textarea
                        id="investor-notes"
                        name="notes"
                        autoComplete="off"
                        value={
                          investorForm.notes
                        }
                        onChange={
                          handleInvestorChange
                        }
                        placeholder="Add any notes about this investor..."
                      />
                    </InvestorField>
                  </div>

                  {formError && (
                    <p className="investor-form-error">
                      {formError}
                    </p>
                  )}
                </div>

                <ModalFooter
                  onCancel={
                    closeAllModals
                  }
                  submitText="Create Investor"
                  submitIcon={
                    <Plus size={15} />
                  }
                />
              </form>
            </div>
          </InvestorModalOverlay>,
          document.body
        )}

      {/* TIMELINE MODAL */}

      {showTimelineModal &&
        createPortal(
          <InvestorModalOverlay
            onClose={closeAllModals}
          >
            <div className="investor-modal investor-timeline-modal">
              <ModalHeader
                eyebrow="Progress Tracking"
                title="Create Order Timeline"
                description="Build and track investor order stages."
                icon={
                  <LineChart
                    size={22}
                  />
                }
                onClose={
                  closeAllModals
                }
              />

              <form
                className="investor-modal-form"
                onSubmit={
                  createTimeline
                }
              >
                <div className="investor-modal-scroll">
                  <div className="investor-form-section">
                    <SectionTitle>
                      Timeline Details
                    </SectionTitle>

                    <div className="investor-form-grid">
                      <InvestorField label="Investor">
                        <SelectWrapper>
                          <select
                            id="timeline-investor"
                            name="investorId"
                            value={
                              timelineForm.investorId
                            }
                            onChange={
                              handleTimelineChange
                            }
                          >
                            <option value="">
                              Select investor
                            </option>

                            {investors.map(
                              (
                                investor
                              ) => (
                                <option
                                  key={
                                    investor.id
                                  }
                                  value={
                                    investor.id
                                  }
                                >
                                  {
                                    investor.fullName
                                  }
                                </option>
                              )
                            )}
                          </select>
                        </SelectWrapper>
                      </InvestorField>

                      <InvestorField label="Timeline Title">
                        <input
                          id="timeline-title"
                          type="text"
                          name="title"
                          autoComplete="off"
                          value={
                            timelineForm.title
                          }
                          onChange={
                            handleTimelineChange
                          }
                          placeholder="Order timeline"
                        />
                      </InvestorField>

                      <InvestorField label="Total Estimated Days">
                        <input
                          id="timeline-total-days"
                          type="number"
                          min="0"
                          name="totalDays"
                          autoComplete="off"
                          value={
                            timelineForm.totalDays
                          }
                          onChange={
                            handleTimelineChange
                          }
                          placeholder="0"
                        />
                      </InvestorField>

                      <InvestorField label="Product Description">
                        <input
                          id="timeline-product-description"
                          type="text"
                          name="productDescription"
                          autoComplete="off"
                          value={
                            timelineForm.productDescription
                          }
                          onChange={
                            handleTimelineChange
                          }
                          placeholder="Product or order details"
                        />
                      </InvestorField>
                    </div>
                  </div>

                  <div className="investor-form-section">
                    <div className="timeline-editor-heading">
                      <SectionTitle>
                        Timeline Stages
                      </SectionTitle>

                      <button
                        type="button"
                        className="timeline-add-stage"
                        onClick={
                          addStage
                        }
                      >
                        <Plus
                          size={14}
                        />
                        Add Stage
                      </button>
                    </div>

                    <div className="timeline-stage-editor">
                      {timelineStages.map(
                        (
                          stage,
                          index
                        ) => (
                          <div
                            className="timeline-stage-row"
                            key={
                              stage.id
                            }
                          >
                            <span className="timeline-stage-number">
                              {index +
                                1}
                            </span>

                            <input
                              id={`timeline-stage-name-${stage.id}`}
                              name={`timelineStageName-${stage.id}`}
                              type="text"
                              autoComplete="off"
                              value={
                                stage.name
                              }
                              onChange={(
                                event
                              ) =>
                                updateStage(
                                  stage.id,
                                  "name",
                                  event
                                    .target
                                    .value
                                )
                              }
                              placeholder="Stage name"
                            />

                            <input
                              id={`timeline-stage-days-${stage.id}`}
                              name={`timelineStageDays-${stage.id}`}
                              type="number"
                              autoComplete="off"
                              value={
                                stage.estimatedDays
                              }
                              onChange={(
                                event
                              ) =>
                                updateStage(
                                  stage.id,
                                  "estimatedDays",
                                  event
                                    .target
                                    .value
                                )
                              }
                              placeholder="Days"
                            />

                            <SelectWrapper>
                              <select
                                id={`timeline-stage-status-${stage.id}`}
                                name={`timelineStageStatus-${stage.id}`}
                                value={
                                  stage.status
                                }
                                onChange={(
                                  event
                                ) =>
                                  updateStage(
                                    stage.id,
                                    "status",
                                    event
                                      .target
                                      .value
                                  )
                                }
                              >
                                <option>
                                  Pending
                                </option>

                                <option>
                                  In Progress
                                </option>

                                <option>
                                  Completed
                                </option>
                              </select>
                            </SelectWrapper>

                            <input
                              id={`timeline-stage-note-${stage.id}`}
                              name={`timelineStageNote-${stage.id}`}
                              type="text"
                              autoComplete="off"
                              value={
                                stage.note
                              }
                              onChange={(
                                event
                              ) =>
                                updateStage(
                                  stage.id,
                                  "note",
                                  event
                                    .target
                                    .value
                                )
                              }
                              placeholder="Note"
                            />

                            <button
                              type="button"
                              className="timeline-remove-stage"
                              onClick={() =>
                                removeStage(
                                  stage.id
                                )
                              }
                            >
                              <Trash2
                                size={
                                  14
                                }
                              />
                            </button>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  {formError && (
                    <p className="investor-form-error">
                      {formError}
                    </p>
                  )}
                </div>

                <ModalFooter
                  onCancel={
                    closeAllModals
                  }
                  submitText="Create Timeline"
                />
              </form>
            </div>
          </InvestorModalOverlay>,
          document.body
        )}

      {/* LEDGER MODAL */}

      {showLedgerModal &&
        createPortal(
          <InvestorModalOverlay
            onClose={closeAllModals}
          >
            <div className="investor-modal">
              <ModalHeader
                eyebrow="Financial Records"
                title="Record Ledger Entry"
                description="Add a payment, payout or financial adjustment."
                icon={
                  <FileText
                    size={22}
                  />
                }
                onClose={
                  closeAllModals
                }
              />

              <form
                className="investor-modal-form"
                onSubmit={
                  createLedgerEntry
                }
              >
                <div className="investor-modal-scroll">
                  <div className="investor-form-section">
                    <SectionTitle>
                      Transaction Details
                    </SectionTitle>

                    <div className="investor-form-grid">
                      <InvestorField label="Investor">
                        <SelectWrapper>
                          <select
                            id="ledger-investor"
                            name="investorId"
                            value={
                              ledgerForm.investorId
                            }
                            onChange={
                              handleLedgerChange
                            }
                          >
                            <option value="">
                              Select investor
                            </option>

                            {investors.map(
                              (
                                investor
                              ) => (
                                <option
                                  key={
                                    investor.id
                                  }
                                  value={
                                    investor.id
                                  }
                                >
                                  {
                                    investor.fullName
                                  }
                                </option>
                              )
                            )}
                          </select>
                        </SelectWrapper>
                      </InvestorField>

                      <InvestorField label="Transaction Type">
                        <SelectWrapper>
                          <select
                            id="ledger-type"
                            name="type"
                            value={
                              ledgerForm.type
                            }
                            onChange={
                              handleLedgerChange
                            }
                          >
                            <option>
                              Payment Received
                            </option>

                            <option>
                              Payout
                            </option>

                            <option>
                              Adjustment
                            </option>

                            <option>
                              Order Earning
                            </option>

                            <option>
                              Refund Deduction
                            </option>
                          </select>
                        </SelectWrapper>
                      </InvestorField>

                      <InvestorField label="Transaction Date">
                        <input
                          id="ledger-date"
                          type="date"
                          name="date"
                          autoComplete="off"
                          value={
                            ledgerForm.date
                          }
                          onChange={
                            handleLedgerChange
                          }
                        />
                      </InvestorField>

                      <InvestorField label="Amount">
                        <input
                          id="ledger-amount"
                          type="number"
                          min="0"
                          step="0.01"
                          name="amount"
                          autoComplete="off"
                          value={
                            ledgerForm.amount
                          }
                          onChange={
                            handleLedgerChange
                          }
                          placeholder="0.00"
                        />
                      </InvestorField>
                    </div>
                  </div>

                  <div className="investor-form-section">
                    <SectionTitle>
                      Payment Reference
                    </SectionTitle>

                    <div className="investor-form-grid">
                      <InvestorField label="Bank Account">
                        <SelectWrapper>
                          <select
                            id="ledger-bank-account"
                            name="bankAccount"
                            value={
                              ledgerForm.bankAccount
                            }
                            onChange={
                              handleLedgerChange
                            }
                          >
                            <option value="">
                              Select bank account
                            </option>

                            {bankAccounts.map(
                              (
                                bank
                              ) => (
                                <option
                                  key={
                                    bank.id
                                  }
                                  value={
                                    bank.id
                                  }
                                >
                                  {getBankName(
                                    bank.id
                                  )}
                                </option>
                              )
                            )}
                          </select>
                        </SelectWrapper>
                      </InvestorField>

                      <InvestorField label="Reference ID">
                        <input
                          id="ledger-reference-id"
                          type="text"
                          name="referenceId"
                          autoComplete="off"
                          value={
                            ledgerForm.referenceId
                          }
                          onChange={
                            handleLedgerChange
                          }
                          placeholder="Reference ID"
                        />
                      </InvestorField>
                    </div>
                  </div>

                  <div className="investor-form-section">
                    <SectionTitle>
                      Additional Information
                    </SectionTitle>

                    <InvestorField label="Notes">
                      <textarea
                        id="ledger-notes"
                        name="notes"
                        autoComplete="off"
                        value={
                          ledgerForm.notes
                        }
                        onChange={
                          handleLedgerChange
                        }
                        placeholder="Notes (optional)"
                      />
                    </InvestorField>
                  </div>

                  {formError && (
                    <p className="investor-form-error">
                      {formError}
                    </p>
                  )}
                </div>

                <ModalFooter
                  onCancel={
                    closeAllModals
                  }
                  submitText="Record Entry"
                />
              </form>
            </div>
          </InvestorModalOverlay>,
          document.body
        )}

      {/* VIEW INVESTOR MODAL */}

      {selectedInvestor &&
        createPortal(
          <InvestorModalOverlay
            onClose={closeAllModals}
          >
            <div className="investor-modal investor-profile-modal">
              <ModalHeader
                eyebrow="Investor Profile"
                title={
                  selectedInvestor.fullName
                }
                description={
                  selectedInvestor.email
                }
                icon={
                  <Users size={22} />
                }
                onClose={
                  closeAllModals
                }
              />

              <div className="investor-modal-scroll">
                <div className="investor-form-section">
                  <SectionTitle>
                    Investor Details
                  </SectionTitle>

                  <div className="investor-profile-grid">
                    <InvestorDetail
                      label="Phone"
                      value={
                        selectedInvestor.phone
                      }
                    />

                    <InvestorDetail
                      label="Capital"
                      value={formatCurrency(
                        selectedInvestor.capital
                      )}
                    />

                    <InvestorDetail
                      label="Earnings"
                      value={formatCurrency(
                        selectedInvestor.earnings
                      )}
                    />

                    <InvestorDetail
                      label="Balance"
                      value={formatCurrency(
                        selectedInvestor.balance
                      )}
                    />

                    <InvestorDetail
                      label="Products"
                      value={
                        selectedInvestor.products ||
                        0
                      }
                    />

                    <InvestorDetail
                      label="Status"
                      value={
                        selectedInvestor.status
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="investor-modal-footer">
                <button
                  type="button"
                  className="investor-cancel-button"
                  onClick={
                    closeAllModals
                  }
                >
                  Close
                </button>
              </div>
            </div>
          </InvestorModalOverlay>,
          document.body
        )}
    </section>
  );
}

function InvestorModalOverlay({
  children,
  onClose,
}) {
  return (
    <div
      className="investor-modal-overlay"
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <div
        className="investor-modal-positioner"
        onMouseDown={(event) =>
          event.stopPropagation()
        }
      >
        {children}
      </div>
    </div>
  );
}

function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function StatCard({
  icon: Icon,
  label,
  value,
}) {
  return (
    <article className="investor-stat-card">
      <div className="investor-stat-icon">
        <Icon size={19} />
      </div>

      <div>
        <strong>{value}</strong>
        <span>{label}</span>
      </div>
    </article>
  );
}

function EmptyState({
  icon: Icon,
  title,
  text,
}) {
  return (
    <div className="investor-empty-state">
      <div className="investor-empty-icon">
        <Icon size={21} />
      </div>

      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}

function InvestorField({
  label,
  children,
}) {
  return (
    <label className="investor-field">
      <span>{label}</span>

      {children}
    </label>
  );
}

function SelectWrapper({ children }) {
  return (
    <div className="investor-select-wrap">
      {children}

      <ChevronDown size={15} />
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <div className="investor-section-title">
      <span />

      {children}
    </div>
  );
}

function ModalHeader({
  eyebrow,
  title,
  description,
  icon,
  onClose,
}) {
  return (
    <div className="investor-modal-header">
      <div className="investor-modal-title-wrap">
        <div className="investor-modal-role-icon">
          {icon}
        </div>

        <div>
          <p>{eyebrow}</p>

          <h2>{title}</h2>

          <span>
            {description}
          </span>
        </div>
      </div>

      <button
        type="button"
        className="investor-modal-close"
        onClick={onClose}
        aria-label="Close modal"
      >
        <X size={19} />
      </button>
    </div>
  );
}

function ModalFooter({
  onCancel,
  submitText,
  submitIcon,
}) {
  return (
    <div className="investor-modal-footer">
      <button
        type="button"
        className="investor-cancel-button"
        onClick={onCancel}
      >
        Cancel
      </button>

      <button
        type="submit"
        className="investor-submit-button"
      >
        {submitIcon}

        {submitText}
      </button>
    </div>
  );
}

function InvestorDetail({
  label,
  value,
}) {
  return (
    <div className="investor-detail">
      <span>{label}</span>

      <strong>
        {value || "—"}
      </strong>
    </div>
  );
}

export default SuperAdminInvestors;