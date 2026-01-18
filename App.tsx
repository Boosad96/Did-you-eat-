
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

  // Show installation guide on mount if mobile and not standalone
  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches 
      || (window.navigator as any).standalone 
      || document.referrer.includes('android-app://');
    
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile && !isStandalone) {
      // Small delay for better UX
      const timer = setTimeout(() => setShowInstallPopup(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  // Persistence
  useEffect(() => {
    storageService.saveData(appState);
  }, [appState]);

  const triggerSmsAlert = useCallback(() => {
    const phone = appState.settings.contactPhone;
    const message = encodeURIComponent(`${SMS_TEXT} (Sent via Did You Eat app)`);
    
    // Update internal state to track the alert attempt
    setAppState(prev => ({ ...prev, lastSmsSentAt: Date.now() }));
    
    // Modern SMS Intent for Android/iOS Browsers
    window.location.href = `sms:${phone};?body=${message}`;
    
    // Hide overlay after triggering
    setShowSosOverlay(false);
  }, [appState.settings.contactPhone]);

  // Alert Logic: 24h check
  const checkSafetyStatus = useCallback(() => {
    if (!appState.settings.isSetupComplete) return;

    const now = Date.now();
    const yesLogs = appState.logs.filter(l => l.response === 'YES');
    
    // Determine when the last "YES" was recorded
    const lastLogTime = yesLogs.length > 0 
      ? Math.max(...yesLogs.map(l => l.timestamp))
      : appState.logs[0]?.timestamp || now; 

    const deadline = lastLogTime + MISSING_WINDOW_MS;
    const diff = deadline - now;

    if (diff <= 0) {
      const lastSms = appState.lastSmsSentAt || 0;
      const isSmsSentRecently = (now - lastSms) < (MISSING_WINDOW_MS / 2); 

      if (!isSmsSentRecently && !showSosOverlay) {
        setShowSosOverlay(true);
      }
      setTimeUntilAlert('ALERT TRIGGERED');
    } else {
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setTimeUntilAlert(`${hours}h ${mins}m`);
      if (showSosOverlay) setShowSosOverlay(false);
    }
  }, [appState, showSosOverlay]);

  // Run check every 15 seconds
  useEffect(() => {
    const interval = setInterval(checkSafetyStatus, 15000);
    checkSafetyStatus();
    return () => clearInterval(interval);
  }, [checkSafetyStatus]);

  const handleSetupComplete = (settings: UserSettings) => {
    setAppState(prev => ({
      ...prev,
      settings: { ...settings, isSetupComplete: true }
    }));
    setCurrentView('DASHBOARD');
  };

  const addLog = (meal: 'Breakfast' | 'Lunch' | 'Dinner' | 'Extra', response: 'YES' | 'NOT_YET') => {
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

  const updateSettings = (settings: UserSettings) => {
    setAppState(prev => ({ ...prev, settings }));
    setCurrentView('DASHBOARD');
  };

  const simulate24hInactivity = () => {
    const twentyFiveHoursAgo = Date.now() - (MISSING_WINDOW_MS + 3600000);
    setAppState(prev => ({
      ...prev,
      logs: [
        { id: 'debug-old', timestamp: twentyFiveHoursAgo, mealType: 'Breakfast', response: 'YES' },
        ...prev.logs.filter(l => l.timestamp < twentyFiveHoursAgo)
      ],
      lastSmsSentAt: null 
    }));
  };

  return (
    <div className="min-h-screen max-w-md mx-auto bg-white shadow-xl flex flex-col relative overflow-hidden">
      {showInstallPopup && (
        <InstallationPopup onClose={() => setShowInstallPopup(false)} />
      )}

      {currentView === 'SETUP' && (
        <SetupScreen onComplete={handleSetupComplete} initialSettings={appState.settings} />
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
          onSave={updateSettings} 
          onBack={() => setCurrentView('DASHBOARD')}
          onTriggerTestSms={triggerSmsAlert}
          onSimulateTimeout={simulate24hInactivity}
        />
      )}

      {/* SOS EMERGENCY OVERLAY */}
      {showSosOverlay && (
        <div className="fixed inset-0 z-[100] bg-red-600 flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500">
          <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mb-8 animate-pulse">
            <AlertTriangle size={48} className="text-white" />
          </div>
          <h2 className="text-4xl font-black text-white mb-4 leading-tight">INACTIVITY DETECTED</h2>
          <p className="text-red-100 text-lg mb-12">
            You haven't checked in for 24 hours. Emergency contact notification is ready.
          </p>
          
          <div className="w-full space-y-4">
            <button 
              onClick={triggerSmsAlert}
              className="w-full py-6 bg-white text-red-600 rounded-2xl text-2xl font-black shadow-2xl flex items-center justify-center gap-3 active:scale-95 transition-transform"
            >
              <Send size={28} />
              SEND SMS NOW
            </button>
            <button 
              onClick={() => addLog('Extra', 'YES')}
              className="w-full py-4 bg-transparent border-2 border-white/30 text-white rounded-2xl text-lg font-bold"
            >
              I'M OKAY, RESET TIMER
            </button>
          </div>
          
          <p className="mt-8 text-red-200 text-xs uppercase tracking-widest font-bold">
            Alerting: {appState.settings.contactName}
          </p>
        </div>
      )}
    </div>
  );
};

export default App;
