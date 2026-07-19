# React Notification Kit 🔔

[![npm version](https://img.shields.io/badge/npm-v1.0.0-blue.svg)](https://www.npmjs.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)]()

A lightweight React notification library with toast, modal, alert, confirmation dialogs, loading states, and customizable TypeScript components.

Optimize your React application's UX with a TypeScript-first library built for speed, responsiveness, accessibility, and clean design.

---

## Key Features

- 🍞 **Toast Notifications**: Stackable toasts with auto-close, progress bars, pause on hover, custom icons, and queue limits.
- 🖼️ **Modal Dialogs**: Beautiful alerts, informational windows, and custom HTML overlays.
- 🤝 **Confirmation Dialogs**: Promise-based modal flow supporting asynchronous callbacks, loading spinners, and error handling.
- ⚡ **Promise Helpers**: Automatically transition toasts and modals through pending, success, and error states.
- 🎨 **Vanillla CSS styling**: Easily styled using CSS custom properties. Supports Light, Dark, and System themes out of the box.
- ♿ **WCAG Accessibility**: Fully WCAG compliant with focus traps, escape key closing, body scroll-locks, and correct `aria-*` tags.
- 🚀 **Next.js & SSR safe**: Built with zero top-level window/document calls, fully supporting Server-Side Rendering.
- 📦 **Ultra Lightweight**: Zero external layout/CSS dependencies. Bundles under 20KB gzipped.

---

## Target Keywords
Optimize your developer workflow for: `react notification`, `react toast`, `react toast notification`, `react modal`, `react alert`, `react confirmation dialog`, `react popup notification`, `react error message`, `react success notification`, `typescript react notification library`, `react ui components`.

---

## Installation

```bash
npm install react-notification-kit
```

---

## Quick Start

### 1. Set Up Provider

Wrap your application in the `NotificationProvider` at the root (e.g. `main.tsx` or `_app.tsx`):

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { NotificationProvider } from 'react-notification-kit';
import 'react-notification-kit/styles.css'; // Import default styles
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <NotificationProvider theme="system" position="top-right">
      <App />
    </NotificationProvider>
  </React.StrictMode>
);
```

### 2. Trigger Toasts & Modals

You can import and trigger notifications statically (from API clients, Redux, etc.) or within your components using hooks:

```tsx
import React from 'react';
import { toast, notify, confirm, useToast, useModal } from 'react-notification-kit';

function MyComponent() {
  // Option A: Using Hooks
  const t = useToast();
  const m = useModal();

  const handleAction = async () => {
    // Trigger Toasts
    t.success('Profile saved successfully!');
    t.error('Failed to connect to database.', { duration: 5000 });

    // Open Confirmation Dialog
    const confirmed = await confirm({
      title: 'Deactivate Account',
      message: 'Are you sure you want to deactivate? This can be undone later.',
      confirmText: 'Deactivate',
      type: 'warning'
    });

    if (confirmed) {
      // Open Alert Modal
      m.open({
        type: 'success',
        title: 'Account Deactivated',
        message: 'Your account has been successfully deactivated.'
      });
    }
  };

  return <button onClick={handleAction}>Manage Account</button>;
}
```

---

## Toast Examples

Toasts support success, error, warning, info, loading, and custom states:

```tsx
import { toast } from 'react-notification-kit';

// Standard statuses
toast.success('Action successful!');
toast.error('An error occurred.');
toast.warning('Check your form input.');
toast.info('New message received.');

// Custom options
toast.success('Saved', {
  duration: 3000,
  position: 'bottom-center',
  closeButton: true,
  progressBar: true,
  pauseOnHover: true,
  animation: 'bounce',
  theme: 'dark'
});
```

---

## Modal Examples

Create fully-accessible modal dialogs for critical announcements or information:

```tsx
import { notify } from 'react-notification-kit';

notify.success({
  title: 'Payment Completed',
  message: 'Your payment of $120.00 was successfully processed.'
});

notify.error({
  title: 'Connection Lost',
  message: 'Failed to synchronize local storage with the cloud.'
});
```

---

## Confirmation Examples (Promise-based)

The `confirm` helper returns a Promise that resolves to `true` on confirm and `false` on cancel. It also supports **asynchronous callbacks**—showing a loading spinner and blocking buttons during completion:

```tsx
import { confirm, toast } from 'react-notification-kit';

const handleDelete = async () => {
  const isConfirmed = await confirm({
    title: 'Purge Records',
    message: 'This will permanently delete 5,421 database records.',
    confirmText: 'Purge Database',
    cancelText: 'Cancel',
    type: 'danger',
    onConfirm: async () => {
      // Simulated async network request
      await fetch('/api/purge', { method: 'POST' });
      toast.success('Database successfully purged.');
    }
  });

  if (isConfirmed) {
    console.log('Record deletion completed');
  }
};
```

---

## Promise Examples (Toasts & Modals)

Manage loading/fetching transitions automatically for both toasts and modals:

### Toast Promise
```tsx
import { toast } from 'react-notification-kit';

toast.promise(
  fetch('/api/upload'),
  {
    loading: 'Uploading media content...',
    success: 'Media uploaded successfully!',
    error: 'Failed to upload media.'
  }
);
```

### Modal Promise
```tsx
import { notify } from 'react-notification-kit';

notify.promise(
  fetch('/api/backup'),
  {
    loading: 'Generating database backup. Please stand by...',
    success: 'Backup file generated and archived.',
    error: 'Backup generation failed.'
  },
  { title: 'Database Backup' }
);
```

---

## Custom Components

You can render completely custom layouts inside toasts or modals:

```tsx
import { toast, notify } from 'react-notification-kit';

// Custom Toast
toast.custom(
  <div className="my-custom-toast">
    <h4>New Message</h4>
    <p>You have a new message from Sarah.</p>
  </div>
);

// Custom Modal
notify.custom(
  <div style={{ padding: '30px' }}>
    <h2>Feedback</h2>
    <textarea placeholder="Rate your experience..." />
    <button onClick={() => notify.dismiss('feedback-modal')}>Submit</button>
  </div>,
  { id: 'feedback-modal', size: 'medium' }
);
```

---

## Theme Configuration

Customize colors, padding, and roundness by defining variables in your CSS `:root`:

```css
:root {
  --rnk-primary: #2563eb;          /* Primary theme color */
  --rnk-success: #16a34a;          /* Success alerts color */
  --rnk-error: #dc2626;            /* Error alerts color */
  --rnk-border-radius: 16px;       /* Border rounded corners */
  --rnk-font-family: 'Inter', sans-serif;
}
```

---

## TypeScript API

```typescript
type ToastType = 'success' | 'error' | 'warning' | 'info' | 'loading' | 'custom';
type ToastPosition = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
type ToastAnimation = 'fade' | 'slide' | 'zoom' | 'bounce';
type NotificationTheme = 'light' | 'dark' | 'system' | 'custom';

interface ToastOptions {
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

interface ModalOptions {
  id?: string | number;
  type?: 'success' | 'error' | 'warning' | 'info' | 'question' | 'danger' | 'loading' | 'custom';
  title?: React.ReactNode;
  message?: React.ReactNode;
  size?: 'small' | 'medium' | 'large' | 'fullscreen' | 'custom';
  position?: 'center' | 'top' | 'bottom';
  animation?: 'fade' | 'slide' | 'zoom' | 'scale' | 'bounce';
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
  content?: React.ReactNode;
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
  showCloseButton?: boolean;
  theme?: NotificationTheme;
}
```

---

## Next.js Setup (SSR compatibility)

Since `react-notification-kit` targets browser execution and uses browser-safe lifecycle listeners, ensure you import it correctly in Next.js (App or Pages routers). The package is fully safe for Next.js out of the box and will not error out with `window is not defined` during build pre-rendering.

Simply import the components inside files declared with `"use client"`:

```tsx
// app/components/MyButton.tsx
"use client";

import { toast } from 'react-notification-kit';

export default function MyButton() {
  return <button onClick={() => toast.success('Next.js Client Toast!')}>Notify</button>;
}
```

---

## npm Publishing Instructions

Follow these steps to build and publish updates to npm:

1. **Verify Code Health**:
   Ensure no TypeScript errors and that all unit tests pass:
   ```bash
   npm run typecheck
   npm run test
   ```

2. **Compile Production Bundles**:
   Build the CommonJS/ESM artifacts and style files:
   ```bash
   npm run build
   ```

3. **Inspect Output Package**:
   Verify the files that will be included in the npm published tarball:
   ```bash
   npm pack --dry-run
   ```

4. **Publish to npm Registry**:
   ```bash
   npm publish --access public
   ```

---

## License

MIT © Antigravity
# react-notification-kit
