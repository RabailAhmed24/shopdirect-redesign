import { useMemo, useState } from "react";

import {
  CalendarDays,
  ChevronDown,
  Eye,
  RefreshCcw,
  Search,
  Trash2,
} from "lucide-react";

import "../../../styles/super-admin-deleted-orders.css";

/* =========================================================
   STATIC OPTIONS
   ========================================================= */

const managers = [
  "All Managers",
  "Manager 1",
  "Manager 2",
];

// Replace with API data later.
const deletedOrders = [];

/* =========================================================
   COMPONENT
   ========================================================= */

function SuperAdminDeletedOrders() {
  const today = new Date().toISOString().split("T")[0];

  const [filters, setFilters] = useState({
    search: "",
    manager: "All Managers",
    startDate: "",
    endDate: "",
  });

  const [selectedOrder, setSelectedOrder] = useState(null);

  /* =======================================================
     FILTERED ORDERS
     ======================================================= */

  const filteredOrders = useMemo(() => {
    const query = filters.search.trim().toLowerCase();

    return deletedOrders.filter((order) => {
      const matchesSearch =
        !query ||
        order.orderId?.toLowerCase().includes(query) ||
        order.sellerName?.toLowerCase().includes(query) ||
        order.shopName?.toLowerCase().includes(query) ||
        order.customerName?.toLowerCase().includes(query) ||
        order.deletedBy?.toLowerCase().includes(query);

      const matchesManager =
        filters.manager === "All Managers" ||
        order.managerName === filters.manager;

      const orderDate = order.deletedAt
        ? order.deletedAt.split("T")[0]
        : "";

      const matchesStartDate =
        !filters.startDate ||
        orderDate >= filters.startDate;

      const matchesEndDate =
        !filters.endDate ||
        orderDate <= filters.endDate;

      return (
        matchesSearch &&
        matchesManager &&
        matchesStartDate &&
        matchesEndDate
      );
    });
  }, [filters]);

  /* =======================================================
     HANDLERS
     ======================================================= */

  function handleFilterChange(event) {
    const { name, value } = event.target;

    setFilters((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handleReset() {
    setFilters({
      search: "",
      manager: "All Managers",
      startDate: "",
      endDate: "",
    });
  }

  function handleRefresh() {
    setSelectedOrder(null);
  }

  /* =======================================================
     HELPERS
     ======================================================= */

  function formatCurrency(value) {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      minimumFractionDigits: 2,
    }).format(value || 0);
  }

  function formatDateTime(value) {
    if (!value) {
      return "-";
    }

    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));
  }

  function getRoleClass(role = "") {
    return `deleted-orders-role deleted-orders-role--${role.toLowerCase()}`;
  }

  /* =======================================================
     RENDER
     ======================================================= */

  return (
    <section className="super-admin-deleted-orders">
      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <header className="deleted-orders-page-header">
        <div className="deleted-orders-heading-group">
          <p className="deleted-orders-eyebrow">
            Super Admin
          </p>

          <h1>Deleted Orders</h1>

          <p className="deleted-orders-description">
            Review and audit deleted orders across ShopDirect.
          </p>
        </div>

        <button
          type="button"
          className="deleted-orders-refresh-button"
          onClick={handleRefresh}
        >
          <RefreshCcw
            size={16}
            strokeWidth={1.8}
          />

          Refresh
        </button>
      </header>

      {/* =====================================================
          FILTER CARD
      ===================================================== */}

      <section className="deleted-orders-filter-card">
        {/* Search */}

        <div className="deleted-orders-filter deleted-orders-search-filter">
          <label htmlFor="deleted-orders-search">
            Search
          </label>

          <div className="deleted-orders-search-wrapper">
            <Search
              size={16}
              strokeWidth={1.8}
            />

            <input
              id="deleted-orders-search"
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Search order, seller or customer"
            />
          </div>
        </div>

        {/* Manager */}

        <div className="deleted-orders-filter">
          <label htmlFor="deleted-orders-manager">
            Manager
          </label>

          <div className="deleted-orders-select-wrapper">
            <select
              id="deleted-orders-manager"
              name="manager"
              value={filters.manager}
              onChange={handleFilterChange}
            >
              {managers.map((manager) => (
                <option
                  key={manager}
                  value={manager}
                >
                  {manager}
                </option>
              ))}
            </select>

            <ChevronDown size={15} />
          </div>
        </div>

        {/* From Date */}

        <div className="deleted-orders-filter">
          <label htmlFor="deleted-orders-start-date">
            From Date
          </label>

          <div className="deleted-orders-date-wrapper">
            <CalendarDays size={16} />

            <input
              id="deleted-orders-start-date"
              type="date"
              name="startDate"
              value={filters.startDate}
              max={filters.endDate || today}
              onChange={handleFilterChange}
            />
          </div>
        </div>

        {/* To Date */}

        <div className="deleted-orders-filter">
          <label htmlFor="deleted-orders-end-date">
            To Date
          </label>

          <div className="deleted-orders-date-wrapper">
            <CalendarDays size={16} />

            <input
              id="deleted-orders-end-date"
              type="date"
              name="endDate"
              value={filters.endDate}
              min={filters.startDate || undefined}
              max={today}
              onChange={handleFilterChange}
            />
          </div>
        </div>

        {/* Reset */}

        <button
          type="button"
          className="deleted-orders-reset-button"
          onClick={handleReset}
          aria-label="Reset filters"
          title="Reset filters"
        >
          <RefreshCcw size={17} />
        </button>
      </section>

      {/* =====================================================
          TABLE CARD
      ===================================================== */}

      <section className="deleted-orders-table-card">
        <div className="deleted-orders-table-header">
          <div>
            <p>Audit Records</p>

            <h2>Deleted Orders</h2>
          </div>

          <span>
            {filteredOrders.length}{" "}
            {filteredOrders.length === 1
              ? "record"
              : "records"}
          </span>
        </div>

        <div className="deleted-orders-table-scroll">
          <table className="deleted-orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Seller / Shop</th>
                <th>Manager</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Deleted At</th>
                <th>Deleted By</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id}>
                    {/* Order ID */}

                    <td>
                      <span className="deleted-orders-id-badge">
                        #{order.orderId}
                      </span>
                    </td>

                    {/* Seller / Shop */}

                    <td>
                      <div className="deleted-orders-seller-cell">
                        <div className="deleted-orders-shop-icon">
                          {order.shopName
                            ?.charAt(0)
                            .toUpperCase() || "S"}
                        </div>

                        <div>
                          <strong>
                            {order.shopName || "-"}
                          </strong>

                          <span>
                            {order.sellerName || "-"}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Manager */}

                    <td>
                      <span className="deleted-orders-manager-badge">
                        {order.managerName || "-"}
                      </span>
                    </td>

                    {/* Customer */}

                    <td>
                      <div className="deleted-orders-customer-cell">
                        <strong>
                          {order.customerName || "-"}
                        </strong>

                        <span>
                          {order.customerPhone || ""}
                        </span>
                      </div>
                    </td>

                    {/* Total */}

                    <td>
                      <strong className="deleted-orders-total">
                        {formatCurrency(order.total)}
                      </strong>
                    </td>

                    {/* Deleted At */}

                    <td>
                      <span className="deleted-orders-date">
                        {formatDateTime(order.deletedAt)}
                      </span>
                    </td>

                    {/* Deleted By */}

                    <td>
                      <div className="deleted-orders-deleted-by">
                        <strong>
                          {order.deletedBy || "-"}
                        </strong>

                        {order.deletedByRole && (
                          <span
                            className={getRoleClass(
                              order.deletedByRole
                            )}
                          >
                            {order.deletedByRole}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Action */}

                    <td>
                      <button
                        type="button"
                        className="deleted-orders-view-button"
                        onClick={() =>
                          setSelectedOrder(order)
                        }
                        aria-label={`View deleted order ${order.orderId}`}
                        title="View order"
                      >
                        <Eye size={17} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8">
                    <div className="deleted-orders-empty-state">
                      <div className="deleted-orders-empty-icon">
                        <Trash2 size={20} />
                      </div>

                      <h3>
                        No deleted orders found
                      </h3>

                      <p>
                        Deleted orders matching the selected
                        filters will appear here.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* =====================================================
          ORDER DETAILS MODAL
      ===================================================== */}

      {selectedOrder && (
        <div
          className="deleted-orders-modal-overlay"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget
            ) {
              setSelectedOrder(null);
            }
          }}
        >
          <div className="deleted-orders-modal">
            {/* Modal Header */}

            <div className="deleted-orders-modal-header">
              <div>
                <p>Deleted Order</p>

                <h2>
                  #{selectedOrder.orderId}
                </h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedOrder(null)
                }
                aria-label="Close order details"
              >
                ×
              </button>
            </div>

            {/* Modal Body */}

            <div className="deleted-orders-modal-body">
              <div className="deleted-orders-detail">
                <span>Seller</span>

                <strong>
                  {selectedOrder.sellerName || "-"}
                </strong>
              </div>

              <div className="deleted-orders-detail">
                <span>Shop</span>

                <strong>
                  {selectedOrder.shopName || "-"}
                </strong>
              </div>

              <div className="deleted-orders-detail">
                <span>Manager</span>

                <strong>
                  {selectedOrder.managerName || "-"}
                </strong>
              </div>

              <div className="deleted-orders-detail">
                <span>Customer</span>

                <strong>
                  {selectedOrder.customerName || "-"}
                </strong>
              </div>

              <div className="deleted-orders-detail">
                <span>Total</span>

                <strong>
                  {formatCurrency(
                    selectedOrder.total
                  )}
                </strong>
              </div>

              <div className="deleted-orders-detail">
                <span>Deleted At</span>

                <strong>
                  {formatDateTime(
                    selectedOrder.deletedAt
                  )}
                </strong>
              </div>

              <div className="deleted-orders-detail">
                <span>Deleted By</span>

                <strong>
                  {selectedOrder.deletedBy || "-"}
                </strong>
              </div>

              <div className="deleted-orders-detail">
                <span>Role</span>

                <strong>
                  {selectedOrder.deletedByRole || "-"}
                </strong>
              </div>
            </div>

            {/* Modal Footer */}

            <div className="deleted-orders-modal-footer">
              <button
                type="button"
                onClick={() =>
                  setSelectedOrder(null)
                }
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default SuperAdminDeletedOrders;