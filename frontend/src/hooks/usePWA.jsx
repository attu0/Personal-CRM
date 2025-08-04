import { useState, useEffect } from 'react';

// Custom hook for PWA functionality
export const usePWA = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isInstallable, setIsInstallable] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is installed
    if (window.matchMedia('(display-mode: standalone)').matches || 
        window.navigator.standalone === true) {
      setIsInstalled(true);
    }

    // Online/Offline status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // PWA Install prompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    // PWA Installed
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const installPWA = async () => {
    if (!deferredPrompt) return false;

    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('PWA: User accepted install prompt');
        setIsInstallable(false);
        setDeferredPrompt(null);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('PWA: Install failed', error);
      return false;
    }
  };

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      console.warn('PWA: Notifications not supported');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission === 'denied') {
      return false;
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  };

  const showNotification = (title, options = {}) => {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
      console.warn('PWA: Cannot show notification - permission not granted');
      return;
    }

    const defaultOptions = {
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-72x72.png',
      vibrate: [200, 100, 200],
      tag: 'personal-crm-notification'
    };

    new Notification(title, { ...defaultOptions, ...options });
  };

  const addToHomeScreen = () => {
    // For iOS Safari
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
      const message = `To install Personal CRM:
1. Tap the Share button 
2. Scroll down and tap "Add to Home Screen"
3. Tap "Add" to confirm`;
      
      alert(message);
      return;
    }

    // For other browsers, use the install prompt
    installPWA();
  };

  return {
    isOnline,
    isInstallable,
    isInstalled,
    installPWA,
    addToHomeScreen,
    requestNotificationPermission,
    showNotification
  };
};

// PWA Status Component
export const PWAStatus = () => {
  const { isOnline, isInstallable, isInstalled, installPWA, addToHomeScreen } = usePWA();

  if (isInstalled) {
    return null; // Don't show anything if already installed
  }

  return (
    <>
      {/* Online/Offline Indicator */}
      {!isOnline && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          background: '#f59e0b',
          color: 'white',
          padding: '0.5rem',
          textAlign: 'center',
          zIndex: 9998,
          fontSize: '0.875rem'
        }}>
          📶 You're offline - Some features may be limited
        </div>
      )}

      {/* Install Banner */}
      {isInstallable && (
        <div style={{
          position: 'fixed',
          bottom: '1rem',
          left: '1rem',
          right: '1rem',
          background: '#6366f1',
          color: 'white',
          padding: '1rem',
          borderRadius: '0.75rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 9999,
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
        }}>
          <div>
            <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
              📱 Install Personal CRM
            </div>
            <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>
              Get the full app experience!
            </div>
          </div>
          <div>
            <button
              onClick={addToHomeScreen}
              style={{
                background: 'white',
                color: '#6366f1',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                fontWeight: '600',
                cursor: 'pointer',
                marginRight: '0.5rem'
              }}
            >
              Install
            </button>
            <button
              onClick={() => setIsInstallable(false)}
              style={{
                background: 'transparent',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.3)',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                cursor: 'pointer'
              }}
            >
              Later
            </button>
          </div>
        </div>
      )}
    </>
  );
};
