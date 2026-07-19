import React, { useState } from 'react';
import {
  NotificationProvider,
  notify,
  confirm,
  NotificationTheme,
  ToastPosition,
  useToast,
  useModal,
} from 'react-notification-kit';
import 'react-notification-kit/styles.css';

function DemoContent() {
  const toast = useToast();
  const customModal = useModal();
  const [position, setPosition] = useState<ToastPosition>('top-right');
  const [shouldFail, setShouldFail] = useState(false);

  // Helper to simulate API call
  const simulateApiCall = (ms: number, fail = false) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (fail) reject(new Error('Internal Server Error'));
        else resolve('Data updated successfully');
      }, ms);
    });
  };

  const handlePromiseToast = () => {
    toast.promise(
      simulateApiCall(2000, shouldFail),
      {
        loading: 'Syncing profile details with server...',
        success: 'Profile updated successfully!',
        error: (err) => `Failed to update profile: ${err.message}`,
      },
      { position }
    );
  };

  const handlePromiseModal = () => {
    notify.promise(
      simulateApiCall(2500, shouldFail),
      {
        loading: 'Writing updates to database. Please do not close your browser...',
        success: 'Database migrated successfully!',
        error: 'Database migration failed. Rollback complete.',
      },
      { title: 'Database Sync' }
    );
  };

  const handleAsyncConfirm = async () => {
    const result = await confirm({
      title: 'Danger Zone: Delete System Files',
      message: 'This operation is permanent. It will purge all temporary cached file structures.',
      confirmText: 'Purge Directory',
      cancelText: 'Keep Files',
      type: 'danger',
      onConfirm: async () => {
        // Run a simulated async deletion
        await simulateApiCall(2000, shouldFail);
        // Show success feedback
        toast.success('Files successfully deleted.', { position });
      },
    });

    console.log('Confirmation result:', result);
  };

  const showMultipleToasts = () => {
    for (let i = 1; i <= 8; i++) {
      setTimeout(() => {
        toast.info(`Notification #${i}: Real-time logging entry logged.`, {
          position,
          id: `multiple-toast-${i}`, // allows deduplication or unique
        });
      }, i * 150);
    }
  };

  return (
    <div style={styles.demoWrapper}>
      {/* Title Header */}
      <header style={styles.header}>
        <h1 style={styles.title}>React Notification Kit</h1>
        <p style={styles.subtitle}>
          Lightweight, accessible, fully-customizable toast, modal, and confirmation dialog system.
        </p>
      </header>

      {/* Control Panels Grid */}
      <div style={styles.grid}>
        {/* Toast Panel */}
        <section style={styles.card}>
          <h2 style={styles.cardTitle}>Toast System</h2>
          <p style={styles.cardDesc}>Non-blocking alerts stacked cleanly by position.</p>
          
          <div style={styles.buttonGroup}>
            <button style={{ ...styles.btn, ...styles.btnSuccess }} onClick={() => toast.success('Profile created successfully!')}>
              ✓ Success Toast
            </button>
            <button style={{ ...styles.btn, ...styles.btnError }} onClick={() => toast.error('Database connection timed out.')}>
              × Error Toast
            </button>
            <button style={{ ...styles.btn, ...styles.btnWarning }} onClick={() => toast.warning('Storage is almost full (92%).')}>
              ! Warning Toast
            </button>
            <button style={{ ...styles.btn, ...styles.btnInfo }} onClick={() => toast.info('New software update is available.')}>
              i Info Toast
            </button>
            <button style={{ ...styles.btn, ...styles.btnPrimary }} onClick={() => toast.loading('Exporting transaction ledger...')}>
              ⏳ Loading Toast
            </button>
          </div>

          <hr style={styles.divider} />

          <h3 style={styles.subTitle}>Position Configuration</h3>
          <div style={styles.positionGrid}>
            {(['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right'] as ToastPosition[]).map((pos) => (
              <button
                key={pos}
                style={{
                  ...styles.positionBtn,
                  ...(position === pos ? styles.positionBtnActive : {}),
                }}
                onClick={() => setPosition(pos)}
              >
                {pos}
              </button>
            ))}
          </div>

          <hr style={styles.divider} />

          <h3 style={styles.subTitle}>Async Toast & Limits</h3>
          <div style={styles.toggleRow}>
            <label style={styles.label}>
              <input
                type="checkbox"
                checked={shouldFail}
                onChange={(e) => setShouldFail(e.target.checked)}
                style={{ marginRight: '8px' }}
              />
              Force Async Failures
            </label>
          </div>
          <div style={styles.buttonGroup}>
            <button style={styles.btnSecondary} onClick={handlePromiseToast}>
              ⚡ Run Promise Toast (2s)
            </button>
            <button style={styles.btnSecondary} onClick={showMultipleToasts}>
              💥 Spawn 8 Toasts (Queue Limit)
            </button>
          </div>
        </section>

        {/* Modal Panel */}
        <section style={styles.card}>
          <h2 style={styles.cardTitle}>Modal Dialogs</h2>
          <p style={styles.cardDesc}>Accessible, scroll-locked overlays with focus traps.</p>

          <div style={styles.buttonGroup}>
            <button
              style={{ ...styles.btn, ...styles.btnSuccess }}
              onClick={() =>
                notify.success({
                  title: 'Payment Completed',
                  message: 'Your invoice #INV-4921 has been settled.',
                })
              }
            >
              ✓ Success Alert
            </button>
            <button
              style={{ ...styles.btn, ...styles.btnError }}
              onClick={() =>
                notify.error({
                  title: 'Submission Refused',
                  message: 'The uploaded file type is not supported.',
                })
              }
            >
              × Error Alert
            </button>
            <button
              style={{ ...styles.btn, ...styles.btnWarning }}
              onClick={() =>
                notify.warning({
                  title: 'Action Required',
                  message: 'Verify your email to prevent suspension.',
                })
              }
            >
              ! Warning Alert
            </button>
            <button
              style={{ ...styles.btn, ...styles.btnInfo }}
              onClick={() =>
                notify.info({
                  title: 'Feature Release',
                  message: 'You can now configure webhook integrations.',
                })
              }
            >
              i Info Alert
            </button>
          </div>

          <hr style={styles.divider} />

          <h3 style={styles.subTitle}>Confirmation Workflows</h3>
          <p style={styles.cardDesc}>Returns Promise values directly inside code execution.</p>
          <div style={styles.buttonGroup}>
            <button style={styles.btnDanger} onClick={handleAsyncConfirm}>
              🗑️ Async Confirm (Danger)
            </button>
            <button style={styles.btnSecondary} onClick={handlePromiseModal}>
              🔄 Promise Modal
            </button>
          </div>

          <hr style={styles.divider} />

          <h3 style={styles.subTitle}>Custom Modal layout</h3>
          <div style={styles.buttonGroup}>
            <button
              style={styles.btnPrimary}
              onClick={() =>
                customModal.custom(
                  <div style={{ padding: '32px', textAlign: 'center' }}>
                    <h2 style={{ margin: '0 0 12px 0', fontSize: '24px' }}>Custom Content</h2>
                    <p style={{ margin: '0 0 20px 0', opacity: 0.8 }}>
                      You can render any JSX inside a custom modal.
                    </p>
                    <button
                      className="rnk-btn rnk-btn-primary"
                      onClick={() => customModal.dismiss('custom-layout')}
                    >
                      Dismiss Window
                    </button>
                  </div>,
                  { id: 'custom-layout', size: 'small', closeOnOverlayClick: false }
                )
              }
            >
              🎨 Open Custom Modal
            </button>
          </div>
        </section>
      </div>

      <footer style={styles.pageFooter}>
        Developed by Antigravity AI Coding Assistant
      </footer>
    </div>
  );
}

export default function App() {
  const [theme, setTheme] = useState<NotificationTheme>('system');

  return (
    <NotificationProvider theme={theme}>
      <div style={theme === 'dark' ? styles.themeDark : theme === 'light' ? styles.themeLight : styles.themeSystem}>
        <div style={styles.themeSelector}>
          <span style={{ marginRight: '8px', fontWeight: 'bold' }}>Theme:</span>
          {(['light', 'dark', 'system'] as NotificationTheme[]).map((t) => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              style={{
                ...styles.themeBtn,
                ...(theme === t ? styles.themeBtnActive : {}),
              }}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>
        <DemoContent />
      </div>
    </NotificationProvider>
  );
}

// Styling Object for Demo Page (Vanilla inline CSS for maximum compatibility and premium visuals)
const styles: Record<string, React.CSSProperties> = {
  themeLight: {
    backgroundColor: '#f3f4f6',
    color: '#1f2937',
    minHeight: '100vh',
    transition: 'background-color 0.3s, color 0.3s',
  },
  themeDark: {
    backgroundColor: '#111827',
    color: '#f9fafb',
    minHeight: '100vh',
    transition: 'background-color 0.3s, color 0.3s',
  },
  themeSystem: {
    backgroundColor: 'var(--rnk-bg-light)',
    color: 'var(--rnk-text-light)',
    minHeight: '100vh',
  },
  demoWrapper: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px 20px',
    display: 'flex',
    flexDirection: 'column',
    minHeight: '80vh',
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px',
  },
  title: {
    fontSize: '48px',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    margin: '0 0 10px 0',
    letterSpacing: '-1px',
  },
  subtitle: {
    fontSize: '18px',
    opacity: 0.8,
    margin: '0',
    maxWidth: '700px',
    marginLeft: 'auto',
    marginRight: 'auto',
    lineHeight: '1.6',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '30px',
    marginBottom: '40px',
  },
  card: {
    background: 'rgba(255, 255, 255, 0.03)',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(156, 163, 175, 0.2)',
    borderRadius: '16px',
    padding: '30px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
  },
  cardTitle: {
    fontSize: '24px',
    fontWeight: '700',
    margin: '0 0 4px 0',
  },
  cardDesc: {
    fontSize: '14px',
    opacity: 0.7,
    margin: '0 0 20px 0',
  },
  buttonGroup: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
  },
  divider: {
    border: 'none',
    borderBottom: '1px solid rgba(156, 163, 175, 0.15)',
    margin: '24px 0',
  },
  subTitle: {
    fontSize: '16px',
    fontWeight: '600',
    margin: '0 0 12px 0',
  },
  positionGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '8px',
  },
  positionBtn: {
    padding: '8px',
    fontSize: '12px',
    border: '1px solid rgba(156, 163, 175, 0.3)',
    borderRadius: '8px',
    background: 'transparent',
    color: 'inherit',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  positionBtnActive: {
    borderColor: '#3b82f6',
    background: 'rgba(59, 130, 246, 0.1)',
    color: '#3b82f6',
    fontWeight: 'bold',
  },
  toggleRow: {
    marginBottom: '16px',
  },
  label: {
    display: 'inline-flex',
    alignItems: 'center',
    fontSize: '14px',
    cursor: 'pointer',
    fontWeight: '500',
  },
  btn: {
    padding: '10px 16px',
    fontSize: '14px',
    fontWeight: '600',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    color: 'white',
    transition: 'transform 0.1s, opacity 0.2s',
  },
  btnPrimary: {
    backgroundColor: '#3b82f6',
  },
  btnSuccess: {
    backgroundColor: '#10b981',
  },
  btnError: {
    backgroundColor: '#ef4444',
  },
  btnWarning: {
    backgroundColor: '#f59e0b',
  },
  btnDanger: {
    backgroundColor: '#f43f5e',
    color: 'white',
    border: 'none',
    padding: '10px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
  },
  btnSecondary: {
    backgroundColor: 'transparent',
    border: '1px solid rgba(156, 163, 175, 0.4)',
    color: 'inherit',
    padding: '10px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
  },
  themeSelector: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '16px 20px',
    gap: '6px',
  },
  themeBtn: {
    padding: '6px 12px',
    fontSize: '11px',
    fontWeight: 'bold',
    borderRadius: '6px',
    border: '1px solid rgba(156, 163, 175, 0.3)',
    background: 'transparent',
    color: 'inherit',
    cursor: 'pointer',
  },
  themeBtnActive: {
    background: 'var(--rnk-text-light)',
    color: 'var(--rnk-bg-light)',
    borderColor: 'transparent',
  },
  pageFooter: {
    textAlign: 'center',
    marginTop: 'auto',
    paddingTop: '40px',
    fontSize: '12px',
    opacity: 0.5,
  },
};
