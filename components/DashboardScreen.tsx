
import React, { useState, useEffect, useMemo } from 'react';
import { AppState, UserSettings } from '../types.ts';
import { APP_LOGO } from '../constants.ts';
import { Settings, CheckCircle2, ShieldCheck, History, Bell, BellOff, Check, AlertCircle } from 'lucide-react';
import { notificationService } from '../services/notificationService.ts';

interface DashboardProps {
  appState: AppState;
  onAddLog: (meal: 'Breakfast' | 'Lunch' | 'Dinner' | 'Extra', response: 'YES' | 'NOT_YET') => void;
  onOpenSettings: () => void;
  timeUntilAlert: string;
}

const DashboardScreen: React.FC<DashboardProps> = ({ appState, onAddLog, onOpenSettings, timeUntilAlert }) => {
  const [justSaved, setJustSaved] = useState(false);
  const [notifPermission, setNotifPermission] = useState(Notification.permission);

  // Helper to determine which meal window we are currently in
  const currentMealInfo = useMemo(() => {
    const now = new Date();
    const currentTimeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    const { breakfastTime, lunchTime, dinnerTime } = appState.settings;
    
    let type: 'Breakfast' | 'Lunch' | 'Dinner' = 'Breakfast';
    if (currentTimeStr >= dinnerTime) {
      type = 'Dinner';
    } else if (currentTimeStr >= lunchTime) {
      type = 'Lunch';
    } else {
      type = 'Breakfast';
    }

    // Check if this specific meal has been logged TODAY
    const startOfToday = new Date().setHours(0, 0, 0, 0);
    const alreadyLogged = appState.logs.some(log => 
      log.mealType === type && 
      log.response === 'YES' && 
      log.timestamp >= startOfToday
    );

    return { type, alreadyLogged };
  }, [appState.logs, appState.settings]);

  const lastConfirm = appState.logs.find(l => l.response === 'YES');
  const lastTimeStr = lastConfirm ? new Date(lastConfirm.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "No check-in";

  useEffect(() => {
    const interval = setInterval(() => {
      setNotifPermission(Notification.permission);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleRequestPermission = async () => {
    if (notifPermission === 'denied') {
      alert("Notifications are blocked. Please enable them in your browser or site settings to receive reminders.");
      return;
    }
    const granted = await notificationService.requestPermission();
    setNotifPermission(granted ? 'granted' : 'denied');
    if (granted) {
      notificationService.sendNotification("Reminders Enabled", "Great! We'll nudge you if you forget to log a meal.");
    }
  };

  const handleCheckIn = () => {
    if (currentMealInfo.alreadyLogged) return;
    
    onAddLog(currentMealInfo.type, 'YES');
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 3000);
  };

  return (
    <div className="flex-1 flex flex-col bg-emerald-50/20">
      <div className="p-6 pt-10 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img src={APP_LOGO} alt="Logo" className="w-10 h-10 rounded-xl shadow-sm" />
          <div>
            <h1 className="text-xl font-bold text-slate-800 leading-tight">Did You Eat?</h1>
            <div className="flex items-center gap-1.5 text-emerald-600">
              <ShieldCheck size={12} />
              <span className="text-[9px] font-bold uppercase tracking-wider">Monitor Active</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleRequestPermission}
            className={`p-3 rounded-2xl shadow-sm transition-all active:scale-90 ${
              notifPermission === 'granted' 
                ? 'bg-white text-emerald-500' 
                : 'bg-red-50 text-red-500 border border-red-100 animate-pulse'
            }`}
          >
            {notifPermission === 'granted' ? <Bell size={20} /> : <BellOff size={20} />}
          </button>
          <button onClick={onOpenSettings} className="p-3 bg-white rounded-2xl shadow-sm text-slate-400 active:scale-90 transition-transform"><Settings size={20} /></button>
        </div>
      </div>

      {notifPermission !== 'granted' && (
        <div className="px-6 mb-4">
          <button 
            onClick={handleRequestPermission}
            className="w-full p-4 bg-red-600/10 border border-red-600/20 rounded-2xl flex items-center justify-between text-red-700"
          >
            <div className="flex items-center gap-3">
              <AlertCircle size={18} />
              <span className="text-xs font-bold text-left">Reminders are disabled. Tap to enable.</span>
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest bg-red-600 text-white px-3 py-1.5 rounded-full">Fix Now</span>
          </button>
        </div>
      )}

      <div className="px-6 mb-4">
        <div className="bg-slate-900 rounded-2xl p-5 flex items-center justify-between shadow-lg">
           <div>
             <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Alert Countdown</p>
             <p className={`text-xl font-mono font-bold ${timeUntilAlert.includes('ALERT') ? 'text-red-500' : 'text-emerald-400'}`}>{timeUntilAlert}</p>
           </div>
           <div className="text-right">
             <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Last Seen</p>
             <p className="text-xs font-bold text-white">{lastTimeStr}</p>
           </div>
        </div>
      </div>

      <div className="px-6 flex-1 flex flex-col justify-center pb-20">
        <div className="bg-white rounded-[40px] p-10 shadow-2xl shadow-emerald-900/5 border border-emerald-50 text-center relative overflow-hidden">
          {justSaved && (
            <div className="absolute inset-0 bg-emerald-600 flex flex-col items-center justify-center text-white animate-in zoom-in duration-300 z-10">
              <CheckCircle2 size={64} className="mb-2" />
              <p className="text-xl font-black italic">SAVED!</p>
              <p className="text-xs font-bold opacity-80 mt-1">Timer Reset Successfully</p>
            </div>
          )}
          
          <div className="w-24 h-24 bg-emerald-50 rounded-[32px] flex items-center justify-center mx-auto mb-8 shadow-inner">
            <img src={APP_LOGO} alt="Brand Icon" className="w-16 h-16 object-contain" />
          </div>
          
          <h2 className="text-3xl font-black text-slate-800 mb-8 leading-tight">
            {currentMealInfo.alreadyLogged ? "You're all set!" : "Ready for a check-in?"}
          </h2>
          
          <button 
            disabled={currentMealInfo.alreadyLogged}
            onClick={handleCheckIn}
            className={`w-full py-6 text-white text-2xl font-black rounded-[28px] shadow-xl transition-all flex items-center justify-center gap-3 ${
              currentMealInfo.alreadyLogged 
                ? 'bg-slate-200 text-slate-400 shadow-none cursor-not-allowed' 
                : 'bg-emerald-600 shadow-emerald-200 active:scale-95'
            }`}
          >
            {currentMealInfo.alreadyLogged ? (
              <><Check size={28} strokeWidth={4} /> {currentMealInfo.type.toUpperCase()} DONE</>
            ) : (
              `YES, I ATE ${currentMealInfo.type.toUpperCase()}`
            )}
          </button>
          
          <p className="mt-6 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            {currentMealInfo.alreadyLogged 
              ? `Next check-in available after meal time`
              : `Confirming your ${currentMealInfo.type.toLowerCase()} check-in`}
          </p>
        </div>
      </div>

      <div className="px-6 pb-8">
        <div className="flex items-center gap-2 mb-3">
          <History size={14} className="text-slate-400" />
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Today's Activity</h3>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {appState.logs.length === 0 ? (
            <div className="text-[10px] text-slate-300 font-medium italic">No logs yet for today.</div>
          ) : (
            appState.logs.slice(0, 5).map(log => (
              <div key={log.id} className="bg-white px-4 py-3 rounded-2xl border border-slate-100 shrink-0 shadow-sm">
                 <p className="text-[10px] font-bold text-slate-800">{new Date(log.timestamp).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</p>
                 <p className="text-[9px] text-slate-400 font-bold uppercase">{log.mealType}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardScreen;
