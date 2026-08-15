import { useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  X,
} from "lucide-react";
import { jsPDF } from "jspdf";

import "../../../styles/super-admin-reports.css";

const filterOptions = {
  period: ["7 days", "30 days", "90 days", "This year"],
  admin: ["All Admins", "Admin 1", "Admin 2"],
  manager: ["All Managers", "Manager 1", "Manager 2"],
  seller: ["All Sellers", "Seller 1", "Seller 2"],
};

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function SuperAdminReports() {
  const today = new Date();

  const [filters, setFilters] = useState({
    period: "7 days",
    admin: "All Admins",
    manager: "All Managers",
    seller: "All Sellers",
  });

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const [calendarMonth, setCalendarMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );

  const [temporaryDate, setTemporaryDate] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  function handleFilterChange(event) {
    const { name, value } = event.target;

    setFilters((currentFilters) => ({
      ...currentFilters,
      [name]: value,
    }));
  }

  function handleOpenCalendar() {
    const baseDate = selectedDate || today;

    setCalendarMonth(
      new Date(baseDate.getFullYear(), baseDate.getMonth(), 1)
    );

    setTemporaryDate(selectedDate || today);
    setIsCalendarOpen(true);
  }

  function handlePreviousMonth() {
    setCalendarMonth(
      (currentMonth) =>
        new Date(
          currentMonth.getFullYear(),
          currentMonth.getMonth() - 1,
          1
        )
    );
  }

  function handleNextMonth() {
    setCalendarMonth(
      (currentMonth) =>
        new Date(
          currentMonth.getFullYear(),
          currentMonth.getMonth() + 1,
          1
        )
    );
  }

  function handleSelectDay(date) {
    setTemporaryDate(date);
  }

  function handleApplyCalendarDate() {
    if (!temporaryDate) {
      return;
    }

    setSelectedDate(temporaryDate);
    setIsCalendarOpen(false);
  }

  function handleClearCalendarDate() {
    setTemporaryDate(null);
    setSelectedDate(null);
    setIsCalendarOpen(false);
  }

  function formatDate(date) {
    if (!date) {
      return "";
    }

    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  function isSameDate(firstDate, secondDate) {
    if (!firstDate || !secondDate) {
      return false;
    }

    return (
      firstDate.getFullYear() === secondDate.getFullYear() &&
      firstDate.getMonth() === secondDate.getMonth() &&
      firstDate.getDate() === secondDate.getDate()
    );
  }

  const calendarDays = useMemo(() => {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const firstWeekday =
      firstDayOfMonth.getDay() === 0
        ? 6
        : firstDayOfMonth.getDay() - 1;

    const totalDaysInMonth = lastDayOfMonth.getDate();

    const days = [];

    for (let index = 0; index < firstWeekday; index += 1) {
      days.push(null);
    }

    for (let day = 1; day <= totalDaysInMonth; day += 1) {
      days.push(new Date(year, month, day));
    }

    return days;
  }, [calendarMonth]);

  function getPeriodDays(period) {
    if (period === "7 days") {
      return 7;
    }

    if (period === "30 days") {
      return 30;
    }

    if (period === "90 days") {
      return 90;
    }

    return null;
  }

  function getCalculatedEndDate() {
    if (!selectedDate) {
      return null;
    }

    const periodDays = getPeriodDays(filters.period);

    if (!periodDays) {
      return null;
    }

    const endDate = new Date(selectedDate);
    endDate.setDate(endDate.getDate() + periodDays - 1);

    return endDate;
  }

  function handleExportReport() {
    const doc = new jsPDF();

    const generatedOn = new Date().toLocaleString();
    const calculatedEndDate = getCalculatedEndDate();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(76, 29, 149);
    doc.text("ShopDirect Reports", 20, 24);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(
      "Detailed performance and financial reporting across ShopDirect.",
      20,
      32
    );

    doc.setDrawColor(225, 218, 235);
    doc.line(20, 39, 190, 39);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(30, 30, 30);
    doc.text("Selected Filters", 20, 50);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);

    doc.text(`Period: ${filters.period}`, 20, 60);
    doc.text(`Admin: ${filters.admin}`, 20, 68);
    doc.text(`Manager: ${filters.manager}`, 20, 76);
    doc.text(`Seller: ${filters.seller}`, 20, 84);

    let summaryStartY = 100;

    if (selectedDate) {
      doc.text(
        `Start Date: ${formatDate(selectedDate)}`,
        20,
        92
      );

      if (calculatedEndDate) {
        doc.text(
          `Calculated End Date: ${formatDate(calculatedEndDate)}`,
          20,
          100
        );

        summaryStartY = 116;
      } else {
        summaryStartY = 108;
      }
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Summary", 20, summaryStartY);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(110, 110, 110);
    doc.text(
      "No records found for the selected filters.",
      20,
      summaryStartY + 12
    );

    doc.setFontSize(8);
    doc.setTextColor(145, 145, 145);
    doc.text(`Generated: ${generatedOn}`, 20, 280);

    doc.save("shopdirect-report.pdf");
  }

  const calculatedEndDate = getCalculatedEndDate();

  return (
    <section className="super-admin-reports">
      {/* =====================================================
          PAGE HEADER
          ===================================================== */}
      <div className="reports-page-header">
        <div className="reports-heading-group">
          <p className="reports-eyebrow">
            Super Admin
          </p>

          <h1>Reports</h1>

          <p className="reports-description">
            Detailed performance and financial reporting across ShopDirect.
          </p>
        </div>

        <div className="reports-header-actions">
          <button
            type="button"
            className={`reports-date-button ${
              selectedDate ? "active" : ""
            }`}
            onClick={handleOpenCalendar}
            aria-label="Select report date"
          >
            <CalendarDays
              size={18}
              strokeWidth={1.8}
            />
          </button>

          <button
            type="button"
            className="reports-export-button"
            onClick={handleExportReport}
          >
            <Download
              size={16}
              strokeWidth={1.8}
            />

            Export Report
          </button>
        </div>
      </div>

      {/* =====================================================
          SELECTED DATE SUMMARY
          ===================================================== */}
      {selectedDate && (
        <div className="reports-selected-date-summary">
          <CalendarDays
            size={15}
            strokeWidth={1.8}
          />

          <span>
            Start: {formatDate(selectedDate)}
          </span>

          {calculatedEndDate && (
            <span>
              End: {formatDate(calculatedEndDate)}
            </span>
          )}

          <button
            type="button"
            onClick={handleClearCalendarDate}
          >
            Clear
          </button>
        </div>
      )}

      {/* =====================================================
          FILTER BAR
          ===================================================== */}
      <div className="reports-filter-bar">
        <div className="reports-filter reports-filter-period">
          <label htmlFor="reports-period">
            Period
          </label>

          <div className="reports-select-wrapper">
            <select
              id="reports-period"
              name="period"
              value={filters.period}
              onChange={handleFilterChange}
            >
              {filterOptions.period.map((option) => (
                <option
                  key={option}
                  value={option}
                >
                  {option}
                </option>
              ))}
            </select>

            <ChevronDown
              className="reports-select-icon"
              size={16}
              strokeWidth={1.8}
            />
          </div>
        </div>

        <div className="reports-filter reports-filter-admin">
          <label htmlFor="reports-admin">
            Admin
          </label>

          <div className="reports-select-wrapper">
            <select
              id="reports-admin"
              name="admin"
              value={filters.admin}
              onChange={handleFilterChange}
            >
              {filterOptions.admin.map((option) => (
                <option
                  key={option}
                  value={option}
                >
                  {option}
                </option>
              ))}
            </select>

            <ChevronDown
              className="reports-select-icon"
              size={16}
              strokeWidth={1.8}
            />
          </div>
        </div>

        <div className="reports-filter reports-filter-manager">
          <label htmlFor="reports-manager">
            Manager
          </label>

          <div className="reports-select-wrapper">
            <select
              id="reports-manager"
              name="manager"
              value={filters.manager}
              onChange={handleFilterChange}
            >
              {filterOptions.manager.map((option) => (
                <option
                  key={option}
                  value={option}
                >
                  {option}
                </option>
              ))}
            </select>

            <ChevronDown
              className="reports-select-icon"
              size={16}
              strokeWidth={1.8}
            />
          </div>
        </div>

        <div className="reports-filter reports-filter-seller">
          <label htmlFor="reports-seller">
            Seller
          </label>

          <div className="reports-select-wrapper">
            <select
              id="reports-seller"
              name="seller"
              value={filters.seller}
              onChange={handleFilterChange}
            >
              {filterOptions.seller.map((option) => (
                <option
                  key={option}
                  value={option}
                >
                  {option}
                </option>
              ))}
            </select>

            <ChevronDown
              className="reports-select-icon"
              size={16}
              strokeWidth={1.8}
            />
          </div>
        </div>
      </div>

      {/* =====================================================
          REPORT RESULTS
          ===================================================== */}
      <div className="reports-results-card">
        <div className="reports-results-header">
          <div>
            <p className="reports-results-eyebrow">
              Report Results
            </p>

            <h2>Summary</h2>
          </div>

          <span className="reports-result-count">
            0 records
          </span>
        </div>

        <div className="reports-empty-state">
          <div className="reports-empty-icon">
            !
          </div>

          <h3>
            No records found.
          </h3>

          <p>
            No report data is available for the selected filters.
            Try changing the selected date, period, admin, manager, or seller.
          </p>
        </div>
      </div>

      {/* =====================================================
          CALENDAR MODAL
          ===================================================== */}
      {isCalendarOpen && (
        <div
          className="reports-calendar-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setIsCalendarOpen(false);
            }
          }}
        >
          <div className="reports-calendar-modal">
            <div className="reports-calendar-modal-header">
              <div>
                <p className="reports-calendar-eyebrow">
                  Report Date
                </p>

                <h2>Select a date</h2>

                <span>
                  Choose the date where your reporting period should begin.
                </span>
              </div>

              <button
                type="button"
                className="reports-calendar-close"
                onClick={() => setIsCalendarOpen(false)}
                aria-label="Close calendar"
              >
                <X
                  size={18}
                  strokeWidth={1.8}
                />
              </button>
            </div>

            <div className="reports-calendar-body">
              <div className="reports-calendar-month-header">
                <button
                  type="button"
                  onClick={handlePreviousMonth}
                  aria-label="Previous month"
                >
                  <ChevronLeft
                    size={18}
                    strokeWidth={1.8}
                  />
                </button>

                <h3>
                  {monthNames[calendarMonth.getMonth()]}{" "}
                  {calendarMonth.getFullYear()}
                </h3>

                <button
                  type="button"
                  onClick={handleNextMonth}
                  aria-label="Next month"
                >
                  <ChevronRight
                    size={18}
                    strokeWidth={1.8}
                  />
                </button>
              </div>

              <div className="reports-calendar-weekdays">
                {weekDays.map((day) => (
                  <span key={day}>
                    {day}
                  </span>
                ))}
              </div>

              <div className="reports-calendar-grid">
                {calendarDays.map((date, index) => {
                  if (!date) {
                    return (
                      <span
                        key={`empty-${index}`}
                        className="reports-calendar-empty-day"
                      />
                    );
                  }

                  const isSelected = isSameDate(
                    date,
                    temporaryDate
                  );

                  const isToday = isSameDate(
                    date,
                    today
                  );

                  return (
                    <button
                      key={date.toISOString()}
                      type="button"
                      className={[
                        "reports-calendar-day",
                        isSelected ? "selected" : "",
                        isToday ? "today" : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      onClick={() => handleSelectDay(date)}
                    >
                      {date.getDate()}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="reports-calendar-selection">
              <span>Selected date</span>

              <strong>
                {temporaryDate
                  ? formatDate(temporaryDate)
                  : "No date selected"}
              </strong>
            </div>

            <div className="reports-calendar-actions">
              <button
                type="button"
                className="reports-calendar-cancel"
                onClick={() => setIsCalendarOpen(false)}
              >
                Cancel
              </button>

              <button
                type="button"
                className="reports-calendar-apply"
                onClick={handleApplyCalendarDate}
                disabled={!temporaryDate}
              >
                Select Date
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default SuperAdminReports;