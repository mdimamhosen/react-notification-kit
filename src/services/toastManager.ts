import React from 'react';
import { Toast, ToastOptions, ToastType } from '../types';

type ToastSubscriber = (toasts: Toast[]) => void;

export class ToastManager {
  private toasts: Toast[] = [];
  private subscribers: Set<ToastSubscriber> = new Set();
  private idCounter = 0;
  private maxVisible = 10;
  private defaultOptions: Required<Omit<ToastOptions, 'id' | 'icon' | 'customClass'>> = {
    duration: 4000,
    position: 'top-right',
    closeButton: true,
    progressBar: true,
    pauseOnHover: true,
    animation: 'slide',
    theme: 'system',
  };

  public subscribe(subscriber: ToastSubscriber): () => void {
    this.subscribers.add(subscriber);
    subscriber([...this.toasts]);
    return () => {
      this.subscribers.delete(subscriber);
    };
  }

  private notify() {
    const activeToasts = [...this.toasts];
    this.subscribers.forEach((sub) => sub(activeToasts));
  }

  public setGlobalConfig(config: Partial<ToastOptions> & { maxVisible?: number }) {
    if (config.maxVisible !== undefined) {
      this.maxVisible = config.maxVisible;
    }
    const { maxVisible, ...options } = config;
    this.defaultOptions = {
      ...this.defaultOptions,
      ...options,
    };
  }

  private generateId(): string {
    this.idCounter += 1;
    return `toast_${this.idCounter}`;
  }

  public add(
    message: React.ReactNode,
    type: ToastType,
    options: ToastOptions = {}
  ): string | number {
    const id = options.id ?? this.generateId();
    const existingIndex = this.toasts.findIndex((t) => t.id === id);

    const mergedOptions: Toast = {
      id,
      type,
      message,
      duration: options.duration ?? (type === 'loading' ? 0 : this.defaultOptions.duration),
      position: options.position ?? this.defaultOptions.position,
      icon: options.icon,
      closeButton: options.closeButton ?? this.defaultOptions.closeButton,
      progressBar: options.progressBar ?? this.defaultOptions.progressBar,
      pauseOnHover: options.pauseOnHover ?? this.defaultOptions.pauseOnHover,
      animation: options.animation ?? this.defaultOptions.animation,
      theme: options.theme ?? this.defaultOptions.theme,
      customClass: options.customClass,
      createdAt: Date.now(),
    };

    if (existingIndex > -1) {
      // Update existing toast in place (duplicate prevention/update)
      this.toasts[existingIndex] = mergedOptions;
    } else {
      // Add new toast
      this.toasts.push(mergedOptions);

      // Apply maxVisible constraint
      const activeToasts = this.toasts.filter(t => !t.isDismissed);
      if (activeToasts.length > this.maxVisible) {
        // Find the oldest non-dismissed toast and mark it dismissed
        const oldest = activeToasts[0];
        if (oldest) {
          this.dismiss(oldest.id);
        }
      }
    }

    this.notify();
    return id;
  }

  public success(message: React.ReactNode, options?: ToastOptions): string | number {
    return this.add(message, 'success', options);
  }

  public error(message: React.ReactNode, options?: ToastOptions): string | number {
    return this.add(message, 'error', options);
  }

  public warning(message: React.ReactNode, options?: ToastOptions): string | number {
    return this.add(message, 'warning', options);
  }

  public info(message: React.ReactNode, options?: ToastOptions): string | number {
    return this.add(message, 'info', options);
  }

  public loading(message: React.ReactNode, options?: ToastOptions): string | number {
    // default loading to infinite duration if not specified
    const loadingOptions = { duration: 0, ...options };
    return this.add(message, 'loading', loadingOptions);
  }

  public custom(message: React.ReactNode, options?: ToastOptions): string | number {
    return this.add(message, 'custom', options);
  }

  public dismiss(id: string | number) {
    const index = this.toasts.findIndex((t) => t.id === id);
    if (index > -1) {
      this.toasts[index] = { ...this.toasts[index], isDismissed: true };
      this.notify();

      // Clean up after animation finishes (e.g. 500ms)
      setTimeout(() => {
        this.remove(id);
      }, 500);
    }
  }

  private remove(id: string | number) {
    this.toasts = this.toasts.filter((t) => t.id !== id);
    this.notify();
  }

  public clear() {
    this.toasts = [];
    this.notify();
  }

  public promise<T>(
    promise: Promise<T> | (() => Promise<T>),
    msgs: {
      loading: React.ReactNode;
      success: React.ReactNode | ((data: T) => React.ReactNode);
      error: React.ReactNode | ((err: any) => React.ReactNode);
    },
    options?: ToastOptions
  ): Promise<T> {
    const id = options?.id ?? this.generateId();
    this.loading(msgs.loading, { ...options, id });

    const actualPromise = typeof promise === 'function' ? promise() : promise;

    return actualPromise
      .then((data) => {
        const successMsg = typeof msgs.success === 'function' 
          ? (msgs.success as (data: T) => React.ReactNode)(data)
          : msgs.success;
        this.success(successMsg, { ...options, id });
        return data;
      })
      .catch((err) => {
        const errorMsg = typeof msgs.error === 'function'
          ? (msgs.error as (err: any) => React.ReactNode)(err)
          : msgs.error;
        this.error(errorMsg, { ...options, id });
        throw err;
      });
  }
}

export const toast = new ToastManager();
