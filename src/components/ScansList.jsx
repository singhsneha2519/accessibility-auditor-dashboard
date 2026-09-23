function ScansList({ scans, onSelectScan }) {
  return (
    <div className="scans-list">
      {scans.map((scan, index) => (
        <div
          key={index}
          className="scan-row"
          onClick={() => onSelectScan(scan)}
        >
          <span>{scan.url}</span>
          {scan.status === 'blocked' ? (
            <span className="badge badge-neutral">Blocked</span>
          ) : (
            <span className="badge badge-warning">
              {scan.violations.length} issues
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

export default ScansList;