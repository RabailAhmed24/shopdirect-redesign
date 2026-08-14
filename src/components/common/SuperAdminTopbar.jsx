import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  ChevronDown,
  LogOut,
  Search,
} from "lucide-react";

import { superAdminModules } from "../../data/superAdminModules";

function SuperAdminTopbar() {
  const navigate = useNavigate();

  const searchAreaRef = useRef(null);
  const profileMenuRef = useRef(null);

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const normalizedQuery = query.trim().toLowerCase();

  const searchResults = useMemo(() => {
    if (!normalizedQuery) {
      return [];
    }

    return superAdminModules.filter((module) => {
      const searchableText = [
        module.name,
        ...(module.keywords || []),
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(normalizedQuery);
    });
  }, [normalizedQuery]);

  useEffect(() => {
    function handleOutsideClick(event) {
      if (
        searchAreaRef.current &&
        !searchAreaRef.current.contains(event.target)
      ) {
        setIsSearchOpen(false);
      }

      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setIsProfileOpen(false);
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        setIsSearchOpen(false);
        setIsProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  function openModule(module) {
    navigate(module.route);

    setQuery("");
    setSelectedIndex(0);
    setIsSearchOpen(false);
  }

  function handleSearchChange(event) {
    const value = event.target.value;

    setQuery(value);
    setSelectedIndex(0);
    setIsSearchOpen(value.trim().length > 0);
  }

  function handleSearchKeyDown(event) {
    if (event.key === "Escape") {
      setIsSearchOpen(false);
      return;
    }

    if (!isSearchOpen || searchResults.length === 0) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();

      setSelectedIndex((currentIndex) =>
        currentIndex >= searchResults.length - 1
          ? 0
          : currentIndex + 1
      );

      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();

      setSelectedIndex((currentIndex) =>
        currentIndex <= 0
          ? searchResults.length - 1
          : currentIndex - 1
      );

      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();

      const selectedModule = searchResults[selectedIndex];

      if (selectedModule) {
        openModule(selectedModule);
      }
    }
  }

  return (
    <header className="super-admin-topbar">
      <div
        className="workspace-search"
        ref={searchAreaRef}
      >
        <div className="topbar-search">
          <Search size={17} strokeWidth={1.8} />

          <input
            id="workspace-search"
            name="workspace-search"
            type="text"
            value={query}
            placeholder="Search across workspace..."
            aria-label="Search across workspace"
            autoComplete="off"
            onChange={handleSearchChange}
            onFocus={() => {
              if (query.trim()) {
                setIsSearchOpen(true);
              }
            }}
            onKeyDown={handleSearchKeyDown}
          />
        </div>

        {isSearchOpen && (
          <div className="workspace-search-dropdown">
            {searchResults.length > 0 ? (
              searchResults.map((module, index) => {
                const Icon = module.icon;

                return (
                  <button
                    key={module.route}
                    type="button"
                    className={`workspace-search-result${
                      index === selectedIndex ? " selected" : ""
                    }`}
                    onMouseEnter={() => setSelectedIndex(index)}
                    onClick={() => openModule(module)}
                  >
                    <span className="search-result-icon">
                      <Icon size={17} strokeWidth={1.8} />
                    </span>

                    <span>{module.name}</span>
                  </button>
                );
              })
            ) : (
              <div className="workspace-search-empty">
                No results found.
              </div>
            )}
          </div>
        )}
      </div>

      <div className="topbar-actions">
        <button
          type="button"
          className="notification-button"
          aria-label="Notifications"
        >
          <Bell size={19} strokeWidth={1.8} />
        </button>

        <div
          className="profile-menu"
          ref={profileMenuRef}
        >
          <button
            type="button"
            className={`topbar-profile${
              isProfileOpen ? " open" : ""
            }`}
            onClick={() =>
              setIsProfileOpen((prev) => !prev)
            }
            aria-expanded={isProfileOpen}
            aria-haspopup="menu"
          >
            <div className="profile-avatar">SA</div>

            <div className="profile-info">
              <span className="profile-name">
                Super Admin
              </span>

              <span className="profile-role">
                Administrator
              </span>
            </div>

            <ChevronDown
              className="profile-chevron"
              size={16}
              strokeWidth={1.8}
            />
          </button>

          {isProfileOpen && (
            <div
              className="profile-dropdown"
              role="menu"
            >
              <button
                type="button"
                className="signout-button"
                role="menuitem"
              >
                <LogOut
                  size={16}
                  strokeWidth={1.8}
                />
                <span>Sign out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default SuperAdminTopbar;