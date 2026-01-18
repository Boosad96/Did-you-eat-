
import React from 'react';
import { AppState, MealLog } from '../types';
import { Settings, CheckCircle2, AlertTriangle, History, ShieldCheck } from 'lucide-react';

interface DashboardProps {
  appState: AppState;
  onAddLog: (meal: 'Breakfast' | 'Lunch' | 'Dinner' | 'Extra', response: 'YES' | 'NOT_YET') => void;
  onOpenSettings: () => void;
  timeUntilAlert: string;
}

const DashboardScreen: React.FC<DashboardProps> = ({ appState, onAddLog, onOpenSettings, timeUntilAlert }) => {
  const lastConfirm = appState.logs.find(l => l.response === 'YES');
  const lastTimeStr = lastConfirm 
    ? new Date(lastConfirm.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : "No check-in today";

  const getMealType = (): 'Breakfast' | 'Lunch' | 'Dinner' | 'Extra' => {
    const hour = new Date().getHours();
    if (hour < 11) return 'Breakfast';
    if (hour < 16) return 'Lunch';
    if (hour < 22) return 'Dinner';
    return 'Extra';
  };

  const currentMeal = getMealType();

  return (
    <div className="flex-1 flex flex-col bg-emerald-50/30">
      {/* Header */}
      <div className="p-6 pt-8 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Did You Eat?</h1>
          <p className="text-slate-500 text-sm">Daily Care & Well-being</p>
        </div>
        <button 
          onClick={onOpenSettings}
          className="p-2 bg-white rounded-full shadow-sm text-slate-400 hover:text-emerald-600 transition-colors"
        >
          <Settings size={24} />
        </button>
      </div>

      {/* ADMIN MONITOR PANEL */}
      <div className="px-6 mb-4">
        <div className="bg-slate-800 text-white rounded-2xl p-4 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
              <ShieldCheck size={20} />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">System Monitor</p>
              <p className="text-xs font-medium">Automatic Alert in:</p>
            </div>
          </div>
          <div className="text-right">
            <p className={`text-lg font-mono font-bold ${timeUntilAlert === 'ALERT TRIGGERED' ? 'text-red-400 animate-pulse' : 'text-emerald-400'}`}>
              {timeUntilAlert}
            </p>
          </div>
        </div>
      </div>

      {/* Main Action Card */}
      <div className="px-6 mb-6">
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-emerald-100 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6 text-emerald-600">
            <CheckCircle2 size={40} />
          </div>
          
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Did you eat {currentMeal.toLowerCase()}?</h2>
          <p className="text-slate-500 mb-8 px-4">Tap "YES" to reset the 24-hour safety timer.</p>
          
          <div className="w-full space-y-4">
            <button 
              onClick={() => onAddLog(currentMeal, 'YES')}
              className="w-full py-6 rounded-2xl bg-emerald-600 text-white text-xl font-bold shadow-xl shadow-emerald-200 active:scale-95 transition-transform"
            >
              YES, I ATE
            </button>
            <button 
              onClick={() => onAddLog(currentMeal, 'NOT_YET')}
              className="w-full py-4 rounded-2xl bg-white text-slate-400 text-lg font-semibold border-2 border-slate-100 active:scale-95 transition-transform"
            >
              Not yet
            </button>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="px-6 grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center gap-3">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <History size={20} />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Last Meal</p>
            <p className="text-sm font-semibold text-slate-700">{lastTimeStr}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center gap-3">
          <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
            <AlertTriangle size={20} />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Alert Sent</p>
            <p className="text-sm font-semibold text-slate-700">
              {appState.lastSmsSentAt ? 'Yes, today' : 'None yet'}
            </p>
          </div>
        </div>
      </div>

      {/* History List */}
      <div className="flex-1 px-6 pb-6 overflow-hidden flex flex-col">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Recent Activity</h3>
        <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-hide">
          {appState.logs.length === 0 ? (
            <div className="py-12 text-center text-slate-300 italic text-sm">
              Your log is empty. Check in today!
            </div>
          ) : (
            appState.logs.map(log => (
              <div key={log.id} className="bg-white/50 p-4 rounded-xl border border-slate-100 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${log.response === 'YES' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                  <div>
                    <p className="text-sm font-semibold text-slate-700">{log.mealType}</p>
                    <p className="text-[10px] text-slate-400">
                      {new Date(log.timestamp).toLocaleDateString()} at {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${log.response === 'YES' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                  {log.response}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardScreen;
