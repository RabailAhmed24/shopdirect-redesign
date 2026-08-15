import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  Search,
  Plus,
  ChevronDown,
  ChevronUp,
  X,
  UserRound,
  ShieldCheck,
  BriefcaseBusiness,
  Store,
  Phone,
  Mail,
  LockKeyhole,
  MapPin,
  Building2,
  Eye,
  EyeOff,
  Pencil,
  Copy,
  Trash2,
} from "lucide-react";

import "../../../styles/super-admin-users.css";

const roleOptions = [
  { id: "admin", label: "Admin", icon: ShieldCheck },
  { id: "manager", label: "Manager", icon: BriefcaseBusiness },
  { id: "seller", label: "Seller", icon: Store },
];

const USERS_STORAGE_KEY = "shopdirect-super-admin-users";

const filters = [
  { id: "all", label: "All Users" },
  { id: "admin", label: "Admins" },
  { id: "manager", label: "Managers" },
  { id: "seller", label: "Sellers" },
];

const emptyForm = {
  name: "",
  phone: "",
  warehouse: "",
  office: "",
  shopName: "",
  accountType: "",
  assignedAdmin: "",
  assignedManager: "",
  address: "",
  email: "",
  password: "",
  confirmPassword: "",
};

function SuperAdminUsers() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const [modalMode, setModalMode] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [removeSearch, setRemoveSearch] = useState("");
  const [removeUserId, setRemoveUserId] = useState(null);
  const [removeError, setRemoveError] = useState("");
  const [users, setUsers] = useState(() => {
    try {
      const savedUsers = localStorage.getItem(USERS_STORAGE_KEY);

      return savedUsers
        ? JSON.parse(savedUsers)
        : [];
    } catch {
      return [];
    }
  });

  const addMenuRef = useRef(null);

  /* =====================================================
     LOCAL STORAGE PERSISTENCE
     ===================================================== */
  useEffect(() => {
    try {
      localStorage.setItem(
        USERS_STORAGE_KEY,
        JSON.stringify(users)
      );
    } catch {
      // Keep the UI usable even when browser storage is unavailable.
    }
  }, [users]);

  const admins = users.filter((user) => user.role === "admin");
  const managers = users.filter((user) => user.role === "manager");

  const filteredUsers = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return users.filter((user) => {
      const matchesRole =
        activeFilter === "all" || user.role === activeFilter;

      const matchesSearch =
        !query ||
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query);

      return matchesRole && matchesSearch;
    });
  }, [users, activeFilter, searchTerm]);

  const currentFilterLabel =
    filters.find((filter) => filter.id === activeFilter)?.label ||
    "All Users";

  const removableUsers = useMemo(() => {
    const query = removeSearch.trim().toLowerCase();

    if (!query) {
      return users;
    }

    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query)
    );
  }, [users, removeSearch]);

  const removeSelectedUser =
    users.find((user) => user.id === removeUserId) || null;

  useEffect(() => {
    function handleOutsideClick(event) {
      if (
        isAddMenuOpen &&
        addMenuRef.current &&
        !addMenuRef.current.contains(event.target)
      ) {
        setIsAddMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isAddMenuOpen]);

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

  function openCreateModal(role) {
    setSelectedRole(role);
    setModalMode("create");
    setSelectedUserId(null);
    setFormData(emptyForm);
    setError("");
    setFieldErrors({});
    setShowPassword(false);
    setShowConfirmPassword(false);
    setIsAddMenuOpen(false);
  }

  function openUpdateModal(user) {
    if (!user) {
      return;
    }

    setSelectedRole(user.role);
    setModalMode("update");
    setSelectedUserId(user.id);

    setFormData({
      ...emptyForm,
      ...user,
      password: "",
      confirmPassword: "",
    });

    setError("");
    setFieldErrors({});
    setShowPassword(false);
    setShowConfirmPassword(false);
    setIsAddMenuOpen(false);
  }

  function openRemoveModal() {
    setModalMode("remove");
    setSelectedRole(null);
    setRemoveSearch("");
    setRemoveUserId(null);
    setRemoveError("");
    setIsAddMenuOpen(false);
  }

  function closeModal() {
    setModalMode(null);
    setSelectedRole(null);
    setFormData(emptyForm);
    setError("");
    setFieldErrors({});
    setRemoveSearch("");
    setRemoveUserId(null);
    setRemoveError("");
    setShowPassword(false);
    setShowConfirmPassword(false);
  }

  function getRemovalBlockReason(user) {
    if (!user) {
      return "";
    }

    if (user.role === "admin") {
      const hasManagers = users.some(
        (candidate) =>
          candidate.role === "manager" &&
          candidate.assignedAdmin === user.name
      );

      const hasSellers = users.some(
        (candidate) =>
          candidate.role === "seller" &&
          candidate.assignedAdmin === user.name
      );

      if (hasManagers || hasSellers) {
        return "This Admin still has Managers or Sellers assigned. Reassign or remove those users first.";
      }
    }

    if (user.role === "manager") {
      const hasSellers = users.some(
        (candidate) =>
          candidate.role === "seller" &&
          candidate.assignedManager === user.name
      );

      if (hasSellers) {
        return "This Manager still has Sellers assigned. Reassign or remove those Sellers first.";
      }
    }

    return "";
  }

  function handleRemoveUser() {
    if (!removeSelectedUser) {
      setRemoveError("Select a user to remove.");
      return;
    }

    const blockReason =
      getRemovalBlockReason(removeSelectedUser);

    if (blockReason) {
      setRemoveError(blockReason);
      return;
    }

    setUsers((current) =>
      current.filter(
        (user) => user.id !== removeSelectedUser.id
      )
    );

    if (selectedUserId === removeSelectedUser.id) {
      setSelectedUserId(null);
    }

    closeModal();
  }

  function handleInputChange(event) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setError("");

    setFieldErrors((current) => ({
      ...current,
      [name]: "",
    }));
  }

  function validateForm() {
    const errors = {};

    const name = formData.name.trim();
    const phone = formData.phone.trim();
    const email = formData.email.trim();

    const namePattern = /^[A-Za-z][A-Za-z\s'-]{1,49}$/;
    const phonePattern = /^\+?[0-9\s()-]{7,20}$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordPattern =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

    if (!name) {
      errors.name = "Name is required.";
    } else if (!namePattern.test(name)) {
      errors.name =
        "Use 2–50 letters only. Spaces, apostrophes and hyphens are allowed.";
    }

    if (!phone) {
      errors.phone = "Phone number is required.";
    } else if (!phonePattern.test(phone)) {
      errors.phone =
        "Enter a valid phone number with 7–20 characters.";
    }

    if (!email) {
      errors.email = "Email is required.";
    } else if (!emailPattern.test(email)) {
      errors.email = "Enter a valid email address.";
    } else {
      const normalizedEmail = email
        .trim()
        .toLowerCase();

      const duplicateEmail = users.some(
        (user) =>
          user.email
            .trim()
            .toLowerCase() === normalizedEmail &&
          user.id !== selectedUserId
      );

      if (duplicateEmail) {
        errors.email =
          "A user with this email already exists.";
      }
    }

    if (selectedRole === "admin") {
      if (!formData.warehouse.trim()) {
        errors.warehouse =
          "Warehouse is required for an admin.";
      }
    }

    if (selectedRole === "manager") {
      if (admins.length === 0) {
        errors.assignedAdmin =
          "Create an Admin first before creating a Manager.";
      } else if (!formData.assignedAdmin) {
        errors.assignedAdmin =
          "Assigned Admin is required.";
      }

      if (!formData.office.trim()) {
        errors.office =
          "Office is required for a manager.";
      }
    }

    if (selectedRole === "seller") {
      if (!formData.shopName.trim()) {
        errors.shopName =
          "Shop Name is required.";
      }

      if (!formData.accountType.trim()) {
        errors.accountType =
          "Account Type is required.";
      }

      if (admins.length === 0) {
        errors.assignedAdmin =
          "Create an Admin first before creating a Seller.";
      } else if (!formData.assignedAdmin) {
        errors.assignedAdmin =
          "Assigned Admin is required.";
      }

      if (managers.length === 0) {
        errors.assignedManager =
          "Create a Manager first before creating a Seller.";
      } else if (!formData.assignedManager) {
        errors.assignedManager =
          "Assigned Manager is required.";
      }

      if (
        formData.assignedAdmin &&
        formData.assignedManager
      ) {
        const selectedManager = managers.find(
          (manager) =>
            manager.name === formData.assignedManager
        );

        if (
          selectedManager &&
          selectedManager.assignedAdmin &&
          selectedManager.assignedAdmin !==
            formData.assignedAdmin
        ) {
          errors.assignedManager =
            "Selected Manager does not belong to the selected Admin.";
        }
      }
    }

    const needsPassword =
      modalMode === "create" ||
      Boolean(formData.password);

    if (needsPassword) {
      if (!formData.password) {
        errors.password = "Password is required.";
      } else if (
        !passwordPattern.test(formData.password)
      ) {
        errors.password =
          "Minimum 8 characters with 1 uppercase letter, 1 number and 1 special character.";
      }

      if (!formData.confirmPassword) {
        errors.confirmPassword =
          "Please confirm the password.";
      } else if (
        formData.password !==
        formData.confirmPassword
      ) {
        errors.confirmPassword =
          "Passwords do not match.";
      }
    }

    if (
      formData.address.trim() &&
      formData.address.trim().length < 5
    ) {
      errors.address =
        "Address is too short.";
    }

    setFieldErrors(errors);

    return Object.keys(errors).length === 0;
  }

  function handleSubmit(event) {
    event.preventDefault();

    const isValid = validateForm();

    if (!isValid) {
      setError(
        "Please fix the highlighted fields."
      );
      return;
    }

    if (modalMode === "create") {
      const newUser = {
        id: Date.now(),
        role: selectedRole,
        ...formData,
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim().toLowerCase(),
        address: formData.address.trim(),
      };

      setUsers((current) => [
        newUser,
        ...current,
      ]);

      setSelectedUserId(newUser.id);
    } else {
      setUsers((current) =>
        current.map((user) =>
          user.id === selectedUserId
            ? {
                ...user,
                ...formData,
                role: selectedRole,
                email: user.email
                  .trim()
                  .toLowerCase(),
                password:
                  formData.password || user.password,
              }
            : user
        )
      );
    }

    closeModal();
  }

  function getRoleLabel(role) {
    return (
      roleOptions.find((option) => option.id === role)?.label ||
      role
    );
  }

  function getInitials(name) {
    return name
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }

  async function handleCopy(value) {
    if (!value) {
      return;
    }

    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const temporaryInput = document.createElement("textarea");

      temporaryInput.value = value;
      temporaryInput.style.position = "fixed";
      temporaryInput.style.opacity = "0";

      document.body.appendChild(temporaryInput);

      temporaryInput.select();
      document.execCommand("copy");

      document.body.removeChild(temporaryInput);
    }
  }

  function renderUserDetails(user) {
    if (user.role === "admin") {
      return (
        <div className="users-details-cell">
          <strong>{user.warehouse || "—"}</strong>
          <span>Warehouse</span>
        </div>
      );
    }

    if (user.role === "manager") {
      return (
        <div className="users-details-cell">
          <strong>{user.office || "—"}</strong>
          <span>
            {user.assignedAdmin
              ? `Admin: ${user.assignedAdmin}`
              : "No admin assigned"}
          </span>
        </div>
      );
    }

    return (
      <div className="users-details-cell">
        <strong>{user.shopName || "—"}</strong>
        <span>
          {[
            user.accountType,
            user.assignedAdmin
              ? `Admin: ${user.assignedAdmin}`
              : "",
            user.assignedManager
              ? `Manager: ${user.assignedManager}`
              : "",
          ]
            .filter(Boolean)
            .join(" • ") || "Seller details"}
        </span>
      </div>
    );
  }

  return (
    <section className="super-admin-users">
      {/* =====================================================
          PAGE HEADER
          ===================================================== */}
      <div className="users-page-header">
        <div className="users-heading-group">
          <p className="users-eyebrow">
            Super Admin
          </p>

          <h1>
            User Management
          </h1>

          <p className="users-description">
            Manage admins, managers and sellers across ShopDirect.
          </p>
        </div>

        <div className="users-header-actions">
          <button
            type="button"
            className="users-remove-button"
            onClick={openRemoveModal}
            disabled={users.length === 0}
          >
            <Trash2 size={16} />
            Remove User
          </button>

          <div
            className="users-add-wrapper"
            ref={addMenuRef}
          >
            <button
              type="button"
              className="users-add-button"
              onClick={() =>
                setIsAddMenuOpen((current) => !current)
              }
            >
              <Plus size={17} />

              Add User

              {isAddMenuOpen ? (
                <ChevronUp size={15} />
              ) : (
                <ChevronDown size={15} />
              )}
            </button>

            {isAddMenuOpen && (
              <div className="users-add-menu">
                {roleOptions.map(({ id, label }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => openCreateModal(id)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* =====================================================
          SEARCH + FILTERS
          ===================================================== */}
      <div className="users-toolbar">
        <div className="users-search">
          <Search size={17} />

          <input
            id="user-management-search"
            name="userManagementSearch"
            type="search"
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
            placeholder="Search users by name or email..."
            autoComplete="off"
            aria-label="Search users by name or email"
          />
        </div>

        <div className="users-filters">
          {filters.map((filter) => (
            <button
              key={filter.id}
              type="button"
              className={`users-filter-button users-filter-${filter.id} ${
                activeFilter === filter.id
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setActiveFilter(filter.id)
              }
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* =====================================================
          USER RECORDS
          ===================================================== */}
      <div className="users-table-card">
        <div className="users-table-header">
          <div>
            <p>
              User Records
            </p>

            <h2>
              {currentFilterLabel}
            </h2>
          </div>

          <span>
            {filteredUsers.length} users
          </span>
        </div>

        {filteredUsers.length === 0 ? (
          <div className="users-empty-state">
            <div className="users-empty-icon">
              !
            </div>

            <h3>
              No users found.
            </h3>

            <p>
              User records will appear here once data is available.
            </p>
          </div>
        ) : (
          <div className="users-table-scroll">
            <table className="users-table">
              <colgroup>
                <col className="users-col-user" />
                <col className="users-col-role" />
                <col className="users-col-details" />
                <col className="users-col-phone" />
                <col className="users-col-email" />
                <col className="users-col-action" />
              </colgroup>

              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Details</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className={
                      selectedUserId === user.id
                        ? "selected"
                        : ""
                    }
                    onClick={() =>
                      setSelectedUserId(user.id)
                    }
                  >
                    <td>
                      <div className="users-user-cell">
                        <div
                          className={`users-avatar ${user.role}`}
                        >
                          {getInitials(user.name)}
                        </div>

                        <div className="users-user-meta">
                          <strong>
                            {user.name}
                          </strong>

                          <span>
                            {getRoleLabel(user.role)}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span
                        className={`users-role-badge ${user.role}`}
                      >
                        {getRoleLabel(user.role)}
                      </span>
                    </td>

                    <td>
                      {renderUserDetails(user)}
                    </td>

                    <td>
                      <div className="users-copy-value">
                        <span>{user.phone}</span>

                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            handleCopy(user.phone);
                          }}
                          aria-label="Copy phone number"
                          title="Copy phone number"
                        >
                          <Copy size={13} />
                        </button>
                      </div>
                    </td>

                    <td>
                      <div className="users-copy-value users-email-value">
                        <span>{user.email}</span>

                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            handleCopy(user.email);
                          }}
                          aria-label="Copy email"
                          title="Copy email"
                        >
                          <Copy size={13} />
                        </button>
                      </div>
                    </td>

                    <td>
                      <button
                        type="button"
                        className="users-row-update-button"
                        onClick={(event) => {
                          event.stopPropagation();
                          setSelectedUserId(user.id);
                          openUpdateModal(user);
                        }}
                        aria-label={`Edit ${user.name}`}
                        title="Edit user"
                      >
                        <Pencil size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* =====================================================
          USER MODAL
          ===================================================== */}
      {(modalMode === "create" || modalMode === "update") &&
        selectedRole &&
        createPortal(
          <div
            className="users-modal-overlay"
            onMouseDown={(event) => {
              if (
                event.target === event.currentTarget
              ) {
                closeModal();
              }
            }}
          >
            <div
              className="users-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="users-modal-title"
              onMouseDown={(event) =>
                event.stopPropagation()
              }
            >
              <div className="users-modal-header">
                <div className="users-modal-title-wrap">
                  <div className="users-modal-role-icon">
                    {selectedRole === "admin" && (
                      <ShieldCheck size={22} />
                    )}

                    {selectedRole === "manager" && (
                      <BriefcaseBusiness size={22} />
                    )}

                    {selectedRole === "seller" && (
                      <Store size={22} />
                    )}
                  </div>

                  <div>
                    <p>
                      {modalMode === "create"
                        ? "New"
                        : "Update"}{" "}
                      {getRoleLabel(selectedRole)} Account
                    </p>

                    <h2 id="users-modal-title">
                      {modalMode === "create"
                        ? "Create"
                        : "Update"}{" "}
                      {getRoleLabel(selectedRole)}
                    </h2>

                    <span>
                      {selectedRole === "admin" &&
                        "Set up an admin with operational access."}

                      {selectedRole === "manager" &&
                        "Onboard a manager and link them to the right admin."}

                      {selectedRole === "seller" &&
                        "Set up a seller, shop and management assignment."}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  className="users-modal-close"
                  onClick={closeModal}
                  aria-label="Close modal"
                >
                  <X size={19} />
                </button>
              </div>

              <form
                className="users-modal-form"
                onSubmit={handleSubmit}
              >
                <div className="users-modal-scroll">
                  {/* ===========================================
                      PERSONAL INFORMATION
                      =========================================== */}
                  <div className="users-form-section">
                    <div className="users-section-title">
                      <span />
                      Personal Information
                    </div>

                    <div className="users-form-grid">
                      <Field
                        label="Name"
                        htmlFor="user-name"
                        error={fieldErrors.name}
                        icon={<UserRound size={16} />}
                      >
                        <input
                          id="user-name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Enter Name"
                          autoComplete="name"
                        />
                      </Field>

                      <Field
                        label="Phone Number"
                        htmlFor="user-phone"
                        error={fieldErrors.phone}
                        icon={<Phone size={16} />}
                      >
                        <input
                          id="user-phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="Enter Phone Number"
                          autoComplete="tel"
                        />
                      </Field>

                      {selectedRole === "admin" && (
                        <Field
                          label="Warehouse"
                          htmlFor="user-warehouse"
                          error={fieldErrors.warehouse}
                          icon={<Building2 size={16} />}
                        >
                          <input
                            id="user-warehouse"
                            name="warehouse"
                            value={formData.warehouse}
                            onChange={handleInputChange}
                            placeholder="Warehouse"
                            autoComplete="organization"
                          />
                        </Field>
                      )}

                      {selectedRole === "manager" && (
                        <>
                          <Field
                            label="Office"
                            htmlFor="user-office"
                            error={fieldErrors.office}
                            icon={<Building2 size={16} />}
                          >
                            <input
                              id="user-office"
                              name="office"
                              value={formData.office}
                              onChange={handleInputChange}
                              placeholder="Office"
                              autoComplete="organization"
                            />
                          </Field>

                          <SelectField
                            label="Assigned Admin"
                            id="user-assigned-admin"
                            name="assignedAdmin"
                            value={formData.assignedAdmin}
                            onChange={handleInputChange}
                            error={fieldErrors.assignedAdmin}
                            disabled={admins.length === 0}
                          >
                            <option value="">
                              Select an admin to manage this user
                            </option>

                            {admins.map((admin) => (
                              <option
                                key={admin.id}
                                value={admin.name}
                              >
                                {admin.name}
                              </option>
                            ))}
                          </SelectField>
                        </>
                      )}

                      {selectedRole === "seller" && (
                        <>
                          <Field
                            label="Shop Name"
                            htmlFor="user-shop-name"
                            error={fieldErrors.shopName}
                            icon={<Store size={16} />}
                          >
                            <input
                              id="user-shop-name"
                              name="shopName"
                              value={formData.shopName}
                              onChange={handleInputChange}
                              placeholder="Shop Name"
                              autoComplete="organization"
                            />
                          </Field>

                          <Field
                            label="Account Type"
                            htmlFor="user-account-type"
                            error={fieldErrors.accountType}
                            icon={
                              <BriefcaseBusiness size={16} />
                            }
                          >
                            <input
                              id="user-account-type"
                              name="accountType"
                              value={formData.accountType}
                              onChange={handleInputChange}
                              placeholder="Account Type"
                              autoComplete="off"
                            />
                          </Field>

                          <SelectField
                            label="Assigned Admin"
                            id="user-seller-assigned-admin"
                            name="assignedAdmin"
                            value={formData.assignedAdmin}
                            onChange={handleInputChange}
                            error={fieldErrors.assignedAdmin}
                            disabled={admins.length === 0}
                          >
                            <option value="">
                              Select an admin to manage this user
                            </option>

                            {admins.map((admin) => (
                              <option
                                key={admin.id}
                                value={admin.name}
                              >
                                {admin.name}
                              </option>
                            ))}
                          </SelectField>

                          <SelectField
                            label="Assigned Manager"
                            id="user-assigned-manager"
                            name="assignedManager"
                            value={formData.assignedManager}
                            onChange={handleInputChange}
                            error={fieldErrors.assignedManager}
                            disabled={managers.length === 0}
                          >
                            <option value="">
                              Select a manager
                            </option>

                            {managers.map((manager) => (
                              <option
                                key={manager.id}
                                value={manager.name}
                              >
                                {manager.name}
                              </option>
                            ))}
                          </SelectField>
                        </>
                      )}

                      <Field
                        label="Address"
                        htmlFor="user-address"
                        error={fieldErrors.address}
                        icon={<MapPin size={16} />}
                        className="users-field-full"
                      >
                        <textarea
                          id="user-address"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          placeholder="Address (Optional - defaults to company address)"
                          autoComplete="street-address"
                        />
                      </Field>
                    </div>
                  </div>

                  {/* ===========================================
                      CREDENTIALS
                      =========================================== */}
                  <div className="users-form-section">
                    <div className="users-section-title">
                      <span />
                      Credentials
                    </div>

                    <div className="users-form-grid">
                      <Field
                        label="Email"
                        htmlFor="user-email"
                        error={fieldErrors.email}
                        icon={<Mail size={16} />}
                      >
                        <input
                          id="user-email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Email"
                          autoComplete="email"
                          disabled={modalMode === "update"}
                        />
                      </Field>

                      <Field
                        label="Password"
                        htmlFor="user-password"
                        error={fieldErrors.password}
                        icon={<LockKeyhole size={16} />}
                      >
                        <input
                          id="user-password"
                          name="password"
                          type={
                            showPassword
                              ? "text"
                              : "password"
                          }
                          value={formData.password}
                          onChange={handleInputChange}
                          placeholder={
                            modalMode === "update"
                              ? "New password (optional)"
                              : "Password"
                          }
                          autoComplete="new-password"
                        />

                        <button
                          type="button"
                          className="users-password-toggle"
                          onClick={() =>
                            setShowPassword(
                              (current) => !current
                            )
                          }
                          aria-label="Toggle password visibility"
                        >
                          {showPassword ? (
                            <EyeOff size={17} />
                          ) : (
                            <Eye size={17} />
                          )}
                        </button>
                      </Field>

                      <Field
                        label="Confirm Password"
                        htmlFor="user-confirm-password"
                        error={fieldErrors.confirmPassword}
                        icon={<LockKeyhole size={16} />}
                      >
                        <input
                          id="user-confirm-password"
                          name="confirmPassword"
                          type={
                            showConfirmPassword
                              ? "text"
                              : "password"
                          }
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          placeholder="Confirm Password"
                          autoComplete="new-password"
                        />

                        <button
                          type="button"
                          className="users-password-toggle"
                          onClick={() =>
                            setShowConfirmPassword(
                              (current) => !current
                            )
                          }
                          aria-label="Toggle confirm password visibility"
                        >
                          {showConfirmPassword ? (
                            <EyeOff size={17} />
                          ) : (
                            <Eye size={17} />
                          )}
                        </button>
                      </Field>
                    </div>
                  </div>

                  {error && (
                    <p className="users-form-error">
                      {error}
                    </p>
                  )}
                </div>

                {/* =============================================
                    MODAL ACTIONS
                    ============================================= */}
                <div className="users-modal-actions">
                  <button
                    type="button"
                    className="users-cancel-button"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="users-submit-button"
                  >
                    {modalMode === "create"
                      ? "Create User"
                      : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}

      {/* =====================================================
          REMOVE USER MODAL
          ===================================================== */}
      {modalMode === "remove" &&
        createPortal(
          <div
            className="users-modal-overlay"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                closeModal();
              }
            }}
          >
            <div
              className="users-remove-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="remove-user-title"
              onMouseDown={(event) =>
                event.stopPropagation()
              }
            >
              <div className="users-remove-modal-header">
                <div className="users-remove-title-wrap">
                  <div className="users-remove-title-icon">
                    <Trash2 size={20} />
                  </div>

                  <div>
                    <p>User Management</p>

                    <h2 id="remove-user-title">
                      Remove User
                    </h2>

                    <span>
                      Select a user and confirm removal.
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  className="users-remove-close"
                  onClick={closeModal}
                  aria-label="Close remove user modal"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="users-remove-body">
                <div className="users-remove-search">
                  <Search size={16} />

                  <input
                    id="remove-user-search"
                    name="removeUserSearch"
                    type="search"
                    value={removeSearch}
                    onChange={(event) => {
                      setRemoveSearch(event.target.value);
                      setRemoveError("");
                    }}
                    placeholder="Search by name, email or role..."
                    autoComplete="off"
                    aria-label="Search users to remove"
                  />
                </div>

                <div className="users-remove-list">
                  {removableUsers.length === 0 ? (
                    <div className="users-remove-empty">
                      No matching users found.
                    </div>
                  ) : (
                    removableUsers.map((user) => {
                      const isSelected =
                        removeUserId === user.id;

                      return (
                        <button
                          key={user.id}
                          type="button"
                          className={`users-remove-user-option ${
                            isSelected ? "selected" : ""
                          }`}
                          onClick={() => {
                            setRemoveUserId(user.id);
                            setRemoveError("");
                          }}
                        >
                          <div
                            className={`users-avatar ${user.role}`}
                          >
                            {getInitials(user.name)}
                          </div>

                          <div className="users-remove-user-copy">
                            <strong>{user.name}</strong>
                            <span>{user.email}</span>
                          </div>

                          <span
                            className={`users-role-badge ${user.role}`}
                          >
                            {getRoleLabel(user.role)}
                          </span>
                        </button>
                      );
                    })
                  )}
                </div>

                {removeSelectedUser && (
                  <div className="users-remove-selection">
                    <span>Selected user</span>

                    <strong>
                      {removeSelectedUser.name}
                    </strong>

                    <small>
                      {getRoleLabel(removeSelectedUser.role)} ·{" "}
                      {removeSelectedUser.email}
                    </small>
                  </div>
                )}

                {removeError && (
                  <p className="users-remove-error">
                    {removeError}
                  </p>
                )}
              </div>

              <div className="users-remove-actions">
                <button
                  type="button"
                  className="users-cancel-button"
                  onClick={closeModal}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="users-remove-confirm-button"
                  onClick={handleRemoveUser}
                  disabled={!removeSelectedUser}
                >
                  <Trash2 size={15} />
                  Remove User
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </section>
  );
}

function Field({
  label,
  htmlFor,
  icon,
  children,
  className = "",
  error = "",
}) {
  return (
    <div
      className={`users-field ${
        error ? "has-error" : ""
      } ${className}`}
    >
      <label
        className="users-field-label"
        htmlFor={htmlFor}
      >
        {label}
      </label>

      <div className="users-field-control">
        <span className="users-field-icon">
          {icon}
        </span>

        {children}
      </div>

      {error && (
        <span className="users-field-error">
          {error}
        </span>
      )}
    </div>
  );
}

function SelectField({
  label,
  id,
  name,
  value,
  onChange,
  children,
  error = "",
  disabled = false,
}) {
  return (
    <div
      className={`users-field ${
        error ? "has-error" : ""
      }`}
    >
      <label
        className="users-field-label"
        htmlFor={id}
      >
        {label}
      </label>

      <div className="users-field-control users-select-control">
        <select
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          autoComplete="off"
          disabled={disabled}
        >
          {children}
        </select>

        <ChevronDown size={16} />
      </div>

      {error && (
        <span className="users-field-error">
          {error}
        </span>
      )}
    </div>
  );
}

export default SuperAdminUsers;