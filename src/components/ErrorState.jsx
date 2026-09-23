function ErrorState({ message }) {
  return (
    <div className="error-state">
      <p>{message || 'Something went wrong while scanning this site.'}</p>
    </div>
  );
}

export default ErrorState;