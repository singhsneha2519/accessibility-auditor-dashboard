function LoadingState() {
  return (
    <div className="status card" role="status" aria-live="polite">
      <span className="spinner" aria-hidden="true" />
      <div>
        <p className="status-title">Scanning the site and writing the summary</p>
        <p className="muted">This can take up to a minute. Slow government sites take longest.</p>
      </div>
    </div>
  );
}

export default LoadingState;
