import React, { useEffect, useState } from 'react';
import { toast } from '../services/toastManager';
import { modalManager } from '../services/modalManager';
import { Toast, ModalInstance, NotificationTheme, ToastPosition, ToastOptions, ModalOptions } from '../types';
import { ToastContainer } from '../components/Toast/ToastContainer';
import { ModalContainer } from '../components/Modal/ModalContainer';

export interface NotificationProviderProps {
  children: React.ReactNode;
  theme?: NotificationTheme;
  position?: ToastPosition;
  toastConfig?: Partial<ToastOptions> & { maxVisible?: number };
  modalConfig?: Partial<ModalOptions>;
}

export const NotificationContext = React.createContext<null>(null);

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
  theme = 'system',
  position = 'top-right',
  toastConfig,
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [modals, setModals] = useState<ModalInstance[]>([]);

  // Update managers when global props change
  useEffect(() => {
    toast.setGlobalConfig({
      theme,
      position,
      ...toastConfig,
    });
  }, [theme, position, toastConfig]);

  // Subscribe to toast & modal stores
  useEffect(() => {
    const unsubscribeToasts = toast.subscribe((updatedToasts) => {
      setToasts(updatedToasts);
    });

    const unsubscribeModals = modalManager.subscribe((updatedModals) => {
      setModals(updatedModals);
    });

    return () => {
      unsubscribeToasts();
      unsubscribeModals();
    };
  }, []);

  return (
    <NotificationContext.Provider value={null}>
      {children}
      <ToastContainer toasts={toasts} />
      <ModalContainer modals={modals} />
    </NotificationContext.Provider>
  );
};
