import { useState } from 'react';

function ScanInput({ onScan }) {
  const [url, setUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (url) {
      onScan(url);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="https://example.gov.in"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <button type="submit">Scan site</button>
    </form>
  );
}

export default ScanInput;