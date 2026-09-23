import { useState } from 'react';
import ScanInput from './components/ScanInput';
import StatsCards from './components/StatsCards';
import ScansList from './components/ScansList';
import ScanDetail from './components/ScanDetail';
import LoadingState from './components/LoadingState';
import ErrorState from './components/ErrorState';
import { scanUrl } from './api/scanApi';
import './App.css';

function App() {
  const [scans, setScans] = useState([]);
  const [selectedScan, setSelectedScan] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleScan = async (url) => {
    setIsLoading(true);
    setError(null);

    const { ok, data } = await scanUrl(url);

    if (ok) {
      setScans((prev) => [...prev, data]);
    } else {
      setError(data.error || 'Scan failed');
    }

    setIsLoading(false);
  };

  return (
    <div className="app">
      <h1>Accessibility auditor</h1>

      <ScanInput onScan={handleScan} />

      {isLoading && <LoadingState />}
      {error && <ErrorState message={error} />}

      {!selectedScan && (
        <>
          <StatsCards scans={scans} />
          <ScansList scans={scans} onSelectScan={setSelectedScan} />
        </>
      )}

      {selectedScan && (
        <ScanDetail scan={selectedScan} onBack={() => setSelectedScan(null)} />
      )}
    </div>
  );
}

export default App;