
export const notificationService = {
  requestPermission: async (): Promise<boolean> => {
    if (!('Notification' in window)) {
      console.warn("This browser does not support desktop notifications");
      return false;
    }

    if (Notification.permission === 'granted') return true;

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return false;
  },

  sendNotification: (title: string, body: string) => {
    if (Notification.permission === 'granted') {
      // Use 'any' type to bypass strict NotificationOptions check for 'renotify' and 'actions'.
      // These properties are widely supported in modern browsers but sometimes missing from standard TypeScript DOM types.
      const options: any = {
        body,
        icon: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="20" fill="%2310b981"/><path d="M43 55l5 5 10-10" fill="none" stroke="white" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
        badge: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="%2310b981"/></svg>',
        tag: 'meal-reminder',
        renotify: true,
        // Adding interactive actions for Android/Chrome
        actions: [
          { action: 'yes', title: '✅ Yes, I ate' },
          { action: 'not_yet', title: '⏳ Not yet' }
        ]
      };

      // Service worker is required for action buttons to work correctly on mobile
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.ready.then(registration => {
          registration.showNotification(title, options);
        });
      } else {
        // Fallback for browsers not using SW for notifications (no actions support)
        new Notification(title, options);
      }
      
      if ('vibrate' in navigator) {
        navigator.vibrate([200, 100, 200]);
      }
    }
  }
};
