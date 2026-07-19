import React from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'loading' | 'custom';

export type ToastPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

export type ToastAnimation = 'fade' | 'slide' | 'zoom' | 'bounce';

export type NotificationTheme = 'light' | 'dark' | 'system' | 'custom';

export interface ToastOptions {
  id?: string | number;
  duration?: number;
  position?: ToastPosition;
  icon?: React.ReactNode;
  closeButton?: boolean;
  progressBar?: boolean;
  pauseOnHover?: boolean;
  animation?: ToastAnimation;
  theme?: NotificationTheme;
  customClass?: string;
}

export interface Toast {
  id: string | number;
  type: ToastType;
  message: React.ReactNode;
  duration: number;
  position: ToastPosition;
  icon?: React.ReactNode;
  closeButton: boolean;
  progressBar: boolean;
  pauseOnHover: boolean;
  animation: ToastAnimation;
  theme: NotificationTheme;
  customClass?: string;
  createdAt: number;
  isDismissed?: boolean;
}

export type ModalType =
  | 'success'
  | 'error'
  | 'warning'
  | 'info'
  | 'question'
  | 'danger'
  | 'loading'
  | 'custom';

export type ModalSize = 'small' | 'medium' | 'large' | 'fullscreen' | 'custom';

export type ModalPosition = 'center' | 'top' | 'bottom';

export type ModalAnimation = 'fade' | 'slide' | 'zoom' | 'scale' | 'bounce';

export interface ModalOptions {
  id?: string | number;
  type?: ModalType;
  title?: React.ReactNode;
  message?: React.ReactNode;
  size?: ModalSize;
  position?: ModalPosition;
  animation?: ModalAnimation;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
  content?: React.ReactNode;
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
  showCloseButton?: boolean;
  theme?: NotificationTheme;
  customClass?: string;
}

export interface ModalInstance extends Omit<ModalOptions, 'id'> {
  id: string | number;
  isOpen: boolean;
  isLoading?: boolean;
}

export interface ConfirmOptions extends Omit<ModalOptions, 'type'> {
  type?: 'success' | 'error' | 'warning' | 'info' | 'question' | 'danger';
}

export interface GlobalConfig {
  toast?: Partial<ToastOptions> & { maxVisible?: number };
  modal?: Partial<ModalOptions>;
  theme?: NotificationTheme;
}
