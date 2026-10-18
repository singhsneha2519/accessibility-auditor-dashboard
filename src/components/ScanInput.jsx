import { useState } from 'react';
import { Search } from 'lucide-react';

const EXAMPLES = ['suratmunicipal.gov.in', 'gujaratcybercrime.org'];

function ScanInput({ onScan, disabled }) {
  const [value, setValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    const url = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    onScan(url);
  };

  return (
    <form className="scan-form card" onSubmit={handleSubmit}>
      <label htmlFor="scan-url" className="scan-label">
        Website to check
      </label>
      <div className="scan-controls">
        <input
          id="scan-url"
          type="text"
          inputMode="url"
          autoComplete="off"
          placeholder="https://example.gov.in"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button type="submit" className="btn btn-primary" disabled={disabled || !value.trim()}>
          <Search size={18} aria-hidden="true" />
          {disabled ? 'Scanning…' : 'Scan site'}
        </button>
      </div>
      <p className="scan-examples">
        Try one that scans reliably:
        {EXAMPLES.map((ex) => (
          <button key={ex} type="button" className="chip" onClick={() => setValue(ex)}>
            {ex}
          </button>
        ))}
      </p>
    </form>
  );
}

export default ScanInput;
