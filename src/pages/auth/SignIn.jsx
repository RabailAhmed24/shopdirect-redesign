import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShoppingBag,
  UserRound,
} from "lucide-react";

import "../../styles/sign-in.css";

function SignIn() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const isEmailValid =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isPasswordValid =
    password.trim().length >= 6;

  const isFormValid =
    isEmailValid && isPasswordValid;

  const progress = isFormValid
    ? 100
    : isEmailValid
      ? 50
      : 0;

  function handleSubmit(event) {
    event.preventDefault();

    if (!isFormValid) return;

    localStorage.setItem("shopdirect-auth", "true");

    navigate("/super-admin", {
      replace: true,
    });
  }

  return (
    <main className="signin-page">
      <section className="signin-shell">
        <aside className="signin-visual">
          <div className="visual-shape visual-shape-one" />
          <div className="visual-shape visual-shape-two" />

          <div className="visual-content">
            <div className="visual-brand">
              <div className="visual-brand-icon">
                <ShoppingBag size={24} />
              </div>

              <div className="visual-brand-copy">
                <h1>
                  Shop<span>Direct</span>
                </h1>

                <p>Store Management System</p>
              </div>
            </div>

            <div className="visual-message">
              <span className="visual-small-label">
                One connected workspace
              </span>

              <h2>
                Manage your store
                <span> with confidence.</span>
              </h2>

              <p>
                Keep your operations organized, manage activity,
                and access everything you need from one place.
              </p>
            </div>

            <div className="visual-illustration">
              <img
                src="/shopdirect-login-illustration.png"
                alt="ShopDirect commerce management illustration"
              />
            </div>
          </div>
        </aside>

        <section className="signin-panel">
          <div className="signin-form-wrapper">
            <div className="signin-heading">
              <h2>Welcome back</h2>

              <p>
                Sign in to your{" "}
                <strong>ShopDirect</strong> account to continue.
              </p>
            </div>

            <div className="signin-progress">
              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{ width: `${progress}%` }}
                />

                <div
                  className={`progress-step progress-start ${
                    email ? "active" : ""
                  }`}
                >
                  <div className="progress-icon">
                    <UserRound size={16} />
                  </div>

                  <span>Details</span>
                </div>

                <div
                  className={`progress-step progress-end ${
                    isFormValid ? "active" : ""
                  }`}
                >
                  <div className="progress-icon">
                    {isFormValid ? (
                      <Check size={16} />
                    ) : (
                      <LockKeyhole size={16} />
                    )}
                  </div>

                  <span>Verified</span>
                </div>
              </div>
            </div>

            <form
              className="signin-form"
              onSubmit={handleSubmit}
            >
              <div className="signin-field">
                <label htmlFor="email">
                  EMAIL
                </label>

                <div
                  className={`signin-input ${
                    isEmailValid ? "valid" : ""
                  }`}
                >
                  <Mail size={19} />

                  <input
                    id="email"
                    type="email"
                    value={email}
                    placeholder="you@company.com"
                    autoComplete="email"
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                  />

                  {isEmailValid && (
                    <span className="validation-check">
                      <Check size={15} />
                    </span>
                  )}
                </div>
              </div>

              <div className="signin-field">
                <label htmlFor="password">
                  PASSWORD
                </label>

                <div
                  className={`signin-input ${
                    isPasswordValid ? "valid" : ""
                  }`}
                >
                  <LockKeyhole size={19} />

                  <input
                    id="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={password}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowPassword(
                        (previous) => !previous
                      )
                    }
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>

                  {isPasswordValid && (
                    <span className="validation-check">
                      <Check size={15} />
                    </span>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="signin-button"
                disabled={!isFormValid}
              >
                <span>Sign In</span>
                <ArrowRight size={18} />
              </button>
            </form>
          </div>
        </section>
      </section>
    </main>
  );
}

export default SignIn;