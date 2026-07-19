import React, { useEffect, useCallback } from 'react';
import { ModalInstance } from '../../types';
import { modalManager } from '../../services/modalManager';

export interface AlertDialogProps {
  modal: ModalInstance;
}

export const AlertDialog: React.FC<AlertDialogProps> = ({ modal }) => {
  const {
    id,
    title,
    message,
    type = 'info',
    confirmText = 'Close',
    onConfirm,
    showCloseButton = true,
  } = modal;

  const handleClose = useCallback(() => {
    if (onConfirm) {
      onConfirm();
    } else {
      modalManager.dismiss(id);
    }
  }, [id, onConfirm]);

  // ENTER key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return (
          <div className="rnk-dialog-icon rnk-icon-bg-success">
            <svg
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      case 'error':
        return (
          <div className="rnk-dialog-icon rnk-icon-bg-error">
            <svg
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        );
      case 'warning':
        return (
          <div className="rnk-dialog-icon rnk-icon-bg-warning">
            <svg
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        );
      case 'loading':
        return (
          <div className="rnk-dialog-icon rnk-icon-bg-loading">
            <span className="rnk-spinner rnk-spinner-large"></span>
          </div>
        );
      case 'info':
      default:
        return (
          <div className="rnk-dialog-icon rnk-icon-bg-info">
            <svg
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        );
    }
  };

  const getButtonThemeClass = () => {
    if (type === 'success') return 'rnk-btn-success';
    if (type === 'error') return 'rnk-btn-error';
    if (type === 'warning') return 'rnk-btn-warning';
    return 'rnk-btn-primary';
  };

  return (
    <>
      <div className="rnk-modal-header">
        <h2 className="rnk-modal-title" id={`modal-title-${id}`}>
          {title || 'Notification'}
        </h2>
        {showCloseButton && type !== 'loading' && (
          <button
            className="rnk-modal-header-close"
            onClick={handleClose}
            aria-label="Close notification"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        )}
      </div>

      <div className="rnk-modal-body-scrollable" id={`modal-body-${id}`}>
        <div className="rnk-dialog-layout">
          {getIcon()}
          <div className="rnk-dialog-details">
            <div className="rnk-dialog-message">{message}</div>
          </div>
        </div>
      </div>

      <div className="rnk-modal-footer">
        {type !== 'loading' && (
          <button
            className={`rnk-btn ${getButtonThemeClass()}`}
            onClick={handleClose}
            data-testid="alert-close-btn"
          >
            {confirmText}
          </button>
        )}
      </div>
    </>
  );
};
