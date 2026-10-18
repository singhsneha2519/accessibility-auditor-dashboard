import { TriangleAlert } from 'lucide-react';

function ErrorState({ message }) {
  return (
    <div className="status status-error card" role="alert">
      <TriangleAlert size={22} aria-hidden="true" />
      <div>
        <p className="status-title">The scan didn’t finish</p>
        <p>{message || 'Something went wrong while scanning this site. Check the address and try again.'}</p>
      </div>
    </div>
  );
}

export default ErrorState;
