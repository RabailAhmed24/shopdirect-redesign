function SuperAdminDashboard() {
  return (
    <div className="dashboard-page">
      <section className="dashboard-hero">
        <div className="dashboard-hero-content">
          <p className="dashboard-eyebrow">Super Admin Workspace</p>

          <h1>
            Control the platform.
            <span> See the bigger picture.</span>
          </h1>

          <p className="dashboard-description">
            Monitor operations, financial activity, user access, and platform
            performance from one central workspace.
          </p>
        </div>

        <div className="dashboard-status">
          <span className="status-dot" />
          <span>System overview</span>
        </div>
      </section>
    </div>
  );
}

export default SuperAdminDashboard;