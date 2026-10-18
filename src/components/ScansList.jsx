import { Globe, ChevronRight } from 'lucide-react';
import StatusPill from './StatusPill';
import { hostOf } from '../utils/scanHelpers';

function ScansList({ scans, onSelect, limit }) {
  const rows = limit ? scans.slice(0, limit) : scans;

  if (rows.length === 0) {
    return (
      <div className="empty card">
        <p className="empty-title">No scans yet</p>
        <p className="muted">Enter a government website above and select Scan site. Results appear here.</p>
      </div>
    );
  }

  return (
    <ul className="scan-list card">
      {rows.map((scan, index) => (
        <li key={`${scan.url}-${index}`}>
          <button type="button" className="scan-row" onClick={() => onSelect(scan)}>
            <span className="scan-icon" aria-hidden="true">
              <Globe size={18} />
            </span>
            <span className="scan-main">
              <span className="scan-host">{hostOf(scan.url)}</span>
              <span className="scan-url">{scan.url}</span>
            </span>
            <StatusPill scan={scan} />
            <ChevronRight size={18} className="scan-chevron" aria-hidden="true" />
          </button>
        </li>
      ))}
    </ul>
  );
}

export default ScansList;
