import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { NotificationProvider, toast } from '../src';

describe('Toast System', () => {
  beforeEach(() => {
    toast.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('creates and renders a toast', () => {
    render(
      <NotificationProvider>
        <div>App</div>
      </NotificationProvider>
    );

    act(() => {
      toast.success('Success message');
    });

    expect(screen.getByText('Success message')).toBeInTheDocument();
  });

  it('auto closes a toast after duration', () => {
    render(
      <NotificationProvider>
        <div>App</div>
      </NotificationProvider>
    );

    act(() => {
      toast.success('Will auto close', { duration: 1000 });
    });

    expect(screen.getByText('Will auto close')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1100);
    });

    // Wait for the exit animation timeout of 500ms
    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(screen.queryByText('Will auto close')).not.toBeInTheDocument();
  });

  it('can be manually closed', () => {
    render(
      <NotificationProvider>
        <div>App</div>
      </NotificationProvider>
    );

    act(() => {
      toast.success('Close me', { closeButton: true });
    });

    expect(screen.getByText('Close me')).toBeInTheDocument();

    const closeBtn = screen.getByLabelText('Close notification');
    fireEvent.click(closeBtn);

    // advance timers for the exit transition cleanup
    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(screen.queryByText('Close me')).not.toBeInTheDocument();
  });

  it('prevents duplicate toasts when custom id is used', () => {
    render(
      <NotificationProvider>
        <div>App</div>
      </NotificationProvider>
    );

    act(() => {
      toast.error('First error', { id: 'same-id' });
    });

    act(() => {
      toast.error('Second error', { id: 'same-id' });
    });

    const errorToasts = screen.queryAllByText(/error/i);
    expect(errorToasts.length).toBe(1);
    expect(screen.getByText('Second error')).toBeInTheDocument();
    expect(screen.queryByText('First error')).not.toBeInTheDocument();
  });

  it('handles promise toast state updates', async () => {
    render(
      <NotificationProvider>
        <div>App</div>
      </NotificationProvider>
    );

    let resolvePromise: (val: string) => void = () => {};
    const testPromise = new Promise<string>((resolve) => {
      resolvePromise = resolve;
    });

    act(() => {
      toast.promise(
        testPromise,
        {
          loading: 'Loading task',
          success: 'Task complete',
          error: 'Task failed',
        },
        { id: 'promise-toast' }
      );
    });

    expect(screen.getByText('Loading task')).toBeInTheDocument();

    await act(async () => {
      resolvePromise('Done!');
      // Wait for the promise microtasks to run
      await testPromise;
    });

    expect(screen.queryByText('Loading task')).not.toBeInTheDocument();
    expect(screen.getByText('Task complete')).toBeInTheDocument();
  });
});
