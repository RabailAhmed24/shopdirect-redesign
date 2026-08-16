import { useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  Download,
} from "lucide-react";
import { jsPDF } from "jspdf";

import "../../../styles/super-admin-income-statement.css";

/* =====================================================
   ADMIN OPTIONS
   ===================================================== */

const adminOptions = [
  "All Admins",
  "Admin 1",
  "Admin 2",
];

/* =====================================================
   STATEMENT DATA
   Later this can come from the backend/API.
   Kept outside the component because these values
   are currently static.
   ===================================================== */

const statementData = {
  itemSales: 0,
  shipping: 0,
  overhead: 0,
  costOfGoods: 0,
};

function SuperAdminIncomeStatement() {
  const today = new Date().toISOString().split("T")[0];

  /* =====================================================
     FILTERS
     ===================================================== */

  const [filters, setFilters] = useState({
    startDate: today,
    endDate: today,
    admin: "All Admins",
  });

  /* =====================================================
     EDITABLE VALUES
     ===================================================== */

  const [editableValues, setEditableValues] = useState({
    otherIncome: 0,
    shippingCosts: 0,
    otherVariableExpenses: 0,
    rent: 0,
    wages: 0,
    otherFixedExpenses: 0,
  });

  /* =====================================================
     FILTER HANDLER
     ===================================================== */

  function handleFilterChange(event) {
    const { name, value } = event.target;

    setFilters((current) => ({
      ...current,
      [name]: value,
    }));
  }

  /* =====================================================
     VALUE HANDLER
     ===================================================== */

  function handleValueChange(event) {
    const { name, value } = event.target;

    setEditableValues((current) => ({
      ...current,
      [name]: Math.max(0, Number(value) || 0),
    }));
  }

  /* =====================================================
     CALCULATIONS
     ===================================================== */

  const calculations = useMemo(() => {
    const totalIncome =
      statementData.itemSales +
      statementData.shipping +
      statementData.overhead +
      editableValues.otherIncome;

    const totalVariableExpenses =
      statementData.costOfGoods +
      editableValues.shippingCosts +
      editableValues.otherVariableExpenses;

    const netIncome =
      totalIncome - totalVariableExpenses;

    const totalFixedExpenses =
      editableValues.rent +
      editableValues.wages +
      editableValues.otherFixedExpenses;

    const netProfit =
      netIncome - totalFixedExpenses;

    return {
      totalIncome,
      totalVariableExpenses,
      netIncome,
      totalFixedExpenses,
      netProfit,
    };
  }, [editableValues]);

  /* =====================================================
     CURRENCY FORMATTER
     ===================================================== */

  function formatCurrency(value) {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      minimumFractionDigits: 2,
    }).format(value);
  }

  /* =====================================================
     DATE FORMATTER
     ===================================================== */

  function formatDisplayDate(dateString) {
    if (!dateString) return "Not selected";

    const date = new Date(`${dateString}T00:00:00`);

    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  /* =====================================================
     DOWNLOAD PDF
     ===================================================== */

  function handleDownloadPDF() {
    const doc = new jsPDF();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(76, 29, 149);
    doc.text("ShopDirect Income Statement", 20, 24);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(105, 105, 105);

    doc.text(
      `${formatDisplayDate(
        filters.startDate
      )} - ${formatDisplayDate(filters.endDate)}`,
      20,
      33
    );

    doc.text(`Admin: ${filters.admin}`, 20, 40);

    doc.setDrawColor(225, 218, 235);
    doc.line(20, 47, 190, 47);

    let y = 59;

    function addSection(title) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(76, 29, 149);
      doc.text(title, 20, y);

      y += 9;
    }

    function addRow(label, value, bold = false) {
      doc.setFont(
        "helvetica",
        bold ? "bold" : "normal"
      );

      doc.setFontSize(10);
      doc.setTextColor(45, 45, 45);

      doc.text(label, 20, y);

      doc.text(
        formatCurrency(value),
        190,
        y,
        {
          align: "right",
        }
      );

      y += 8;
    }

    /* SALES */

    addSection("SALES");

    addRow(
      "Items Sales",
      statementData.itemSales
    );

    addRow(
      "Shipping",
      statementData.shipping
    );

    addRow(
      "Overhead",
      statementData.overhead
    );

    addRow(
      "Other Income",
      editableValues.otherIncome
    );

    addRow(
      "Total Income",
      calculations.totalIncome,
      true
    );

    y += 5;

    /* VARIABLE EXPENSES */

    addSection("VARIABLE EXPENSES");

    addRow(
      "Cost of Goods (Payable)",
      statementData.costOfGoods
    );

    addRow(
      "Shipping Costs",
      editableValues.shippingCosts
    );

    addRow(
      "Other Expenses",
      editableValues.otherVariableExpenses
    );

    addRow(
      "Total Variable Expenses",
      calculations.totalVariableExpenses,
      true
    );

    y += 5;

    /* NET INCOME */

    addRow(
      "NET INCOME",
      calculations.netIncome,
      true
    );

    y += 5;

    /* FIXED EXPENSES */

    addSection("FIXED EXPENSES");

    addRow(
      "Rent",
      editableValues.rent
    );

    addRow(
      "Wages",
      editableValues.wages
    );

    addRow(
      "Other Expenses",
      editableValues.otherFixedExpenses
    );

    addRow(
      "Total Fixed Expenses",
      calculations.totalFixedExpenses,
      true
    );

    y += 6;

    /* NET PROFIT */

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(20, 145, 88);

    doc.text("NET PROFIT", 20, y);

    doc.text(
      formatCurrency(calculations.netProfit),
      190,
      y,
      {
        align: "right",
      }
    );

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(145, 145, 145);

    doc.text(
      `Generated: ${new Date().toLocaleString()}`,
      20,
      280
    );

    doc.save(
      "shopdirect-income-statement.pdf"
    );
  }

  return (
    <section className="super-admin-income-statement">

      {/* =================================================
          PAGE HEADER
          ================================================= */}

      <div className="income-page-header">
        <div className="income-heading-group">

          <p className="income-eyebrow">
            Super Admin
          </p>

          <h1>Income Statement</h1>

          <p className="income-description">
            Review income, expenses and net profit
            for the selected period.
          </p>

        </div>

        <button
          type="button"
          className="income-download-button"
          onClick={handleDownloadPDF}
        >
          <Download
            size={16}
            strokeWidth={1.8}
          />

          Download PDF
        </button>
      </div>

      {/* =================================================
          FILTERS
          ================================================= */}

      <div className="income-filter-card">

        {/* START DATE */}

        <div className="income-filter">
          <label htmlFor="income-start-date">
            Start Date
          </label>

          <div className="income-date-wrapper">

            <CalendarDays
              size={16}
              strokeWidth={1.8}
            />

            <input
              id="income-start-date"
              type="date"
              name="startDate"
              value={filters.startDate}
              max={filters.endDate}
              onChange={handleFilterChange}
            />

          </div>
        </div>

        {/* END DATE */}

        <div className="income-filter">
          <label htmlFor="income-end-date">
            End Date
          </label>

          <div className="income-date-wrapper">

            <CalendarDays
              size={16}
              strokeWidth={1.8}
            />

            <input
              id="income-end-date"
              type="date"
              name="endDate"
              value={filters.endDate}
              min={filters.startDate}
              onChange={handleFilterChange}
            />

          </div>
        </div>

        {/* ADMIN */}

        <div className="income-filter income-admin-filter">

          <label htmlFor="income-admin">
            Admin
          </label>

          <div className="income-select-wrapper">

            <select
              id="income-admin"
              name="admin"
              value={filters.admin}
              onChange={handleFilterChange}
            >
              {adminOptions.map((admin) => (
                <option
                  key={admin}
                  value={admin}
                >
                  {admin}
                </option>
              ))}
            </select>

            <ChevronDown
              size={16}
              strokeWidth={1.8}
              className="income-select-icon"
            />

          </div>
        </div>
      </div>

      {/* =================================================
          INCOME STATEMENT
          ================================================= */}

      <div className="income-statement-card">

        {/* STATEMENT HEADER */}

        <div className="income-statement-heading">

          <p>Financial Statement</p>

          <h2>Income Statement</h2>

          <span>
            {formatDisplayDate(
              filters.startDate
            )}

            {" — "}

            {formatDisplayDate(
              filters.endDate
            )}
          </span>

          <small>
            {filters.admin}
          </small>

        </div>

        {/* =================================================
            SALES + VARIABLE EXPENSES
            ================================================= */}

        <div className="income-main-grid">

          {/* SALES */}

          <div className="income-section">

            <div className="income-section-title">
              <span className="income-section-dot" />
              Sales
            </div>

            <div className="income-row">
              <span>Items Sales</span>

              <strong>
                {formatCurrency(
                  statementData.itemSales
                )}
              </strong>
            </div>

            <div className="income-row">
              <span>Shipping</span>

              <strong>
                {formatCurrency(
                  statementData.shipping
                )}
              </strong>
            </div>

            <div className="income-row">
              <span>Overhead</span>

              <strong>
                {formatCurrency(
                  statementData.overhead
                )}
              </strong>
            </div>

            {/* OTHER INCOME */}

            <div className="income-row income-editable-row">

              <div>
                <span>Other Income</span>
                <small>
                  Manual adjustment
                </small>
              </div>

              <div className="income-money-input">

                <span>£</span>

                <input
                  type="number"
                  name="otherIncome"
                  min="0"
                  step="0.01"
                  value={
                    editableValues.otherIncome
                  }
                  onChange={handleValueChange}
                />

              </div>
            </div>

            {/* TOTAL INCOME */}

            <div className="income-total-row">

              <span>Total Income</span>

              <strong>
                {formatCurrency(
                  calculations.totalIncome
                )}
              </strong>

            </div>
          </div>

          {/* =================================================
              VARIABLE EXPENSES
              ================================================= */}

          <div className="income-section">

            <div className="income-section-title income-variable-title">

              <span className="income-section-dot" />

              Variable Expenses

            </div>

            <div className="income-row">

              <span>
                Cost of Goods (Payable)
              </span>

              <strong>
                {formatCurrency(
                  statementData.costOfGoods
                )}
              </strong>

            </div>

            {/* SHIPPING COST */}

            <div className="income-row income-editable-row">

              <div>
                <span>Shipping Costs</span>

                <small>
                  Manual adjustment
                </small>
              </div>

              <div className="income-money-input">

                <span>£</span>

                <input
                  type="number"
                  name="shippingCosts"
                  min="0"
                  step="0.01"
                  value={
                    editableValues.shippingCosts
                  }
                  onChange={handleValueChange}
                />

              </div>
            </div>

            {/* OTHER VARIABLE EXPENSE */}

            <div className="income-row income-editable-row">

              <div>
                <span>Other Expenses</span>

                <small>
                  Manual adjustment
                </small>
              </div>

              <div className="income-money-input">

                <span>£</span>

                <input
                  type="number"
                  name="otherVariableExpenses"
                  min="0"
                  step="0.01"
                  value={
                    editableValues.otherVariableExpenses
                  }
                  onChange={handleValueChange}
                />

              </div>
            </div>

            {/* TOTAL VARIABLE */}

            <div className="income-total-row">

              <span>
                Total Variable Expenses
              </span>

              <strong>
                {formatCurrency(
                  calculations.totalVariableExpenses
                )}
              </strong>

            </div>
          </div>
        </div>

        {/* =================================================
            NET INCOME
            ================================================= */}

        <div className="income-net-strip">

          <div>
            <span>Net Income</span>

            <small>
              Total income minus variable expenses
            </small>
          </div>

          <strong>
            {formatCurrency(
              calculations.netIncome
            )}
          </strong>

        </div>

        {/* =================================================
            FIXED EXPENSES
            ================================================= */}

        <div className="income-fixed-section">

          <div className="income-section-title income-fixed-title">

            <span className="income-section-dot" />

            Fixed Expenses

          </div>

          <div className="income-fixed-grid">

            {/* RENT */}

            <label className="income-fixed-field">

              <span>Rent</span>

              <div className="income-money-input">

                <span>£</span>

                <input
                  type="number"
                  name="rent"
                  min="0"
                  step="0.01"
                  value={
                    editableValues.rent
                  }
                  onChange={handleValueChange}
                />

              </div>
            </label>

            {/* WAGES */}

            <label className="income-fixed-field">

              <span>Wages</span>

              <div className="income-money-input">

                <span>£</span>

                <input
                  type="number"
                  name="wages"
                  min="0"
                  step="0.01"
                  value={
                    editableValues.wages
                  }
                  onChange={handleValueChange}
                />

              </div>
            </label>

            {/* OTHER FIXED EXPENSE */}

            <label className="income-fixed-field">

              <span>
                Other Expenses
              </span>

              <div className="income-money-input">

                <span>£</span>

                <input
                  type="number"
                  name="otherFixedExpenses"
                  min="0"
                  step="0.01"
                  value={
                    editableValues.otherFixedExpenses
                  }
                  onChange={handleValueChange}
                />

              </div>
            </label>

            {/* TOTAL FIXED EXPENSE */}

            <div className="income-fixed-total">

              <span>
                Total Fixed Expenses
              </span>

              <strong>
                {formatCurrency(
                  calculations.totalFixedExpenses
                )}
              </strong>

            </div>
          </div>
        </div>

        {/* =================================================
            NET PROFIT
            ================================================= */}

        <div className="income-profit-strip">

          <div>
            <span>Net Profit</span>

            <small>
              Net Income − Fixed Expenses
            </small>
          </div>

          <strong>
            {formatCurrency(
              calculations.netProfit
            )}
          </strong>

        </div>

      </div>
    </section>
  );
}

export default SuperAdminIncomeStatement;