import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  AlertTriangle,
  Building2,
  ChevronDown,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";

import "../../../styles/super-admin-bank-accounts.css";

const BANK_ACCOUNTS_STORAGE_KEY = "shopdirect-super-admin-bank-accounts";

const emptyForm = {
  bankName: "",
  beneficiary: "",
  accountNumber: "",
  sortCode: "",
  status: "Active",
};

function SuperAdminBankAccounts() {
  const [accounts, setAccounts] = useState(() => {
    try {
      const savedAccounts = localStorage.getItem(
        BANK_ACCOUNTS_STORAGE_KEY
      );

      return savedAccounts ? JSON.parse(savedAccounts) : [];
    } catch {
      return [];
    }
  });

  const [modalMode, setModalMode] = useState(null);
  const [selectedAccountId, setSelectedAccountId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [formError, setFormError] = useState("");

  const selectedAccount =
    accounts.find((account) => account.id === selectedAccountId) ||
    null;

  useEffect(() => {
    try {
      localStorage.setItem(
        BANK_ACCOUNTS_STORAGE_KEY,
        JSON.stringify(accounts)
      );
    } catch {
      // Keep the page usable if localStorage is unavailable.
    }
  }, [accounts]);

  useEffect(() => {
    if (!modalMode) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleEscape(event) {
      if (event.key === "Escape") {
        closeModal();
      }
    }

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleEscape);
    };
  }, [modalMode]);

  function openAddModal() {
    setFormData(emptyForm);
    setSelectedAccountId(null);
    setFormError("");
    setModalMode("add");
  }

  function openEditModal(account) {
    setSelectedAccountId(account.id);
    setFormData({
      bankName: account.bankName,
      beneficiary: account.beneficiary,
      accountNumber: account.accountNumber,
      sortCode: account.sortCode === "—" ? "" : account.sortCode,
      status: account.status,
    });
    setFormError("");
    setModalMode("edit");
  }

  function openDeleteModal(account) {
    setSelectedAccountId(account.id);
    setFormError("");
    setModalMode("delete");
  }

  function closeModal() {
    setModalMode(null);
    setSelectedAccountId(null);
    setFormData(emptyForm);
    setFormError("");
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setFormError("");
  }

  function normalizeSortCode(value) {
    const digits = value.replace(/\D/g, "").slice(0, 6);

    if (!digits) return "";

    return digits
      .match(/.{1,2}/g)
      ?.join("-") || "";
  }

  function handleSortCodeChange(event) {
    setFormData((current) => ({
      ...current,
      sortCode: normalizeSortCode(event.target.value),
    }));

    setFormError("");
  }

  function validateForm() {
    if (!formData.bankName.trim()) {
      return "Bank name is required.";
    }

    if (!formData.beneficiary.trim()) {
      return "Beneficiary name is required.";
    }

    const accountNumber = formData.accountNumber.replace(/\s/g, "");

    if (!/^\d{6,10}$/.test(accountNumber)) {
      return "Enter a valid account number using 6–10 digits.";
    }

    if (
      formData.sortCode &&
      !/^\d{2}-\d{2}-\d{2}$/.test(formData.sortCode)
    ) {
      return "Sort code must use the format XX-XX-XX.";
    }

    return "";
  }

  function handleSubmit(event) {
    event.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setFormError(validationError);
      return;
    }

    const cleanAccount = {
      bankName: formData.bankName.trim(),
      beneficiary: formData.beneficiary.trim(),
      accountNumber: formData.accountNumber.replace(/\s/g, ""),
      sortCode: formData.sortCode || "—",
      status: formData.status,
    };

    if (modalMode === "add") {
      const newAccount = {
        id: Date.now(),
        ...cleanAccount,
      };

      setAccounts((current) => [newAccount, ...current]);
    }

    if (modalMode === "edit" && selectedAccount) {
      setAccounts((current) =>
        current.map((account) =>
          account.id === selectedAccount.id
            ? {
                ...account,
                ...cleanAccount,
              }
            : account
        )
      );
    }

    closeModal();
  }

  function handleDelete() {
    if (!selectedAccount) {
      return;
    }

    setAccounts((current) =>
      current.filter(
        (account) => account.id !== selectedAccount.id
      )
    );

    closeModal();
  }

  return (
    <section className="super-admin-bank-accounts">
      <div className="bank-page-header">
        <div className="bank-heading-group">
          <p className="bank-eyebrow">Super Admin</p>

          <h1>Bank Accounts</h1>

          <p className="bank-description">
            Manage bank accounts used for payouts and invoice
            beneficiary details.
          </p>
        </div>

        <button
          type="button"
          className="bank-add-button"
          onClick={openAddModal}
        >
          <Plus size={17} />
          Add Bank Account
        </button>
      </div>

      <div className="bank-table-card">
        <div className="bank-table-header">
          <div>
            <p>Bank Records</p>
            <h2>All Bank Accounts</h2>
          </div>

          <span>
            {accounts.length}{" "}
            {accounts.length === 1 ? "account" : "accounts"}
          </span>
        </div>

        {accounts.length === 0 ? (
          <div className="bank-empty-state">
            <div className="bank-empty-icon">
              <Building2 size={20} />
            </div>

            <h3>No bank accounts added.</h3>

            <p>
              Add a bank account to store payout and beneficiary
              details locally.
            </p>

            <button
              type="button"
              className="bank-empty-add-button"
              onClick={openAddModal}
            >
              <Plus size={15} />
              Add Bank Account
            </button>
          </div>
        ) : (
          <div className="bank-table-scroll">
            <table className="bank-table">
              <colgroup>
                <col className="bank-col-name" />
                <col className="bank-col-beneficiary" />
                <col className="bank-col-account" />
                <col className="bank-col-sort" />
                <col className="bank-col-status" />
                <col className="bank-col-actions" />
              </colgroup>

              <thead>
                <tr>
                  <th>Bank Name</th>
                  <th>Beneficiary Name</th>
                  <th>Account Number</th>
                  <th>Sort Code</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {accounts.map((account) => (
                  <tr key={account.id}>
                    <td>
                      <div className="bank-name-cell">
                        <span className="bank-icon-box">
                          <Building2 size={15} />
                        </span>

                        <strong>{account.bankName}</strong>
                      </div>
                    </td>

                    <td>{account.beneficiary}</td>
                    <td>{account.accountNumber}</td>
                    <td>{account.sortCode}</td>

                    <td>
                      <span
                        className={`bank-status ${
                          account.status === "Active"
                            ? "active"
                            : "inactive"
                        }`}
                      >
                        {account.status}
                      </span>
                    </td>

                    <td>
                      <div className="bank-actions">
                        <button
                          type="button"
                          className="bank-edit-button"
                          onClick={() => openEditModal(account)}
                          aria-label={`Edit ${account.bankName}`}
                          title="Edit bank account"
                        >
                          <Pencil size={15} />
                        </button>

                        <button
                          type="button"
                          className="bank-delete-button"
                          onClick={() => openDeleteModal(account)}
                          aria-label={`Delete ${account.bankName}`}
                          title="Delete bank account"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {(modalMode === "add" || modalMode === "edit") &&
        createPortal(
        <div
          className="bank-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeModal();
            }
          }}
        >
          <div
            className="bank-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="bank-account-modal-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="bank-modal-header">
              <div className="bank-modal-title-wrap">
                <div className="bank-modal-header-icon">
                  <Building2 size={21} />
                </div>

                <div>
                  <p>
                    {modalMode === "add"
                      ? "New Bank Beneficiary"
                      : "Update Existing Account"}
                  </p>

                  <h2 id="bank-account-modal-title">
                    {modalMode === "add"
                      ? "Add Bank Account"
                      : "Edit Bank Account"}
                  </h2>

                  <span>
                    Store payout and invoice beneficiary details.
                  </span>
                </div>
              </div>

              <button
                type="button"
                className="bank-modal-close"
                onClick={closeModal}
                aria-label="Close modal"
              >
                <X size={19} />
              </button>
            </div>

            <form
              className="bank-modal-form"
              onSubmit={handleSubmit}
            >
              <div className="bank-modal-scroll">
                <div className="bank-form-section">
                  <div className="bank-section-title">
                    <span />
                    Bank Identity
                  </div>

                  <div className="bank-form-grid">
                    <label className="bank-field">
                      <span>Bank Name</span>

                      <input
                        type="text"
                        name="bankName"
                        value={formData.bankName}
                        onChange={handleChange}
                        placeholder="e.g. Barclays"
                        autoComplete="organization"
                      />
                    </label>

                    <label className="bank-field">
                      <span>Beneficiary Name</span>

                      <input
                        type="text"
                        name="beneficiary"
                        value={formData.beneficiary}
                        onChange={handleChange}
                        placeholder="e.g. Shop Direct Ltd"
                        autoComplete="organization"
                      />
                    </label>
                  </div>
                </div>

                <div className="bank-form-section">
                  <div className="bank-section-title">
                    <span />
                    Account Credentials
                  </div>

                  <div className="bank-form-grid">
                    <label className="bank-field">
                      <span>Account Number</span>

                      <input
                        type="text"
                        inputMode="numeric"
                        name="accountNumber"
                        value={formData.accountNumber}
                        onChange={handleChange}
                        placeholder="12345678"
                        autoComplete="off"
                      />
                    </label>

                    <label className="bank-field">
                      <span>Sort Code</span>

                      <input
                        type="text"
                        inputMode="numeric"
                        name="sortCode"
                        value={formData.sortCode}
                        onChange={handleSortCodeChange}
                        placeholder="12-34-56"
                        autoComplete="off"
                      />
                    </label>
                  </div>
                </div>

                <div className="bank-form-section">
                  <div className="bank-section-title">
                    <span />
                    Status
                  </div>

                  <label className="bank-field bank-status-field">
                    <span>Account Status</span>

                    <div className="bank-status-select">
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>

                      <ChevronDown size={15} />
                    </div>
                  </label>
                </div>

                {formError && (
                  <p className="bank-form-error">
                    {formError}
                  </p>
                )}
              </div>

              <div className="bank-modal-footer">
                <button
                  type="button"
                  className="bank-cancel-button"
                  onClick={closeModal}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="bank-primary-button"
                >
                  {modalMode === "add" ? (
                    <Plus size={16} />
                  ) : (
                    <Pencil size={15} />
                  )}

                  {modalMode === "add" ? "Create" : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>,
          document.body
        )}

      {modalMode === "delete" &&
        selectedAccount &&
        createPortal(
        <div
          className="bank-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeModal();
            }
          }}
        >
          <div
            className="bank-delete-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="bank-delete-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="bank-delete-header">
              <div className="bank-delete-title-wrap">
                <span className="bank-delete-icon">
                  <AlertTriangle size={20} />
                </span>

                <div>
                  <p>Confirmation</p>
                  <h2 id="bank-delete-title">
                    Delete Bank Account
                  </h2>
                </div>
              </div>

              <button
                type="button"
                onClick={closeModal}
                aria-label="Close delete confirmation"
              >
                <X size={18} />
              </button>
            </div>

            <div className="bank-delete-content">
              <p>
                Are you sure you want to delete the bank account
                for <strong>{selectedAccount.bankName}</strong>?
              </p>

              <span>This action cannot be undone.</span>
            </div>

            <div className="bank-delete-footer">
              <button
                type="button"
                className="bank-cancel-button"
                onClick={closeModal}
              >
                Cancel
              </button>

              <button
                type="button"
                className="bank-confirm-delete"
                onClick={handleDelete}
              >
                <Trash2 size={15} />
                Delete
              </button>
            </div>
          </div>
        </div>,
          document.body
        )}
    </section>
  );
}

export default SuperAdminBankAccounts;