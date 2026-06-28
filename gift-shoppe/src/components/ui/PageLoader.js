import React from 'react';
import './PageLoader.css';

function PageLoader() {
  return (
    <div className="page-loader" role="status" aria-live="polite" aria-label="Loading page">
      <div className="page-loader__spinner" aria-hidden="true" />
      <p>Loading…</p>
    </div>
  );
}

export default PageLoader;
