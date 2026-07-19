import React, { useEffect, useRef } from 'react';
import { ModalInstance } from '../../types';
import { modalManager } from '../../services/modalManager';

export interface ModalItemProps {
  modal: ModalInstance;
  children: React.ReactNode;
}

export const ModalItem: React.FC<ModalItemProps> = ({ modal: item, children }) => {
  const {
    id,
    isOpen,
    size = 'medium',
    position = 'center',
    animation = 'scale',
    closeOnOverlayClick = true,
    closeOnEsc = true,
    theme = 'system',
    customClass = '',
  } = item;

  const isDismissing = !isOpen;
  const modalRef = useRef<HTMLDivElement>(null);

  // Scroll Lock & Scrollbar Layout Shift Prevention
  useEffect(() => {
    const originalPadding = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.classList.add('rnk-scroll-locked');
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      // Find how many modal portals are active in the document (exclude current one as it's unmounting)
      const portals = document.querySelectorAll('.rnk-modal-portal');
      if (portals.length <= 1) {
        document.body.classList.remove('rnk-scroll-locked');
        document.body.style.paddingRight = originalPadding;
      }
    };
  }, []);

  // Keyboard navigation & Focus trapping (WCAG)
  useEffect(() => {
    const modalElement = modalRef.current;
    if (!modalElement) return;

    // Save previous active element
    const previousActiveElement = document.activeElement as HTMLElement;

    // Selector for interactive elements
    const focusableSelector =
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

    // Focus the modal content box or first focusable element
    const focusableElements = modalElement.querySelectorAll(focusableSelector);
    const firstElement = focusableElements[0] as HTMLElement;

    if (firstElement) {
      firstElement.focus();
    } else {
      modalElement.focus();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        const elements = modalElement.querySelectorAll(focusableSelector);
        if (elements.length === 0) {
          e.preventDefault();
          return;
        }

        const first = elements[0] as HTMLElement;
        const last = elements[elements.length - 1] as HTMLElement;

        if (e.shiftKey) {
          if (document.activeElement === first) {
            last.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === last) {
            first.focus();
            e.preventDefault();
          }
        }
      }

      if (e.key === 'Escape' && closeOnEsc) {
        modalManager.dismiss(id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (previousActiveElement && typeof previousActiveElement.focus === 'function') {
        previousActiveElement.focus();
      }
    };
  }, [id, closeOnEsc]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      modalManager.dismiss(id);
    }
  };

  const getOverlayAnimationClass = () => {
    return isDismissing ? 'rnk-animate-fade-out-overlay' : 'rnk-animate-fade-in-overlay';
  };

  const getContentAnimationClass = () => {
    let animSuffix = isDismissing ? 'out' : 'in';
    
    if (animation === 'slide') {
      return isDismissing ? 'rnk-animate-slide-out-down' : 'rnk-animate-slide-in-up';
    }

    return `rnk-animate-${animation}-${animSuffix}`;
  };

  return (
    <div
      className={`rnk-modal-portal rnk-modal-pos-${position} rnk-modal-theme-${theme} rnk-container-root`}
      data-testid={`modal-portal-${id}`}
    >
      <div
        className={`rnk-modal-overlay ${getOverlayAnimationClass()}`}
        onClick={handleOverlayClick}
        data-testid="modal-overlay"
      />
      <div
        ref={modalRef}
        className={`rnk-modal-item-wrapper rnk-modal-size-${size} ${getContentAnimationClass()} ${customClass}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`modal-title-${id}`}
        aria-describedby={`modal-body-${id}`}
        tabIndex={-1}
      >
        {children}
      </div>
    </div>
  );
};
