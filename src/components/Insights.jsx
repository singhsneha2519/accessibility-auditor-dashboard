import { useEffect, useState } from 'react';
import { FlaskConical } from 'lucide-react';
import { sampleInsights } from '../data/sampleInsights';
import { getInsights } from '../api/scanApi';

const SEVERITY_COLORS = {
  critical: '#d92d43',
  serious: '#c77700',
  moderate: '#2f6fdb',
  minor: '#2e8b57',
};

const percent = (part, whole) => (whole ? Math.round((part / whole) * 100) : 0);

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function Donut({ segments }) {
  const total = segments.reduce((sum, s) => sum + s.value, 0);
  let running = 0;
  const stops = segments
    .map((s) => {
      const start = running;
      running += (s.value / total) * 100;
      return `${SEVERITY_COLORS[s.level]} ${start}% ${running}%`;
    })
    .join(', ');

  const description = segments.map((s) => `${s.value} ${s.level}`).join(', ');

  return (
    <div className="donut-wrap">
      <div
        className="donut"
        style={{ background: `conic-gradient(${stops})` }}
        role="img"
        aria-label={`Violations by severity: ${description}`}
      >
        <div className="donut-hole">
          <strong>{total}</strong>
          <span>violations</span>
        </div>
      </div>
      <ul className="legend">
        {segments.map((s) => (
          <li key={s.level}>
            <span className="legend-dot" style={{ background: SEVERITY_COLORS[s.level] }} aria-hidden="true" />
            <span className="legend-name">{s.level}</span>
            <strong>{s.value}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
}

const isValid = (d) =>
  Boolean(d && d.totals && Array.isArray(d.topViolations) && Array.isArray(d.severity));

function Insights() {
  // Start with the saved snapshot, then swap in live data when the service answers.
  const [data, setData] = useState(sampleInsights);
  const [status, setStatus] = useState('loading'); // 'loading' | 'live' | 'snapshot'

  useEffect(() => {
    let cancelled = false;
    getInsights()
      .then(({ ok, data: live }) => {
        if (cancelled) return;
        if (ok && isValid(live)) {
          setData(live);
          setStatus('live');
        } else {
          setStatus('snapshot');
        }
      })
      .catch(() => {
        if (!cancelled) setStatus('snapshot');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const { totals, topViolations, severity } = data;
  const tiers = data.tiers || [];
  const legacy = data.legacy || [];
  const isSample = data.source !== 'ds-pipeline';
  const generated = data.generatedAt ? formatDate(data.generatedAt) : null;
  const max = Math.max(...topViolations.map((v) => v.sites), 1);

  let statusText = '';
  if (status === 'loading') {
    statusText = 'Checking for live data. Showing the last saved analysis meanwhile.';
  } else if (status === 'live') {
    statusText = `Live data from the data science service${generated ? `, updated ${generated}` : ''}.`;
  } else if (!isSample) {
    statusText = `Showing the saved analysis${generated ? ` from ${generated}` : ''}. The live service did not respond.`;
  }

  const kpis = [
    { label: 'Sites scanned', value: totals.sitesScanned },
    { label: 'Scanned successfully', value: totals.successful },
    { label: 'Blocked sites', value: totals.blocked },
    { label: 'Violations found', value: totals.violations },
  ];
  if (data.scores) {
    kpis.push({ label: 'Average health score (out of 100)', value: data.scores.mean });
  }

  return (
    <div className="page">
      <header className="page-head">
        <h1>Insights</h1>
        <p className="muted">Patterns across every government website we have scanned.</p>
        {statusText && (
          <p className="muted insights-status" role="status">
            {statusText}
          </p>
        )}
      </header>

      {isSample && (
        <div className="banner" role="note">
          <FlaskConical size={20} aria-hidden="true" />
          <p>
            <strong>Sample data.</strong> These figures come from our 35-site pilot dataset and are
            fixed for now. They will switch to live output from the data science pipeline.
          </p>
        </div>
      )}

      <ul className="stats">
        {kpis.map((k) => (
          <li key={k.label} className="stat card">
            <span className="stat-value">{k.value}</span>
            <span className="stat-label">{k.label}</span>
          </li>
        ))}
      </ul>

      <div className="insight-grid">
        <section className="card chart-card" aria-labelledby="top-title">
          <h2 id="top-title">Most common problems</h2>
          <p className="muted">Number of sites, out of {totals.successful}, that have each issue.</p>
          <ol className="bars">
            {topViolations.map((v) => (
              <li key={v.id} className="bar-row">
                <div className="bar-label">
                  <span>{v.label || v.id}</span>
                  <code>{v.id}</code>
                </div>
                <div className="bar-track" aria-hidden="true">
                  <div className="bar-fill" style={{ width: `${(v.sites / max) * 100}%` }} />
                </div>
                <div className="bar-value">
                  <strong>{v.sites}</strong>
                  <span>{percent(v.sites, totals.successful)}%</span>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <div className="insight-side">
          <section className="card chart-card" aria-labelledby="sev-title">
            <h2 id="sev-title">How serious the problems are</h2>
            <p className="muted">All violations found, by severity.</p>
            <Donut segments={severity} />
          </section>

          {tiers.length === 0 && (
            <section className="card placeholder" aria-labelledby="soon-title">
              <h2 id="soon-title">Coming from data science</h2>
              <ul>
                <li>Municipal, state and central sites compared</li>
              </ul>
            </section>
          )}
        </div>
      </div>

      {(tiers.length > 0 || legacy.length > 0) && (
        <div className="insight-row">
          {tiers.length > 0 && (
            <section className="card chart-card" aria-labelledby="tier-title">
              <h2 id="tier-title">Compared by type of website</h2>
              <p className="muted">
                Average health score out of 100 (higher is better), for each level of government.
              </p>
              <ul className="tiers">
                {tiers.map((t) => (
                  <li key={t.name} className="tier-row">
                    <div className="tier-head">
                      <span className="tier-name">{t.name}</span>
                      <span className="muted">{t.sites} {t.sites === 1 ? 'site' : 'sites'}</span>
                    </div>
                    <div className="tier-meter">
                      <div className="bar-track" aria-hidden="true">
                        <div className="bar-fill" style={{ width: `${Math.min(100, t.meanScore)}%` }} />
                      </div>
                      <strong>{t.meanScore}</strong>
                    </div>
                    <p className="muted tier-meta">
                      On average {t.meanCritical} critical and {t.meanSerious} serious elements per site.
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {legacy.length > 0 && (
            <section className="card chart-card" aria-labelledby="legacy-title">
              <h2 id="legacy-title">Outdated or inaccessible patterns</h2>
              <p className="muted">Share of the {totals.successful} scanned sites that still use each one.</p>
              <ul className="bars">
                {legacy.map((item) => {
                  const pct = percent(item.sites, totals.successful);
                  return (
                    <li key={item.id} className="bar-row">
                      <div className="bar-label">
                        <span>{item.label}</span>
                        <code>{item.id}</code>
                      </div>
                      <div className="bar-track" aria-hidden="true">
                        <div className="bar-fill" style={{ width: `${pct}%` }} />
                      </div>
                      <div className="bar-value">
                        <strong>{item.sites}</strong>
                        <span>{pct}%</span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          )}
        </div>
      )}
    </div>
  );
}

export default Insights;
