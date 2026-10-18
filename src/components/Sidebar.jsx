import { LayoutDashboard, ListChecks, TrendingUp, ShieldCheck } from 'lucide-react';

const NAV = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'scans', label: 'All scans', icon: ListChecks },
  { id: 'insights', label: 'Insights', icon: TrendingUp },
];

function Sidebar({ view, onNavigate }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand-mark" aria-hidden="true">
          <ShieldCheck size={20} />
        </span>
        <span className="brand-name">Accessibility Auditor</span>
      </div>

      <nav aria-label="Main">
        <ul className="nav-list">
          {NAV.map(({ id, label, icon: Icon }) => (
            <li key={id}>
              <button
                type="button"
                className={`nav-item${view === id ? ' is-active' : ''}`}
                aria-current={view === id ? 'page' : undefined}
                onClick={() => onNavigate(id)}
              >
                <Icon size={18} aria-hidden="true" />
                {label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-note">
        <p className="sidebar-note-title">What gets checked</p>
        <p>
          WCAG 2.x (A and AA) rules through axe-core, which covers the accessibility
          pillar of GIGW 3.0.
        </p>
      </div>
    </aside>
  );
}

export default Sidebar;
