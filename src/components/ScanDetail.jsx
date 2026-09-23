function ScanDetail({ scan, onBack }) {
  if (!scan) return null;

  return (
    <div className="scan-detail">
      <button onClick={onBack}>&larr; Back to list</button>
      <h3>{scan.url}</h3>

      {scan.status === 'blocked' ? (
        <p>This site blocked automated scanning.</p>
      ) : (
        <div className="violations-list">
          {scan.violations.map((violation, index) => (
            <div key={index} className="violation-card">
              <div className="violation-header">
                <span className={`badge badge-${violation.impact}`}>
                  {violation.impact}
                </span>
                <code>{violation.id}</code>
              </div>
              <p>{violation.description}</p>
              {/*  AI  plain-language explanation will render */}
              {violation.plain_explanation && (
                <p className="explanation">{violation.plain_explanation}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ScanDetail;