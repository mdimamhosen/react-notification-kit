import React, { useEffect, useState, useRef } from 'react';
import { Toast } from '../../types';
import { toast } from '../../services/toastManager';

export interface ToastItemProps {
  toast: Toast;
}

export const ToastItem: React.FC<ToastItemProps> = ({ toast: item }) => {
  const {
    id,
    type,
    message,
    duration,
    progressBar,
    pauseOnHover,
    closeButton,
    animation,
    theme,
    customClass,
    icon,
    position,
  } = item;

  const [timeLeft, setTimeLeft] = useState(duration);
  const [isPaused, setIsPaused] = useState(false);
  const isDismissing = !!item.isDismissed;
  const timerRef = useRef<any>(null);
  const lastTickRef = useRef<number>(Date.now());
  const timeLeftRef = useRef<number>(duration);

  useEffect(() => {
    if (duration <= 0) return;

    lastTickRef.current = Date.now();
    timeLeftRef.current = duration;

    const tick = () => {
      if (isPaused) {
        lastTickRef.current = Date.now();
        return;
      }
      const now = Date.now();
      const elapsed = now - lastTickRef.current;
      lastTickRef.current = now;

      const nextTime = Math.max(0, timeLeftRef.current - elapsed);
      timeLeftRef.current = nextTime;
      setTimeLeft(nextTime);

      if (nextTime <= 0) {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
        toast.dismiss(id);
      }
    };

    timerRef.current = setInterval(tick, 20);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [id, duration, isPaused]);

  const handleMouseEnter = () => {
    if (pauseOnHover && duration > 0) {
      setIsPaused(true);
    }
  };

  const handleMouseLeave = () => {
    if (pauseOnHover && duration > 0) {
      lastTickRef.current = Date.now();
      setIsPaused(false);
    }
  };

  const handleClose = () => {
    toast.dismiss(id);
  };

  const getDefaultIcon = () => {
    if (icon) return icon;
    switch (type) {
      case 'success':
        return (
          <svg
            width="20"
            height="20"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
            style={{ color: 'var(--rnk-success)' }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'error':
        return (
          <svg
            width="20"
            height="20"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
            style={{ color: 'var(--rnk-error)' }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      case 'warning':
        return (
          <svg
            width="20"
            height="20"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
            style={{ color: 'var(--rnk-warning)' }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        );
      case 'info':
        return (
          <svg
            width="20"
            height="20"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
            style={{ color: 'var(--rnk-info)' }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      case 'loading':
        return (
          <span
            className="rnk-spinner"
            style={{
              borderTopColor: 'var(--rnk-primary)',
              borderLeftColor: 'rgba(59,130,246,0.2)',
              borderRightColor: 'rgba(59,130,246,0.2)',
              borderBottomColor: 'rgba(59,130,246,0.2)',
            }}
          ></span>
        );
      default:
        return null;
    }
  };

  const getAnimationClass = () => {
    const isTop = position.startsWith('top');
    const isRight = position.endsWith('right');
    const isCenter = position.endsWith('center');

    if (isDismissing) {
      if (animation === 'slide') {
        if (isCenter) return isTop ? 'rnk-animate-slide-out-top' : 'rnk-animate-slide-out-bottom';
        return isRight ? 'rnk-animate-slide-out-right' : 'rnk-animate-slide-out-left';
      }
      return `rnk-animate-${animation}-out`;
    } else {
      if (animation === 'slide') {
        if (isCenter) return isTop ? 'rnk-animate-slide-in-top' : 'rnk-animate-slide-in-bottom';
        return isRight ? 'rnk-animate-slide-in-right' : 'rnk-animate-slide-in-left';
      }
      return `rnk-animate-${animation}-in`;
    }
  };

  const progressPercent = duration > 0 ? (timeLeft / duration) * 100 : 0;

  return (
    <div
      className={`rnk-toast-item rnk-toast-${type} rnk-toast-theme-${theme} ${getAnimationClass()} ${customClass || ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="alert"
      aria-live={type === 'error' || type === 'warning' ? 'assertive' : 'polite'}
      style={{ overflowWrap: 'break-word', wordBreak: 'break-word' }}
    >
      <div className="rnk-toast-content-wrapper">
        {type !== 'custom' && (
          <div className="rnk-toast-icon" data-testid="toast-icon">
            {getDefaultIcon()}
          </div>
        )}
        <div className="rnk-toast-message">{message}</div>
        {closeButton && (
          <button className="rnk-toast-close" onClick={handleClose} aria-label="Close notification">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        )}
      </div>
      {progressBar && duration > 0 && (
        <div
          className="rnk-toast-progress-bar"
          style={{ transform: `scaleX(${progressPercent / 100})` }}
          data-testid="toast-progress-bar"
        />
      )}
    </div>
  );
};
