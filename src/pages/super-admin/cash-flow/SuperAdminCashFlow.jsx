import { useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  Download,
  Info,
  RefreshCcw,
  Search,
  ShoppingBag,
  WalletCards,
} from "lucide-react";

import { jsPDF } from "jspdf";

import "../../../styles/super-admin-cash-flow.css";

const managers = ["All Managers", "Manager 1", "Manager 2"];
const sellers = ["All Sellers", "Seller 1", "Seller 2"];

function SuperAdminCashFlow() {
  const today = new Date().toISOString().split("T")[0];

  const [filters, setFilters] = useState({
    startDate: today,
    endDate: today,
    search: "",
    manager: "All Managers",
    seller: "All Sellers",
  });

  const [showHelp, setShowHelp] = useState(false);

  // Replace with API data later.
  const records = [];

  const totals = useMemo(
    () => ({
      orderProductSale: 0,
      currentOnHold: 7890,
    }),
    []
  );

  function handleFilterChange(event) {
    const { name, value } = event.target;

    setFilters((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handleReset() {
    setFilters({
      startDate: today,
      endDate: today,
      search: "",
      manager: "All Managers",
      seller: "All Sellers",
    });
  }

  function formatCurrency(value) {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      minimumFractionDigits: 2,
    }).format(value);
  }

  function handleDownloadPDF() {
    const doc = new jsPDF();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(76, 29, 149);
    doc.text("ShopDirect Cash Flow Statement", 20, 24);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);

    doc.text(
      `Period: ${filters.startDate} to ${filters.endDate}`,
      20,
      34
    );
    doc.text(`Manager: ${filters.manager}`, 20, 41);
    doc.text(`Seller: ${filters.seller}`, 20, 48);

    if (filters.search.trim()) {
      doc.text(`Search: ${filters.search.trim()}`, 20, 55);
    }

    doc.setDrawColor(225, 218, 235);
    doc.line(20, filters.search.trim() ? 62 : 55, 190, filters.search.trim() ? 62 : 55);

    const summaryStartY = filters.search.trim() ? 77 : 70;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(45, 45, 45);

    doc.text("Order Product Sale", 20, summaryStartY);
    doc.text(
      formatCurrency(totals.orderProductSale),
      190,
      summaryStartY,
      { align: "right" }
    );

    doc.text("Current On Hold", 20, summaryStartY + 12);
    doc.text(
      formatCurrency(totals.currentOnHold),
      190,
      summaryStartY + 12,
      { align: "right" }
    );

    const tableStartY = summaryStartY + 32;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(76, 29, 149);
    doc.text("Transaction Summary", 20, tableStartY);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);

    if (records.length === 0) {
      doc.text(
        "No cash flow data found for the selected filters.",
        20,
        tableStartY + 13
      );
    } else {
      let y = tableStartY + 13;

      records.forEach((record) => {
        doc.text(record.managerName || "-", 20, y);
        doc.text(
          formatCurrency(record.onHold || 0),
          112,
          y,
          { align: "right" }
        );
        doc.text(
          formatCurrency(record.received || 0),
          190,
          y,
          { align: "right" }
        );

        y += 9;
      });
    }

    doc.save("shopdirect-cash-flow-statement.pdf");
  }

  return (
    <section className="super-admin-cash-flow">
      {/* PAGE HEADER */}
      <header className="cash-flow-page-header">
        <div className="cash-flow-heading-group">
          <p className="cash-flow-eyebrow">Super Admin</p>

          <h1>Cash Flow Statement</h1>

          <p className="cash-flow-description">
            Track sales, held funds and received amounts across
            managers and sellers.
          </p>
        </div>

        <div className="cash-flow-header-actions">
          <div className="cash-flow-header-search">
            <Search size={16} strokeWidth={1.8} />

            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Search seller or manager"
              aria-label="Search seller or manager"
            />
          </div>

          <button
            type="button"
            className="cash-flow-download-button"
            onClick={handleDownloadPDF}
          >
            <Download size={16} strokeWidth={1.8} />
            Download PDF
          </button>
        </div>
      </header>

      {/* FILTERS */}
      <section className="cash-flow-filter-card">
        <div className="cash-flow-filter">
          <label htmlFor="cash-start-date">Start Date</label>

          <div className="cash-flow-input-wrapper">
            <CalendarDays size={16} />

            <input
              id="cash-start-date"
              type="date"
              name="startDate"
              value={filters.startDate}
              max={filters.endDate}
              onChange={handleFilterChange}
            />
          </div>
        </div>

        <div className="cash-flow-filter">
          <label htmlFor="cash-end-date">End Date</label>

          <div className="cash-flow-input-wrapper">
            <CalendarDays size={16} />

            <input
              id="cash-end-date"
              type="date"
              name="endDate"
              value={filters.endDate}
              min={filters.startDate}
              onChange={handleFilterChange}
            />
          </div>
        </div>

        <div className="cash-flow-filter">
          <label htmlFor="cash-manager">Manager</label>

          <div className="cash-flow-select-wrapper cash-flow-manager-select">
            <select
              id="cash-manager"
              name="manager"
              value={filters.manager}
              onChange={handleFilterChange}
            >
              {managers.map((manager) => (
                <option key={manager} value={manager}>
                  {manager}
                </option>
              ))}
            </select>

            <ChevronDown size={15} />
          </div>
        </div>

        <div className="cash-flow-filter">
          <label htmlFor="cash-seller">Seller</label>

          <div className="cash-flow-select-wrapper cash-flow-seller-select">
            <select
              id="cash-seller"
              name="seller"
              value={filters.seller}
              onChange={handleFilterChange}
            >
              {sellers.map((seller) => (
                <option key={seller} value={seller}>
                  {seller}
                </option>
              ))}
            </select>

            <ChevronDown size={15} />
          </div>
        </div>

        <button
          type="button"
          className="cash-flow-reset-button"
          onClick={handleReset}
          title="Reset filters"
          aria-label="Reset filters"
        >
          <RefreshCcw size={17} />
        </button>
      </section>

      {/* SUMMARY */}
      <section className="cash-flow-summary-grid">
        <article className="cash-flow-summary-card cash-flow-sales-card">
          <div className="cash-flow-summary-icon">
            <ShoppingBag size={21} strokeWidth={1.8} />
          </div>

          <div>
            <span>Order Product Sale</span>
            <strong>
              {formatCurrency(totals.orderProductSale)}
            </strong>
          </div>
        </article>

        <article className="cash-flow-summary-card cash-flow-hold-card">
          <div className="cash-flow-summary-icon">
            <WalletCards size={21} strokeWidth={1.8} />
          </div>

          <div>
            <span>Current On Hold</span>
            <strong>
              {formatCurrency(totals.currentOnHold)}
            </strong>
          </div>
        </article>
      </section>

      {/* TABLE */}
      <section className="cash-flow-table-card">
        <div className="cash-flow-table-header">
          <div>
            <p>Cash Flow Records</p>
            <h2>Transaction Summary</h2>
          </div>

          <span>
            {records.length}{" "}
            {records.length === 1 ? "record" : "records"}
          </span>
        </div>

        <div className="cash-flow-table-scroll">
          <table className="cash-flow-table">
            <thead>
              <tr>
                <th>Manager Name</th>
                <th>Total On Hold Amount</th>
                <th>Total Received Amount</th>
                <th>Edit Sellers</th>
              </tr>
            </thead>

            <tbody>
              {records.length > 0 ? (
                records.map((record) => (
                  <tr key={record.id}>
                    <td>{record.managerName}</td>

                    <td>
                      {formatCurrency(record.onHold)}
                    </td>

                    <td>
                      {formatCurrency(record.received)}
                    </td>

                    <td>
                      <button
                        type="button"
                        className="cash-flow-edit-button"
                      >
                        Edit Sellers
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">
                    <div className="cash-flow-empty-state">
                      <div className="cash-flow-empty-icon">
                        <WalletCards size={20} />
                      </div>

                      <h3>No cash flow records found</h3>

                      <p>
                        Records matching the selected filters
                        will appear here.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* HELP */}
      <section className="cash-flow-help">
        <button
          type="button"
          className="cash-flow-help-trigger"
          onClick={() => setShowHelp((current) => !current)}
          aria-expanded={showHelp}
        >
          <div>
            <span className="cash-flow-help-icon">
              <Info size={17} />
            </span>

            <div>
              <strong>How adjustments work</strong>
              <small>
                Learn how cash flow amounts are calculated.
              </small>
            </div>
          </div>

          <ChevronDown
            size={17}
            className={showHelp ? "is-open" : ""}
          />
        </button>

        {showHelp && (
          <div className="cash-flow-help-content">
            <div>
              <strong>Order Product Sale</strong>
              <p>
                Represents completed product sales recorded
                during the selected period.
              </p>
            </div>

            <div>
              <strong>Current On Hold</strong>
              <p>
                Represents funds currently being held before
                they are marked as received.
              </p>
            </div>

            <div>
              <strong>Received Amount</strong>
              <p>
                Represents funds that have been released and
                recorded as received.
              </p>
            </div>
          </div>
        )}
      </section>
    </section>
  );
}

export default SuperAdminCashFlow;