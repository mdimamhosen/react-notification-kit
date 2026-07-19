import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { NotificationProvider, toast } from '../src';

describe('NotificationProvider Configuration', () => {
  beforeEach(() => {
    toast.clear();
  });

  it('applies default theme and position configurations', () => {
    render(
      <NotificationProvider theme="dark" position="bottom-left">
        <div>App</div>
      </NotificationProvider>
    );

    act(() => {
      toast.success('Test Toast');
    });

    const toastItem = screen.getByText('Test Toast').closest('.rnk-toast-item');
    expect(toastItem).toHaveClass('rnk-toast-theme-dark');

    // Check if rendered under the bottom-left container
    const container = screen.getByTestId('toast-container-bottom-left');
    expect(container).toContainElement(toastItem! as HTMLElement);
  });

  it('respects overridden options at toast-level', () => {
    render(
      <NotificationProvider theme="dark" position="bottom-left">
        <div>App</div>
      </NotificationProvider>
    );

    act(() => {
      toast.success('Override Toast', { theme: 'light', position: 'top-center' });
    });

    const toastItem = screen.getByText('Override Toast').closest('.rnk-toast-item');
    expect(toastItem).toHaveClass('rnk-toast-theme-light');
    expect(toastItem).not.toHaveClass('rnk-toast-theme-dark');

    const container = screen.getByTestId('toast-container-top-center');
    expect(container).toContainElement(toastItem! as HTMLElement);
  });
});
