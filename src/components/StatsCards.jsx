import { Globe, TriangleAlert, Info, ShieldOff } from 'lucide-react';

function StatsCards({ scans }) {
  const scanned = scans.filter((s) => s.status !== 'blocked');
  const blocked = scans.length - scanned.length;
  const totalViolations = scanned.reduce((sum, s) => sum + (s.violations?.length || 0), 0);
  const average = scanned.length ? (totalViolations / scanned.length).toFixed(1) : '0';

  const cards = [
    { label: 'Sites scanned', value: scans.length, icon: Globe, tone: 'primary' },
    { label: 'Violations found', value: totalViolations, icon: TriangleAlert, tone: 'critical' },
    { label: 'Average per site', value: average, icon: Info, tone: 'moderate' },
    { label: 'Blocked sites', value: blocked, icon: ShieldOff, tone: 'muted' },
  ];

  return (
    <ul className="stats">
      {cards.map(({ label, value, icon: Icon, tone }) => (
        <li key={label} className="stat card">
          <span className={`stat-icon tone-${tone}`} aria-hidden="true">
            <Icon size={20} />
          </span>
          <span className="stat-value">{value}</span>
          <span className="stat-label">{label}</span>
        </li>
      ))}
    </ul>
  );
}

export default StatsCards;
