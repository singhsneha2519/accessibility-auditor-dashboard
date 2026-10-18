import { useState } from 'react';
import Sidebar from './components/Sidebar';
import ScanInput from './components/ScanInput';
import StatsCards from './components/StatsCards';
import ScansList from './components/ScansList';
import ScanDetail from './components/ScanDetail';
import LoadingState from './components/LoadingState';
import ErrorState from './components/ErrorState';
import Insights from './components/Insights';
import { scanUrl, explainViolations } from './api/scanApi';
import './App.css';

function App() {
  const [view, setView] = useState('overview');
  const [scans, setScans] = useState([]);
  const [selectedScan, setSelectedScan] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = (next) => {
    setSelectedScan(null);
    setView(next);
  };

  const handleScan = async (url) => {
    setIsLoading(true);
    setError(null);

    try {
      const { ok, data } = await scanUrl(url);

      if (!ok) {
        // The cloud API answers 403 with a "blocked" message for sites that refuse bots.
        // Keep those in the list, since a blocked attempt is a real result.
        if (data?.error && /blocked/i.test(data.error)) {
          const blocked = { url, status: 'blocked', violations: null };
          setScans((prev) => [blocked, ...prev]);
          setSelectedScan(blocked);
        } else {
          setError(data?.error || 'Scan failed');
        }
        return;
      }

      let finalScan = { ...data, status: 'success' };

      // Nothing to explain when the site has no violations.
      if ((data.violations || []).length > 0) {
        try {
          const ai = await explainViolations(url);
          finalScan = ai.ok && ai.text
            ? { ...finalScan, aiSummary: ai.text }
            : { ...finalScan, aiFailed: true };
        } catch (err) {
          console.error('AI explanation failed:', err);
          finalScan = { ...finalScan, aiFailed: true };
        }
      }

      setScans((prev) => [finalScan, ...prev]);
      setSelectedScan(finalScan);
    } catch (err) {
      console.error('Scan request failed:', err);
      setError('Could not reach the scan service. It may be waking up, so try again in a minute.');
    } finally {
      setIsLoading(false);
    }
  };

  let page;
  if (selectedScan) {
    page = <ScanDetail scan={selectedScan} onBack={() => setSelectedScan(null)} />;
  } else if (view === 'insights') {
    page = <Insights />;
  } else if (view === 'scans') {
    page = (
      <div className="page">
        <header className="page-head">
          <h1>All scans</h1>
          <p className="muted">Every site scanned in this session. Select one to see its full report.</p>
        </header>
        <ScansList scans={scans} onSelect={setSelectedScan} />
      </div>
    );
  } else {
    page = (
      <div className="page">
        <header className="page-head">
          <h1>Check a government website</h1>
          <p className="muted">
            Find out what stops people from using a site, and how to fix it.
          </p>
        </header>

        <ScanInput onScan={handleScan} disabled={isLoading} />

        {isLoading && <LoadingState />}
        {error && <ErrorState message={error} />}

        <StatsCards scans={scans} />

        <section aria-labelledby="recent-title">
          <div className="section-head">
            <h2 id="recent-title">Recent scans</h2>
            {scans.length > 5 && (
              <button type="button" className="link-btn" onClick={() => navigate('scans')}>
                View all
              </button>
            )}
          </div>
          <ScansList scans={scans} onSelect={setSelectedScan} limit={5} />
        </section>
      </div>
    );
  }

  return (
    <div className="shell">
      <a className="skip-link" href="#main">Skip to main content</a>
      <Sidebar view={selectedScan ? null : view} onNavigate={navigate} />
      <main id="main" tabIndex={-1}>
        {page}
      </main>
    </div>
  );
}

export default App;
