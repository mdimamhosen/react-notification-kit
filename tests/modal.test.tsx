import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { NotificationProvider, notify, confirm } from '../src';

describe('Modal & Confirm System', () => {
  beforeEach(() => {
    notify.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('opens and closes a modal notification', () => {
    render(
      <NotificationProvider>
        <div>App</div>
      </NotificationProvider>
    );

    act(() => {
      notify.success({
        title: 'Payment Successful',
        message: 'Your order is confirmed',
      });
    });

    expect(screen.getByText('Payment Successful')).toBeInTheDocument();
    expect(screen.getByText('Your order is confirmed')).toBeInTheDocument();

    const closeBtn = screen.getByTestId('alert-close-btn');
    fireEvent.click(closeBtn);

    // wait for transition time (400ms)
    act(() => {
      vi.advanceTimersByTime(400);
    });

    expect(screen.queryByText('Payment Successful')).not.toBeInTheDocument();
  });

  it('triggers confirmation callback and resolves promise to true', async () => {
    render(
      <NotificationProvider>
        <div>App</div>
      </NotificationProvider>
    );

    let confirmResult: boolean | null = null;
    const onConfirmMock = vi.fn();

    const testConfirm = async () => {
      const res = await confirm({
        title: 'Delete user',
        message: 'Are you sure?',
        onConfirm: onConfirmMock,
      });
      confirmResult = res;
    };

    act(() => {
      testConfirm();
    });

    expect(screen.getByText('Delete user')).toBeInTheDocument();

    const confirmBtn = screen.getByTestId('confirm-submit-btn');
    fireEvent.click(confirmBtn);

    // flush promises so the async callbacks can execute and call modalManager.dismiss
    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });

    // wait for transition
    act(() => {
      vi.advanceTimersByTime(400);
    });

    expect(onConfirmMock).toHaveBeenCalled();
    expect(confirmResult).toBe(true);
    expect(screen.queryByText('Delete user')).not.toBeInTheDocument();
  });

  it('triggers cancel callback and resolves promise to false', async () => {
    render(
      <NotificationProvider>
        <div>App</div>
      </NotificationProvider>
    );

    let confirmResult: boolean | null = null;
    const onCancelMock = vi.fn();

    const testConfirm = async () => {
      const res = await confirm({
        title: 'Delete user',
        message: 'Are you sure?',
        onCancel: onCancelMock,
      });
      confirmResult = res;
    };

    act(() => {
      testConfirm();
    });

    const cancelBtn = screen.getByTestId('confirm-cancel-btn');
    fireEvent.click(cancelBtn);

    act(() => {
      vi.advanceTimersByTime(400);
    });

    await act(async () => {
      await Promise.resolve();
    });

    expect(onCancelMock).toHaveBeenCalled();
    expect(confirmResult).toBe(false);
  });

  it('supports ESC key closing', () => {
    render(
      <NotificationProvider>
        <div>App</div>
      </NotificationProvider>
    );

    act(() => {
      notify({
        id: 'esc-modal',
        title: 'ESC Close Test',
        message: 'Press ESC to close',
        closeOnEsc: true,
      });
    });

    expect(screen.getByText('ESC Close Test')).toBeInTheDocument();

    fireEvent.keyDown(window, { key: 'Escape', code: 'Escape' });

    act(() => {
      vi.advanceTimersByTime(400);
    });

    expect(screen.queryByText('ESC Close Test')).not.toBeInTheDocument();
  });

  it('supports outside backdrop click closing', () => {
    render(
      <NotificationProvider>
        <div>App</div>
      </NotificationProvider>
    );

    act(() => {
      notify({
        id: 'overlay-modal',
        title: 'Overlay Click Test',
        message: 'Click backdrop to close',
        closeOnOverlayClick: true,
      });
    });

    expect(screen.getByText('Overlay Click Test')).toBeInTheDocument();

    const overlay = screen.getByTestId('modal-overlay');
    fireEvent.click(overlay);

    act(() => {
      vi.advanceTimersByTime(400);
    });

    expect(screen.queryByText('Overlay Click Test')).not.toBeInTheDocument();
  });

  it('shows loading state for async confirm callback', async () => {
    render(
      <NotificationProvider>
        <div>App</div>
      </NotificationProvider>
    );

    let resolveConfirm: () => void = () => {};
    const asyncConfirmPromise = new Promise<void>((resolve) => {
      resolveConfirm = resolve;
    });

    const onConfirmMock = vi.fn().mockImplementation(() => asyncConfirmPromise);

    act(() => {
      confirm({
        id: 'async-confirm',
        title: 'Delete Database',
        message: 'Dangerous action',
        onConfirm: onConfirmMock,
      });
    });

    const confirmBtn = screen.getByTestId('confirm-submit-btn');
    fireEvent.click(confirmBtn);

    // spinner should be visible
    expect(screen.getByTestId('confirm-spinner')).toBeInTheDocument();
    expect(confirmBtn).toBeDisabled();

    await act(async () => {
      resolveConfirm();
      await asyncConfirmPromise;
    });

    act(() => {
      vi.advanceTimersByTime(400);
    });

    expect(screen.queryByText('Delete Database')).not.toBeInTheDocument();
  });
});
