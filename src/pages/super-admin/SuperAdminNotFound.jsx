import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

function SuperAdminNotFound() {
  return (
    <section className="module-placeholder not-found-page">
      <p className="module-placeholder-label">404</p>

      <h1>Page Not Found</h1>

      <p>
        The Super Admin page you requested does not exist.
      </p>

      <Link to="/super-admin" className="not-found-link">
        <ArrowLeft size={16} />
        Back to Dashboard
      </Link>
    </section>
  );
}

export default SuperAdminNotFound;