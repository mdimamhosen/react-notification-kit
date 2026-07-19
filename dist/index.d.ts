import React$1 from 'react';

type ToastType = 'success' | 'error' | 'warning' | 'info' | 'loading' | 'custom';
type ToastPosition = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
type ToastAnimation = 'fade' | 'slide' | 'zoom' | 'bounce';
type NotificationTheme = 'light' | 'dark' | 'system' | 'custom';
interface ToastOptions {
    id?: string | number;
    duration?: number;
    position?: ToastPosition;
    icon?: React$1.ReactNode;
    closeButton?: boolean;
    progressBar?: boolean;
    pauseOnHover?: boolean;
    animation?: ToastAnimation;
    theme?: NotificationTheme;
    customClass?: string;
}
interface Toast {
    id: string | number;
    type: ToastType;
    message: React$1.ReactNode;
    duration: number;
    position: ToastPosition;
    icon?: React$1.ReactNode;
    closeButton: boolean;
    progressBar: boolean;
    pauseOnHover: boolean;
    animation: ToastAnimation;
    theme: NotificationTheme;
    customClass?: string;
    createdAt: number;
    isDismissed?: boolean;
}
type ModalType = 'success' | 'error' | 'warning' | 'info' | 'question' | 'danger' | 'loading' | 'custom';
type ModalSize = 'small' | 'medium' | 'large' | 'fullscreen' | 'custom';
type ModalPosition = 'center' | 'top' | 'bottom';
type ModalAnimation = 'fade' | 'slide' | 'zoom' | 'scale' | 'bounce';
interface ModalOptions {
    id?: string | number;
    type?: ModalType;
    title?: React$1.ReactNode;
    message?: React$1.ReactNode;
    size?: ModalSize;
    position?: ModalPosition;
    animation?: ModalAnimation;
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => void | Promise<void>;
    onCancel?: () => void;
    content?: React$1.ReactNode;
    closeOnOverlayClick?: boolean;
    closeOnEsc?: boolean;
    showCloseButton?: boolean;
    theme?: NotificationTheme;
    customClass?: string;
}
interface ModalInstance extends Omit<ModalOptions, 'id'> {
    id: string | number;
    isOpen: boolean;
    isLoading?: boolean;
}
interface ConfirmOptions extends Omit<ModalOptions, 'type'> {
    type?: 'success' | 'error' | 'warning' | 'info' | 'question' | 'danger';
}
interface GlobalConfig {
    toast?: Partial<ToastOptions> & {
        maxVisible?: number;
    };
    modal?: Partial<ModalOptions>;
    theme?: NotificationTheme;
}

interface NotificationProviderProps {
    children: React$1.ReactNode;
    theme?: NotificationTheme;
    position?: ToastPosition;
    toastConfig?: Partial<ToastOptions> & {
        maxVisible?: number;
    };
    modalConfig?: Partial<ModalOptions>;
}
declare const NotificationContext: React$1.Context<null>;
declare const NotificationProvider: React$1.FC<NotificationProviderProps>;

type ToastSubscriber = (toasts: Toast[]) => void;
declare class ToastManager {
    private toasts;
    private subscribers;
    private idCounter;
    private maxVisible;
    private defaultOptions;
    subscribe(subscriber: ToastSubscriber): () => void;
    private notify;
    setGlobalConfig(config: Partial<ToastOptions> & {
        maxVisible?: number;
    }): void;
    private generateId;
    add(message: React$1.ReactNode, type: ToastType, options?: ToastOptions): string | number;
    success(message: React$1.ReactNode, options?: ToastOptions): string | number;
    error(message: React$1.ReactNode, options?: ToastOptions): string | number;
    warning(message: React$1.ReactNode, options?: ToastOptions): string | number;
    info(message: React$1.ReactNode, options?: ToastOptions): string | number;
    loading(message: React$1.ReactNode, options?: ToastOptions): string | number;
    custom(message: React$1.ReactNode, options?: ToastOptions): string | number;
    dismiss(id: string | number): void;
    private remove;
    clear(): void;
    promise<T>(promise: Promise<T> | (() => Promise<T>), msgs: {
        loading: React$1.ReactNode;
        success: React$1.ReactNode | ((data: T) => React$1.ReactNode);
        error: React$1.ReactNode | ((err: any) => React$1.ReactNode);
    }, options?: ToastOptions): Promise<T>;
}
declare const toast: ToastManager;

declare const notify: ((options: ModalOptions) => string | number) & {
    success: (options: Omit<ModalOptions, "type">) => string | number;
    error: (options: Omit<ModalOptions, "type">) => string | number;
    warning: (options: Omit<ModalOptions, "type">) => string | number;
    info: (options: Omit<ModalOptions, "type">) => string | number;
    question: (options: Omit<ModalOptions, "type">) => string | number;
    danger: (options: Omit<ModalOptions, "type">) => string | number;
    loading: (options: Omit<ModalOptions, "type">) => string | number;
    custom: (content: React$1.ReactNode, options?: Omit<ModalOptions, "type" | "content">) => string | number;
    promise: <T>(promise: Promise<T> | (() => Promise<T>), msgs: {
        loading: React$1.ReactNode;
        success: React$1.ReactNode;
        error: React$1.ReactNode;
    }, options?: Omit<ModalOptions, "type">) => Promise<T>;
    dismiss: (id: string | number) => void;
    clear: () => void;
};
declare const confirm: (options: ConfirmOptions) => Promise<boolean>;

declare const useToast: () => ToastManager;

declare const useModal: () => {
    open: ((options: ModalOptions) => string | number) & {
        success: (options: Omit<ModalOptions, "type">) => string | number;
        error: (options: Omit<ModalOptions, "type">) => string | number;
        warning: (options: Omit<ModalOptions, "type">) => string | number;
        info: (options: Omit<ModalOptions, "type">) => string | number;
        question: (options: Omit<ModalOptions, "type">) => string | number;
        danger: (options: Omit<ModalOptions, "type">) => string | number;
        loading: (options: Omit<ModalOptions, "type">) => string | number;
        custom: (content: React.ReactNode, options?: Omit<ModalOptions, "type" | "content">) => string | number;
        promise: <T>(promise: Promise<T> | (() => Promise<T>), msgs: {
            loading: React.ReactNode;
            success: React.ReactNode;
            error: React.ReactNode;
        }, options?: Omit<ModalOptions, "type">) => Promise<T>;
        dismiss: (id: string | number) => void;
        clear: () => void;
    };
    confirm: (options: ConfirmOptions) => Promise<boolean>;
    success: (options: Omit<ModalOptions, "type">) => string | number;
    error: (options: Omit<ModalOptions, "type">) => string | number;
    warning: (options: Omit<ModalOptions, "type">) => string | number;
    info: (options: Omit<ModalOptions, "type">) => string | number;
    question: (options: Omit<ModalOptions, "type">) => string | number;
    danger: (options: Omit<ModalOptions, "type">) => string | number;
    custom: (content: React.ReactNode, options?: Omit<ModalOptions, "type" | "content">) => string | number;
    promise: <T>(promise: Promise<T> | (() => Promise<T>), msgs: {
        loading: React.ReactNode;
        success: React.ReactNode;
        error: React.ReactNode;
    }, options?: Omit<ModalOptions, "type">) => Promise<T>;
    dismiss: (id: string | number) => void;
    clear: () => void;
};

interface AlertDialogProps {
    modal: ModalInstance;
}
declare const AlertDialog: React$1.FC<AlertDialogProps>;

interface ConfirmDialogProps {
    modal: ModalInstance;
}
declare const ConfirmDialog: React$1.FC<ConfirmDialogProps>;

interface ToastItemProps {
    toast: Toast;
}
declare const ToastItem: React$1.FC<ToastItemProps>;

interface ToastContainerProps {
    toasts: Toast[];
}
declare const ToastContainer: React$1.FC<ToastContainerProps>;

interface ModalItemProps {
    modal: ModalInstance;
    children: React$1.ReactNode;
}
declare const ModalItem: React$1.FC<ModalItemProps>;

interface ModalContainerProps {
    modals: ModalInstance[];
}
declare const ModalContainer: React$1.FC<ModalContainerProps>;

export { AlertDialog as AlertModal, ConfirmDialog, type ConfirmOptions, type GlobalConfig, type ModalAnimation, ModalContainer, type ModalInstance, ModalItem, type ModalOptions, type ModalPosition, type ModalSize, type ModalType, NotificationContext, NotificationProvider, type NotificationTheme, type Toast, type ToastAnimation, ToastContainer, ToastItem, type ToastOptions, type ToastPosition, type ToastType, confirm, notify, toast, useModal, useToast };
