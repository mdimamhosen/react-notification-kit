import React from 'react';
import { ModalInstance, ModalOptions, ModalType, ConfirmOptions } from '../types';

type ModalSubscriber = (modals: ModalInstance[]) => void;

class ModalManager {
  private modals: ModalInstance[] = [];
  private subscribers: Set<ModalSubscriber> = new Set();
  private idCounter = 0;

  public subscribe(subscriber: ModalSubscriber): () => void {
    this.subscribers.add(subscriber);
    subscriber([...this.modals]);
    return () => {
      this.subscribers.delete(subscriber);
    };
  }

  private notify() {
    this.subscribers.forEach((sub) => sub([...this.modals]));
  }

  private generateId(): string {
    this.idCounter += 1;
    return `modal_${this.idCounter}`;
  }

  public open(options: ModalOptions): string | number {
    const id = options.id ?? this.generateId();
    
    const instance: ModalInstance = {
      ...options,
      id,
      isOpen: true,
      isLoading: false,
    };

    // Close any duplicate ID modal
    this.modals = this.modals.filter((m) => m.id !== id);
    this.modals.push(instance);
    this.notify();
    return id;
  }

  public update(id: string | number, updates: Partial<ModalInstance>) {
    this.modals = this.modals.map((m) => {
      if (m.id === id) {
        return { ...m, ...updates };
      }
      return m;
    });
    this.notify();
  }

  public dismiss(id: string | number) {
    const instance = this.modals.find((m) => m.id === id);
    if (instance) {
      this.update(id, { isOpen: false });
      
      // Clean up after exit transition (e.g. 400ms)
      setTimeout(() => {
        this.remove(id);
      }, 400);
    }
  }

  private remove(id: string | number) {
    this.modals = this.modals.filter((m) => m.id !== id);
    this.notify();
  }

  public clear() {
    this.modals = [];
    this.notify();
  }

  // notify standard types helper
  public createTypeHelper(type: ModalType) {
    return (options: Omit<ModalOptions, 'type'>): string | number => {
      return this.open({ ...options, type });
    };
  }

  public custom(content: React.ReactNode, options?: Omit<ModalOptions, 'type' | 'content'>): string | number {
    return this.open({
      ...options,
      type: 'custom',
      content,
    });
  }

  // Async modal promise handler
  public promise<T>(
    promise: Promise<T> | (() => Promise<T>),
    msgs: {
      loading: React.ReactNode;
      success: React.ReactNode;
      error: React.ReactNode;
    },
    options?: Omit<ModalOptions, 'type'>
  ): Promise<T> {
    const id = options?.id ?? this.generateId();

    this.open({
      ...options,
      id,
      type: 'loading',
      title: options?.title ?? 'Processing',
      message: msgs.loading,
      closeOnEsc: false,
      closeOnOverlayClick: false,
      showCloseButton: false,
    });

    const actualPromise = typeof promise === 'function' ? promise() : promise;

    return actualPromise
      .then((data) => {
        this.update(id, {
          type: 'success',
          title: options?.title ?? 'Success',
          message: msgs.success,
          closeOnEsc: true,
          closeOnOverlayClick: true,
          showCloseButton: true,
        });
        return data;
      })
      .catch((err) => {
        this.update(id, {
          type: 'error',
          title: options?.title ?? 'Error',
          message: msgs.error,
          closeOnEsc: true,
          closeOnOverlayClick: true,
          showCloseButton: true,
        });
        throw err;
      });
  }
}

export const modalManager = new ModalManager();

export const notify = Object.assign(
  (options: ModalOptions) => modalManager.open(options),
  {
    success: modalManager.createTypeHelper('success'),
    error: modalManager.createTypeHelper('error'),
    warning: modalManager.createTypeHelper('warning'),
    info: modalManager.createTypeHelper('info'),
    question: modalManager.createTypeHelper('question'),
    danger: modalManager.createTypeHelper('danger'),
    loading: modalManager.createTypeHelper('loading'),
    custom: modalManager.custom.bind(modalManager),
    promise: modalManager.promise.bind(modalManager),
    dismiss: (id: string | number) => modalManager.dismiss(id),
    clear: () => modalManager.clear(),
  }
);

// confirm helper
export const confirm = (options: ConfirmOptions): Promise<boolean> => {
  return new Promise<boolean>((resolve) => {
    const id = options.id ?? `confirm_${Date.now()}`;

    modalManager.open({
      ...options,
      id,
      type: options.type ?? 'question',
      onConfirm: async () => {
        if (options.onConfirm) {
          modalManager.update(id, { isLoading: true });
          try {
            await options.onConfirm();
            modalManager.dismiss(id);
            resolve(true);
          } catch (err) {
            modalManager.update(id, { isLoading: false });
            // Let the caller handle error (or we could show warning/error state)
            // We do not close the modal so they can fix it or cancel
          }
        } else {
          modalManager.dismiss(id);
          resolve(true);
        }
      },
      onCancel: () => {
        if (options.onCancel) {
          options.onCancel();
        }
        modalManager.dismiss(id);
        resolve(false);
      },
    });
  });
};
