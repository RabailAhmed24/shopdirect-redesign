import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { jsPDF } from "jspdf";
import {
  CalendarDays,
  ChevronDown,
  Download,
  Eye,
  FileText,
  Plus,
  Search,
  X,
} from "lucide-react";

import "../../../styles/super-admin-invoices.css";

const INVOICE_STORAGE_KEY = "shopdirect-super-admin-invoices";
const USERS_STORAGE_KEY = "shopdirect-super-admin-users";
const BANK_STORAGE_KEY = "shopdirect-super-admin-bank-accounts";
const ITEMS_STORAGE_KEY = "shopdirect-super-admin-invoice-items";

const emptyForm = {
  startDate: "",
  endDate: "",
  admin: "",
  manager: "",
  bankAccount: "",
  notes: "",
};

function readLocalStorage(key, fallback = []) {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

function SuperAdminInvoices() {
  const [invoices, setInvoices] = useState(() =>
    readLocalStorage(INVOICE_STORAGE_KEY)
  );

  const [users] = useState(() =>
    readLocalStorage(USERS_STORAGE_KEY)
  );

  const [bankAccounts] = useState(() =>
    readLocalStorage(BANK_STORAGE_KEY)
  );

  const [invoiceItems] = useState(() =>
    readLocalStorage(ITEMS_STORAGE_KEY)
  );

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [showGenerator, setShowGenerator] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const [formData, setFormData] = useState(emptyForm);
  const [selectedItemIds, setSelectedItemIds] = useState([]);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    localStorage.setItem(
      INVOICE_STORAGE_KEY,
      JSON.stringify(invoices)
    );
  }, [invoices]);

  useEffect(() => {
    if (!showGenerator && !selectedInvoice) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [showGenerator, selectedInvoice]);

  const admins = useMemo(
    () =>
      users.filter(
        (user) =>
          String(user.role || "").toLowerCase() === "admin"
      ),
    [users]
  );

  const managers = useMemo(
    () =>
      users.filter(
        (user) =>
          String(user.role || "").toLowerCase() === "manager"
      ),
    [users]
  );

  const availableManagers = useMemo(() => {
    if (!formData.admin) return managers;

    const relatedManagers = managers.filter((manager) => {
      const managerAdmin =
        manager.adminId ||
        manager.admin ||
        manager.parentAdmin ||
        manager.adminName;

      if (!managerAdmin) return true;

      return String(managerAdmin) === String(formData.admin);
    });

    return relatedManagers;
  }, [formData.admin, managers]);

  const availableItems = useMemo(() => {
    return invoiceItems.filter((item) => {
      const date = item.date || item.createdAt || "";

      const withinStart =
        !formData.startDate || date >= formData.startDate;

      const withinEnd =
        !formData.endDate || date <= formData.endDate;

      const managerMatch =
        !formData.manager ||
        !item.manager ||
        String(item.manager) === String(formData.manager) ||
        String(item.managerId) === String(formData.manager);

      return withinStart && withinEnd && managerMatch;
    });
  }, [
    invoiceItems,
    formData.startDate,
    formData.endDate,
    formData.manager,
  ]);

  const selectedItems = useMemo(
    () =>
      availableItems.filter((item) =>
        selectedItemIds.includes(item.id)
      ),
    [availableItems, selectedItemIds]
  );

  const invoiceTotal = useMemo(
    () =>
      selectedItems.reduce(
        (total, item) => total + Number(item.amount || 0),
        0
      ),
    [selectedItems]
  );

  const filteredInvoices = useMemo(() => {
    const query = search.trim().toLowerCase();

    return invoices.filter((invoice) => {
      const matchesSearch =
        !query ||
        String(invoice.invoiceNumber || "")
          .toLowerCase()
          .includes(query) ||
        String(invoice.managerName || invoice.manager || "")
          .toLowerCase()
          .includes(query) ||
        String(invoice.adminName || invoice.admin || "")
          .toLowerCase()
          .includes(query);

      const normalizedStatus = normalizeStatus(invoice.status);

      const matchesStatus =
        statusFilter === "All" ||
        normalizedStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [invoices, search, statusFilter]);

  function normalizeStatus(status) {
    const value = String(status || "").toLowerCase();

    if (value.includes("paid") && value.includes("verif")) {
      return "Verifying";
    }

    if (value.includes("verif")) {
      return "Verifying";
    }

    if (value.includes("paid")) {
      return "Paid";
    }

    return "Pending";
  }

  function getUserLabel(user) {
    return (
      user.name ||
      user.fullName ||
      user.username ||
      user.email ||
      "User"
    );
  }

  function getBankLabel(bank) {
    return `${bank.bankName || "Bank"}${
      bank.accountNumber ? ` • ${bank.accountNumber}` : ""
    }`;
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
      ...(name === "admin" ? { manager: "" } : {}),
    }));

    if (name === "admin" || name === "manager") {
      setSelectedItemIds([]);
    }

    setFormError("");
  }

  function toggleItem(itemId) {
    setSelectedItemIds((current) =>
      current.includes(itemId)
        ? current.filter((id) => id !== itemId)
        : [...current, itemId]
    );

    setFormError("");
  }

  function openGenerator() {
    setFormData(emptyForm);
    setSelectedItemIds([]);
    setFormError("");
    setShowGenerator(true);
  }

  function closeGenerator() {
    setShowGenerator(false);
    setFormData(emptyForm);
    setSelectedItemIds([]);
    setFormError("");
  }

  function generateInvoice(event) {
    event.preventDefault();

    if (
      !formData.startDate ||
      !formData.endDate ||
      !formData.admin ||
      !formData.manager ||
      !formData.bankAccount
    ) {
      setFormError(
        "Select the date range, admin, manager and bank account."
      );
      return;
    }

    if (formData.endDate < formData.startDate) {
      setFormError("End date cannot be before start date.");
      return;
    }

    if (selectedItems.length === 0) {
      setFormError(
        "Select at least one invoice item before generating."
      );
      return;
    }

    const admin = admins.find(
      (item) => String(item.id) === String(formData.admin)
    );

    const manager = managers.find(
      (item) => String(item.id) === String(formData.manager)
    );

    const bank = bankAccounts.find(
      (item) =>
        String(item.id) === String(formData.bankAccount)
    );

    const timestamp = Date.now();

    const generatedInvoice = {
      id: timestamp,
      invoiceNumber: `INV-${new Date().getFullYear()}-${String(
        timestamp
      ).slice(-6)}`,

      startDate: formData.startDate,
      endDate: formData.endDate,

      admin: formData.admin,
      adminName: admin ? getUserLabel(admin) : "Admin",

      manager: formData.manager,
      managerName: manager
        ? getUserLabel(manager)
        : "Manager",

      bankAccount: formData.bankAccount,
      bankName: bank ? getBankLabel(bank) : "Bank Account",

      items: selectedItems,
      total: invoiceTotal,
      paid: 0,
      status: "Pending",

      notes: formData.notes.trim(),

      createdAt: new Date().toISOString().split("T")[0],
    };

    setInvoices((current) => [
      generatedInvoice,
      ...current,
    ]);

    closeGenerator();
  }

  function formatCurrency(value) {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      minimumFractionDigits: 2,
    }).format(Number(value || 0));
  }

  function formatDate(value) {
    if (!value) return "—";

    const date = new Date(`${value}T00:00:00`);

    return date.toLocaleDateString("en-GB");
  }

  function handleDownload(invoice) {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const purple = [76, 29, 149];
    const dark = [42, 35, 47];
    const muted = [124, 116, 131];
    const lightPurple = [247, 243, 251];
    const green = [25, 131, 78];

    function addFooter() {
      doc.setDrawColor(235, 230, 240);
      doc.line(18, pageHeight - 20, pageWidth - 18, pageHeight - 20);

      doc.setTextColor(...muted);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);

      doc.text("Generated by ShopDirect", 18, pageHeight - 12);
      doc.text(
        invoice.invoiceNumber || "",
        pageWidth - 18,
        pageHeight - 12,
        { align: "right" }
      );
    }

    function addItemsTableHeader(y) {
      doc.setFillColor(244, 240, 249);
      doc.rect(18, y, pageWidth - 36, 10, "F");

      doc.setTextColor(...purple);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);

      doc.text("ITEM", 22, y + 6.5);
      doc.text("DESCRIPTION", 58, y + 6.5);
      doc.text("DATE", 130, y + 6.5);
      doc.text("AMOUNT", pageWidth - 22, y + 6.5, {
        align: "right",
      });

      return y + 10;
    }

    doc.setFillColor(...purple);
    doc.rect(0, 0, pageWidth, 34, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("ShopDirect", 18, 16);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text("SUPER ADMIN INVOICE", 18, 23);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(
      invoice.invoiceNumber || "Invoice",
      pageWidth - 18,
      17,
      { align: "right" }
    );

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text(
      `Created: ${formatDate(invoice.createdAt)}`,
      pageWidth - 18,
      23,
      { align: "right" }
    );

    let y = 48;

    doc.setTextColor(...dark);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(17);
    doc.text("Invoice", 18, y);

    y += 9;

    doc.setFillColor(...lightPurple);
    doc.roundedRect(18, y, pageWidth - 36, 40, 3, 3, "F");

    doc.setFontSize(8);
    doc.setTextColor(...muted);
    doc.setFont("helvetica", "normal");

    doc.text("MANAGER", 24, y + 10);
    doc.text("ADMIN", 105, y + 10);

    doc.setTextColor(...dark);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);

    doc.text(
      String(invoice.managerName || invoice.manager || "—"),
      24,
      y + 17
    );

    doc.text(
      String(invoice.adminName || invoice.admin || "—"),
      105,
      y + 17
    );

    doc.setTextColor(...muted);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);

    doc.text("BILLING PERIOD", 24, y + 27);
    doc.text("BANK ACCOUNT", 105, y + 27);

    doc.setTextColor(...dark);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);

    doc.text(
      `${formatDate(invoice.startDate)} - ${formatDate(invoice.endDate)}`,
      24,
      y + 34
    );

    doc.text(
      String(invoice.bankName || invoice.bankAccount || "—"),
      105,
      y + 34
    );

    y += 53;

    doc.setTextColor(...dark);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Invoice Items", 18, y);

    y += 7;
    y = addItemsTableHeader(y);

    const items = invoice.items || [];

    if (items.length === 0) {
      doc.setTextColor(...muted);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text("No item details available.", 22, y + 10);
      y += 18;
    } else {
      items.forEach((item, index) => {
        if (y > 250) {
          addFooter();
          doc.addPage();
          y = 20;
          y = addItemsTableHeader(y);
        }

        if (index % 2 === 0) {
          doc.setFillColor(252, 251, 253);
          doc.rect(18, y, pageWidth - 36, 12, "F");
        }

        doc.setTextColor(...dark);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);

        doc.text(
          String(item.orderNumber || `#${item.id || index + 1}`),
          22,
          y + 7.5
        );

        doc.text(
          String(item.description || "Invoice item").slice(0, 34),
          58,
          y + 7.5
        );

        doc.text(
          formatDate(item.date || item.createdAt),
          130,
          y + 7.5
        );

        doc.setFont("helvetica", "bold");
        doc.text(
          formatCurrency(item.amount || 0),
          pageWidth - 22,
          y + 7.5,
          { align: "right" }
        );

        y += 12;
      });
    }

    if (y > 225) {
      addFooter();
      doc.addPage();
      y = 24;
    }

    y += 8;

    doc.setDrawColor(231, 224, 238);
    doc.line(18, y, pageWidth - 18, y);

    y += 12;

    doc.setTextColor(...muted);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text("Paid", pageWidth - 74, y);

    doc.setTextColor(...dark);
    doc.setFont("helvetica", "bold");
    doc.text(
      formatCurrency(invoice.paid || 0),
      pageWidth - 18,
      y,
      { align: "right" }
    );

    y += 10;

    doc.setTextColor(...purple);
    doc.setFontSize(12);
    doc.text("Invoice Total", pageWidth - 74, y);

    doc.setFontSize(15);
    doc.text(
      formatCurrency(invoice.total || 0),
      pageWidth - 18,
      y,
      { align: "right" }
    );

    y += 18;

    doc.setTextColor(...muted);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text("STATUS", 18, y);

    y += 6;

    const normalizedStatus = normalizeStatus(invoice.status);

    if (normalizedStatus === "Paid") {
      doc.setTextColor(...green);
    } else if (normalizedStatus === "Pending") {
      doc.setTextColor(164, 101, 0);
    } else {
      doc.setTextColor(...purple);
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text(String(invoice.status || "Pending"), 18, y);

    if (invoice.notes) {
      y += 16;

      if (y > 250) {
        addFooter();
        doc.addPage();
        y = 24;
      }

      doc.setTextColor(...muted);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.text("NOTES", 18, y);

      y += 6;

      doc.setTextColor(...dark);
      doc.setFontSize(9);

      const notes = doc.splitTextToSize(
        String(invoice.notes),
        pageWidth - 36
      );

      doc.text(notes, 18, y);
    }

    addFooter();

    doc.save(
      `${invoice.invoiceNumber || "shopdirect-invoice"}.pdf`
    );
  }

  return (
    <section className="super-admin-invoices">
      {/* HEADER */}
      <header className="invoice-page-header">
        <div className="invoice-heading-group">
          <p className="invoice-eyebrow">Super Admin</p>

          <h1>Invoice</h1>

          <p className="invoice-description">
            Create, manage and track invoices across ShopDirect.
          </p>
        </div>

        <button
          type="button"
          className="invoice-create-button"
          onClick={openGenerator}
        >
          <Plus size={17} />
          Generate Invoice
        </button>
      </header>

      {/* TOOLBAR */}
      <section className="invoice-toolbar">
        <div className="invoice-search">
          <Search size={16} />

          <input
            id="invoice-search"
            name="invoiceSearch"
            type="search"
            autoComplete="off"
            placeholder="Search invoices..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />
        </div>

        <div className="invoice-filter-tabs">
          {["All", "Paid", "Pending", "Verifying"].map(
            (status) => (
              <button
                key={status}
                type="button"
                className={
                  statusFilter === status ? "active" : ""
                }
                onClick={() => setStatusFilter(status)}
              >
                {status}
              </button>
            )
          )}
        </div>
      </section>

      {/* INVOICE TABLE */}
      <section className="invoice-table-card">
        <div className="invoice-table-header">
          <div>
            <p>Invoice Records</p>
            <h2>All Invoices</h2>
          </div>

          <span>
            {filteredInvoices.length}{" "}
            {filteredInvoices.length === 1
              ? "invoice"
              : "invoices"}
          </span>
        </div>

        {filteredInvoices.length === 0 ? (
          <div className="invoice-empty-state">
            <div className="invoice-empty-icon">
              <FileText size={20} />
            </div>

            <h3>No invoices found.</h3>

            <p>
              Generate an invoice or adjust the current filters.
            </p>
          </div>
        ) : (
          <div className="invoice-table-wrap">
            <table className="invoice-table">
              <colgroup>
                <col className="invoice-col-number" />
                <col className="invoice-col-manager" />
                <col className="invoice-col-period" />
                <col className="invoice-col-total" />
                <col className="invoice-col-paid" />
                <col className="invoice-col-status" />
                <col className="invoice-col-created" />
                <col className="invoice-col-actions" />
              </colgroup>

              <thead>
                <tr>
                  <th>Invoice</th>
                  <th>Manager</th>
                  <th>Period</th>
                  <th>Total</th>
                  <th>Paid</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.id}>
                    <td>
                      <strong className="invoice-number">
                        {invoice.invoiceNumber}
                      </strong>
                    </td>

                    <td>
                      <div className="invoice-manager-cell">
                        <strong>
                          {invoice.managerName ||
                            invoice.manager}
                        </strong>

                        <span>
                          {invoice.adminName ||
                            invoice.admin}
                        </span>
                      </div>
                    </td>

                    <td>
                      <div className="invoice-period-cell">
                        <span>
                          {formatDate(invoice.startDate)}
                        </span>
                        <span>
                          {formatDate(invoice.endDate)}
                        </span>
                      </div>
                    </td>

                    <td>
                      <strong>
                        {formatCurrency(invoice.total)}
                      </strong>
                    </td>

                    <td>
                      {formatCurrency(invoice.paid)}
                    </td>

                    <td>
                      <span
                        className={`invoice-status ${normalizeStatus(
                          invoice.status
                        ).toLowerCase()}`}
                      >
                        {invoice.status}
                      </span>
                    </td>

                    <td>
                      {formatDate(invoice.createdAt)}
                    </td>

                    <td>
                      <div className="invoice-actions">
                        <button
                          type="button"
                          className="invoice-view-button"
                          onClick={() =>
                            setSelectedInvoice(invoice)
                          }
                          title="View invoice"
                        >
                          <Eye size={15} />
                        </button>

                        <button
                          type="button"
                          className="invoice-download-button"
                          onClick={() =>
                            handleDownload(invoice)
                          }
                          title="Download invoice"
                        >
                          <Download size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* GENERATE INVOICE DRAWER */}
      {showGenerator &&
        createPortal(
        <div
          className="invoice-drawer-overlay"
          onMouseDown={(event) => {
            if (event.currentTarget === event.target) {
              closeGenerator();
            }
          }}
        >
          <aside
            className="invoice-generator-drawer"
            onMouseDown={(event) =>
              event.stopPropagation()
            }
          >
            <div className="invoice-generator-header">
              <div>
                <p>Invoice Management</p>
                <h2>Generate Invoice</h2>

                <span>
                  Create an invoice for the selected period.
                </span>
              </div>

              <button
                type="button"
                onClick={closeGenerator}
                aria-label="Close invoice generator"
              >
                <X size={19} />
              </button>
            </div>

            <form
              className="invoice-generator-form"
              onSubmit={generateInvoice}
            >
              <div className="invoice-generator-scroll">
                {/* DATE */}
                <div className="invoice-generator-grid">
                  <InvoiceField label="Start Date">
                    <div className="invoice-input-wrapper">
                      <CalendarDays size={15} />

                      <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                      />
                    </div>
                  </InvoiceField>

                  <InvoiceField label="End Date">
                    <div className="invoice-input-wrapper">
                      <CalendarDays size={15} />

                      <input
                        type="date"
                        name="endDate"
                        min={formData.startDate}
                        value={formData.endDate}
                        onChange={handleChange}
                      />
                    </div>
                  </InvoiceField>

                  {/* ADMIN */}
                  <InvoiceField label="Admin">
                    <SelectWrapper>
                      <select
                        name="admin"
                        value={formData.admin}
                        onChange={handleChange}
                      >
                        <option value="">
                          Select Admin
                        </option>

                        {admins.map((admin) => (
                          <option
                            key={admin.id}
                            value={admin.id}
                          >
                            {getUserLabel(admin)}
                          </option>
                        ))}
                      </select>
                    </SelectWrapper>
                  </InvoiceField>

                  {/* MANAGER */}
                  <InvoiceField label="Manager">
                    <SelectWrapper>
                      <select
                        name="manager"
                        value={formData.manager}
                        onChange={handleChange}
                        disabled={!formData.admin}
                      >
                        <option value="">
                          Select Manager
                        </option>

                        {availableManagers.map(
                          (manager) => (
                            <option
                              key={manager.id}
                              value={manager.id}
                            >
                              {getUserLabel(manager)}
                            </option>
                          )
                        )}
                      </select>
                    </SelectWrapper>
                  </InvoiceField>
                </div>

                {/* BANK */}
                <InvoiceField label="Bank Account">
                  <SelectWrapper>
                    <select
                      name="bankAccount"
                      value={formData.bankAccount}
                      onChange={handleChange}
                    >
                      <option value="">
                        Select Bank Account
                      </option>

                      {bankAccounts
                        .filter(
                          (bank) =>
                            !bank.status ||
                            bank.status === "Active"
                        )
                        .map((bank) => (
                          <option
                            key={bank.id}
                            value={bank.id}
                          >
                            {getBankLabel(bank)}
                          </option>
                        ))}
                    </select>
                  </SelectWrapper>
                </InvoiceField>

                {/* ITEMS */}
                <section className="invoice-items-section">
                  <div className="invoice-items-heading">
                    <div>
                      <h3>Invoice Items</h3>
                      <p>
                        Select items to include in this invoice.
                      </p>
                    </div>

                    <span>
                      {availableItems.length} items
                    </span>
                  </div>

                  {!formData.manager ? (
                    <div className="invoice-items-message">
                      Select an admin and manager to view
                      invoice items.
                    </div>
                  ) : availableItems.length === 0 ? (
                    <div className="invoice-items-message">
                      No invoice items are available for the
                      selected filters.
                    </div>
                  ) : (
                    <div className="invoice-items-list">
                      {availableItems.map((item) => {
                        const checked =
                          selectedItemIds.includes(item.id);

                        return (
                          <label
                            className={`invoice-item-row ${
                              checked ? "selected" : ""
                            }`}
                            key={item.id}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() =>
                                toggleItem(item.id)
                              }
                            />

                            <div className="invoice-item-info">
                              <strong>
                                {item.orderNumber ||
                                  `#${item.id}`}
                              </strong>

                              <span>
                                {item.description ||
                                  "Invoice item"}
                              </span>
                            </div>

                            <span className="invoice-item-date">
                              {formatDate(
                                item.date ||
                                  item.createdAt
                              )}
                            </span>

                            <strong className="invoice-item-amount">
                              {formatCurrency(item.amount)}
                            </strong>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </section>

                {/* SUMMARY */}
                <div className="invoice-generator-summary">
                  <div>
                    <span>Selected Items</span>
                    <strong>{selectedItems.length}</strong>
                  </div>

                  <div>
                    <span>Invoice Total</span>
                    <strong>
                      {formatCurrency(invoiceTotal)}
                    </strong>
                  </div>
                </div>

                {/* NOTES */}
                <label className="invoice-notes-field">
                  <span>Notes (Optional)</span>

                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Add any notes for this invoice..."
                  />
                </label>

                {formError && (
                  <p className="invoice-form-error">
                    {formError}
                  </p>
                )}
              </div>

              <div className="invoice-generator-footer">
                <button
                  type="button"
                  className="invoice-cancel-button"
                  onClick={closeGenerator}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="invoice-submit-button"
                >
                  <FileText size={15} />
                  Generate Invoice
                </button>
              </div>
            </form>
          </aside>
        </div>,
          document.body
        )}

      {/* VIEW INVOICE */}
      {selectedInvoice &&
        createPortal(
        <div
          className="invoice-modal-overlay"
          onMouseDown={(event) => {
            if (event.currentTarget === event.target) {
              setSelectedInvoice(null);
            }
          }}
        >
          <div
            className="invoice-view-modal"
            onMouseDown={(event) =>
              event.stopPropagation()
            }
          >
            <div className="invoice-view-header">
              <div>
                <p>Invoice Details</p>
                <h2>
                  {selectedInvoice.invoiceNumber}
                </h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedInvoice(null)
                }
              >
                <X size={19} />
              </button>
            </div>

            <div className="invoice-view-body">
              <InvoiceDetail
                label="Manager"
                value={
                  selectedInvoice.managerName ||
                  selectedInvoice.manager
                }
              />

              <InvoiceDetail
                label="Admin"
                value={
                  selectedInvoice.adminName ||
                  selectedInvoice.admin
                }
              />

              <InvoiceDetail
                label="Period"
                value={`${formatDate(
                  selectedInvoice.startDate
                )} — ${formatDate(
                  selectedInvoice.endDate
                )}`}
              />

              <InvoiceDetail
                label="Bank Account"
                value={
                  selectedInvoice.bankName ||
                  selectedInvoice.bankAccount
                }
              />

              <InvoiceDetail
                label="Total"
                value={formatCurrency(
                  selectedInvoice.total
                )}
              />

              <InvoiceDetail
                label="Status"
                value={selectedInvoice.status}
              />
            </div>

            <div className="invoice-view-actions">
              <button
                type="button"
                className="invoice-cancel-button"
                onClick={() =>
                  setSelectedInvoice(null)
                }
              >
                Close
              </button>

              <button
                type="button"
                className="invoice-submit-button"
                onClick={() =>
                  handleDownload(selectedInvoice)
                }
              >
                <Download size={15} />
                Download
              </button>
            </div>
          </div>
        </div>,
          document.body
        )}
    </section>
  );
}

function InvoiceField({ label, children }) {
  return (
    <label className="invoice-field">
      <span>{label}</span>
      {children}
    </label>
  );
}

function SelectWrapper({ children }) {
  return (
    <div className="invoice-select-wrapper">
      {children}
      <ChevronDown size={14} />
    </div>
  );
}

function InvoiceDetail({ label, value }) {
  return (
    <div className="invoice-detail">
      <span>{label}</span>
      <strong>{value || "—"}</strong>
    </div>
  );
}

export default SuperAdminInvoices;