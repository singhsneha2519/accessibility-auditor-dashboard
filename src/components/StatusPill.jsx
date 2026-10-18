import { worstSeverity } from '../utils/scanHelpers';

function StatusPill({ scan }) {
  if (scan.status === 'blocked') {
    return <span className="pill pill-muted">Blocked</span>;
  }

  const violations = scan.violations || [];
  if (violations.length === 0) {
    return <span className="pill pill-ok">No issues</span>;
  }

  const worst = worstSeverity(violations);
  const noun = violations.length === 1 ? 'issue' : 'issues';
  return <span className={`pill pill-${worst}`}>{violations.length} {noun}</span>;
}

export default StatusPill;
