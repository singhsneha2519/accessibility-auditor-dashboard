function StatsCards({ scans }) {
  const totalScans = scans.length;
  const totalViolations = scans.reduce(
    (sum, scan) => sum + (scan.violations ? scan.violations.length : 0),
    0
  );
  const avgPerSite = totalScans > 0 ? (totalViolations / totalScans).toFixed(1) : 0;

  return (
    <div className="stats-cards">
      <div className="stat-card">
        <p className="stat-label">Sites scanned</p>
        <p className="stat-value">{totalScans}</p>
      </div>
      <div className="stat-card">
        <p className="stat-label">Violations found</p>
        <p className="stat-value">{totalViolations}</p>
      </div>
      <div className="stat-card">
        <p className="stat-label">Avg per site</p>
        <p className="stat-value">{avgPerSite}</p>
      </div>
    </div>
  );
}

export default StatsCards;