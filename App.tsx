
import React, { useState, useEffect, useCallback } from 'react';
import { storageService } from './services/storageService';
import { AppState, UserSettings, MealLog } from './types';
import { MISSING_WINDOW_MS, SMS_TEXT } from './constants';
import SetupScreen from './components/SetupScreen';
import DashboardScreen from './components/DashboardScreen';
import SettingsScreen from './components/SettingsScreen';
import InstallationPopup from './components/InstallationPopup';
import { AlertTriangle, Send } from 'lucide-react';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(storageService.loadData());
  const [currentView, setCurrentView] = useState<'SETUP' | 'DASHBOARD' | 'SETTINGS'>(
    appState.settings.isSetupComplete ? 'DASHBOARD' : 'SETUP'
  );
  const [timeUntilAlert, setTimeUntilAlert] = useState<string>('');
  const [showSosOverlay, setShowSosOverlay] = useState(false);
  const [showInstallPopup, setShowInstallPopup] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  // Capture Native Install Prompt
  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPopup(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  // Handle Home Screen Shortcuts
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('action') === 'checkin' && appState.settings.isSetupComplete) {
      addLog('Extra', 'YES');
      // Clean URL
      window.history.replaceState({}, document.title, "/");
    }
  }, [appState.settings.isSetupComplete]);

  // Initial Popup Logic
  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches 
      || (window.navigator as any).standalone;
    
    if (!isStandalone && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
      const timer = setTimeout(() => setShowInstallPopup(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    storageService.saveData(appState);
  }, [appState]);

  const triggerSmsAlert = useCallback(() => {
    const phone = appState.settings.contactPhone;
    const message = encodeURIComponent(`${SMS_TEXT} (Sent via Did You Eat app)`);
    setAppState(prev => ({ ...prev, lastSmsSentAt: Date.now() }));
    window.location.href = `sms:${phone};?body=${message}`;
    setShowSosOverlay(false);
  }, [appState.settings.contactPhone]);

  const checkSafetyStatus = useCallback(() => {
    if (!appState.settings.isSetupComplete) return;
    const now = Date.now();
    const yesLogs = appState.logs.filter(l => l.response === 'YES');
    const lastLogTime = yesLogs.length > 0 ? Math.max(...yesLogs.map(l => l.timestamp)) : appState.logs[0]?.timestamp || now; 
    const deadline = lastLogTime + MISSING_WINDOW_MS;
    const diff = deadline - now;

    if (diff <= 0) {
      const lastSms = appState.lastSmsSentAt || 0;
      if ((now - lastSms) > (MISSING_WINDOW_MS / 2) && !showSosOverlay) setShowSosOverlay(true);
      setTimeUntilAlert('ALERT TRIGGERED');
    } else {
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setTimeUntilAlert(`${hours}h ${mins}m`);
    }
  }, [appState, showSosOverlay]);

  useEffect(() => {
    const interval = setInterval(checkSafetyStatus, 15000);
    checkSafetyStatus();
    return () => clearInterval(interval);
  }, [checkSafetyStatus]);

  const addLog = (meal: 'Breakfast' | 'Lunch' | 'Dinner' | 'Extra', response: 'YES' | 'NOT_YET') => {
    if (response === 'YES' && 'vibrate' in navigator) {
      navigator.vibrate(50); // Haptic feedback
    }

    const newLog: MealLog = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      mealType: meal,
      response
    };
    setAppState(prev => ({
      ...prev,
      logs: [newLog, ...prev.logs].slice(0, 100),
    }));
    setShowSosOverlay(false);
  };

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') setDeferredPrompt(null);
      setShowInstallPopup(false);
    }
  };

  const handleResetApp = () => {
    if (confirm("CRITICAL: This will permanently delete your emergency contact and all logs. Continue?")) {
      storageService.reset();
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen max-w-md mx-auto bg-white shadow-xl flex flex-col relative overflow-hidden">
      {showInstallPopup && (
        <InstallationPopup 
          onClose={() => setShowInstallPopup(false)} 
          onInstall={handleInstallClick}
          isNativeSupported={!!deferredPrompt}
        />
      )}

      {currentView === 'SETUP' && (
        <SetupScreen onComplete={(s) => {
          setAppState(prev => ({ ...prev, settings: { ...s, isSetupComplete: true } }));
          setCurrentView('DASHBOARD');
        }} initialSettings={appState.settings} />
      )}
      
      {currentView === 'DASHBOARD' && (
        <DashboardScreen 
          appState={appState} 
          onAddLog={addLog} 
          onOpenSettings={() => setCurrentView('SETTINGS')} 
          timeUntilAlert={timeUntilAlert}
        />
      )}

      {currentView === 'SETTINGS' && (
        <SettingsScreen 
          settings={appState.settings} 
          onSave={(s) => { setAppState(prev => ({ ...prev, settings: s })); setCurrentView('DASHBOARD'); }} 
          onBack={() => setCurrentView('DASHBOARD')}
          onTriggerTestSms={triggerSmsAlert}
          onSimulateTimeout={() => {
            const timeout = Date.now() - (MISSING_WINDOW_MS + 1000);
            setAppState(prev => ({ ...prev, logs: [{ id: 'sim', timestamp: timeout, mealType: 'Breakfast', response: 'YES' }], lastSmsSentAt: null }));
          }}
          onResetApp={handleResetApp}
        />
      )}

      {showSosOverlay && (
        <div className="fixed inset-0 z-[100] bg-red-600 flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500">
          <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mb-8 animate-pulse">
            <AlertTriangle size={48} className="text-white" />
          </div>
          <h2 className="text-4xl font-black text-white mb-4">INACTIVITY</h2>
          <p className="text-red-100 text-lg mb-12">Alerting {appState.settings.contactName}...</p>
          <div className="w-full space-y-4">
            <button onClick={triggerSmsAlert} className="w-full py-6 bg-white text-red-600 rounded-2xl text-2xl font-black flex items-center justify-center gap-3">
              <Send size={28} /> SEND SMS
            </button>
            <button onClick={() => addLog('Extra', 'YES')} className="w-full py-4 text-white font-bold border-2 border-white/30 rounded-2xl">
              I'M OKAY
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
