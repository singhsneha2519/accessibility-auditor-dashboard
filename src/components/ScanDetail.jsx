import { ArrowLeft, ShieldOff, CircleCheck, Info } from 'lucide-react';
import AiSummary from './AiSummary';
import StatusPill from './StatusPill';
import { hostOf, severityCounts, SEVERITY_ORDER } from '../utils/scanHelpers';

function ScanDetail({ scan, onBack }) {
  if (!scan) return null;

  const blocked = scan.status === 'blocked';
  const violations = scan.violations || [];
  const counts = severityCounts(violations);

  return (
    <div className="detail">
      <button type="button" className="btn btn-ghost" onClick={onBack}>
        <ArrowLeft size={18} aria-hidden="true" />
        Back
      </button>

      <header className="detail-head card">
        <div className="detail-title">
          <h1>{hostOf(scan.url)}</h1>
          <p className="muted detail-url">{scan.url}</p>
        </div>
        <StatusPill scan={scan} />
      </header>

      {blocked && (
        <div className="notice card">
          <ShieldOff size={22} aria-hidden="true" />
          <div>
            <p className="status-title">This site refused automated scanning</p>
            <p className="muted">
              Some government sites use bot protection that blocks tools like ours. The attempt is
              still saved, so it counts in the dataset.
            </p>
          </div>
        </div>
      )}

      {!blocked && violations.length === 0 && (
        <div className="notice notice-ok card">
          <CircleCheck size={22} aria-hidden="true" />
          <div>
            <p className="status-title">No violations detected</p>
            <p className="muted">
              Automated checks find roughly a third of accessibility problems, so manual testing is
              still worth doing.
            </p>
          </div>
        </div>
      )}

      {!blocked && scan.aiSummary && <AiSummary text={scan.aiSummary} />}

      {!blocked && scan.aiFailed && (
        <div className="notice card">
          <Info size={22} aria-hidden="true" />
          <div>
            <p className="status-title">The AI summary isn’t available right now</p>
            <p className="muted">
              The explanation service may be waking up. Scan again in a minute. The technical
              findings below are complete.
            </p>
          </div>
        </div>
      )}

      {!blocked && violations.length > 0 && (
        <section aria-labelledby="violations-title">
          <div className="section-head">
            <h2 id="violations-title">Violations ({violations.length})</h2>
            <ul className="severity-chips">
              {SEVERITY_ORDER.filter((level) => counts[level] > 0).map((level) => (
                <li key={level} className={`pill pill-${level}`}>
                  {counts[level]} {level}
                </li>
              ))}
            </ul>
          </div>

          <ul className="violations">
            {violations.map((v, index) => {
              const nodes = v.nodes || [];
              return (
                <li key={`${v.id}-${index}`} className={`violation card sev-${v.impact}`}>
                  <div className="violation-top">
                    <span className={`pill pill-${v.impact}`}>{v.impact}</span>
                    <code>{v.id}</code>
                    <span className="muted violation-count">
                      {nodes.length} {nodes.length === 1 ? 'element' : 'elements'} affected
                    </span>
                  </div>
                  <p className="violation-desc">{v.description}</p>

                  {nodes.length > 0 && (
                    <details>
                      <summary>Show affected elements</summary>
                      <ul className="snippets">
                        {nodes.slice(0, 3).map((n, i) => (
                          <li key={i}>
                            <pre>{(n.html || '').slice(0, 300)}{(n.html || '').length > 300 ? '…' : ''}</pre>
                          </li>
                        ))}
                      </ul>
                      {nodes.length > 3 && (
                        <p className="muted">and {nodes.length - 3} more</p>
                      )}
                    </details>
                  )}

                  {v.helpUrl && (
                    <a className="learn-link" href={v.helpUrl} target="_blank" rel="noopener noreferrer">
                      How to fix this (opens in a new tab)
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </div>
  );
}

export default ScanDetail;
