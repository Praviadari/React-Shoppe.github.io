import React from 'react';
import { Link } from 'react-router-dom';
import './EmptyState.css';

function EmptyState({
  title,
  message,
  icon,
  actionLabel,
  actionTo,
  secondaryLabel,
  onSecondaryAction,
  role = 'status',
}) {
  return (
    <div className="empty-state" role={role}>
      {icon && (
        <span className="material-icons empty-state__icon" aria-hidden="true">
          {icon}
        </span>
      )}
      <h2>{title}</h2>
      <p>{message}</p>
      {(actionLabel || secondaryLabel) && (
        <div className="empty-state__actions">
          {actionLabel && actionTo && (
            <Link to={actionTo} className="empty-state__cta">
              {actionLabel}
            </Link>
          )}
          {secondaryLabel && onSecondaryAction && (
            <button
              type="button"
              className="empty-state__cta empty-state__cta--secondary"
              onClick={onSecondaryAction}
            >
              {secondaryLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default EmptyState;
