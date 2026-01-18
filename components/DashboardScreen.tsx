
import React, { useState, useEffect } from 'react';
import { AppState } from '../types';
import { Settings, CheckCircle2, ShieldCheck, History, Heart } from 'lucide-react';

interface DashboardProps {
  appState: AppState;
  onAddLog: (meal: 'Breakfast' | 'Lunch' | 'Dinner' | 'Extra', response: 'YES' | 'NOT_YET') => void;
  onOpenSettings: () => void;
  timeUntilAlert: string;
}

const DashboardScreen: React.FC<DashboardProps> = ({ appState, onAddLog, onOpenSettings, timeUntilAlert }) => {
  const [justSaved, setJustSaved] = useState(false);
  const lastConfirm = appState.logs.find(l => l.response === 'YES');
  const lastTimeStr = lastConfirm ? new Date(lastConfirm.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "No check-in";

  const handleCheckIn = () => {
    onAddLog('Extra', 'YES');
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 3000);
  };

  return (
    <div className="flex-1 flex flex-col bg-emerald-50/20">
      <div className="p-6 pt-10 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Did You Eat?</h1>
          <div className="flex items-center gap-1.5 text-emerald-600 mt-0.5">
            <ShieldCheck size={14} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Monitor Active</span>
          </div>
        </div>
        <button onClick={onOpenSettings} className="p-3 bg-white rounded-2xl shadow-sm text-slate-400"><Settings size={20} /></button>
      </div>

      <div className="px-6 mb-4">
        <div className="bg-slate-900 rounded-2xl p-5 flex items-center justify-between">
           <div>
             <p className="text-[9px] font-bold text-slate-500 uppercase">Alert Countdown</p>
             <p className={`text-xl font-mono font-bold ${timeUntilAlert.includes('ALERT') ? 'text-red-500' : 'text-emerald-400'}`}>{timeUntilAlert}</p>
           </div>
           <div className="text-right">
             <p className="text-[9px] font-bold text-slate-500 uppercase">Last Seen</p>
             <p className="text-xs font-bold text-white">{lastTimeStr}</p>
           </div>
        </div>
      </div>

      <div className="px-6 flex-1 flex flex-col justify-center pb-20">
        <div className="bg-white rounded-[40px] p-10 shadow-xl border border-emerald-50 text-center relative overflow-hidden">
          {justSaved && (
            <div className="absolute inset-0 bg-emerald-600 flex flex-col items-center justify-center text-white animate-in zoom-in duration-300 z-10">
              <CheckCircle2 size={64} className="mb-2" />
              <p className="text-xl font-black italic">SAVED!</p>
              <p className="text-xs font-bold opacity-80 mt-1">Timer Reset Successfully</p>
            </div>
          )}
          
          <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6"><Heart size={40} fill="currentColor" /></div>
          <h2 className="text-3xl font-black text-slate-800 mb-8 leading-tight">Ready for a check-in?</h2>
          
          <button 
            onClick={handleCheckIn}
            className="w-full py-6 bg-emerald-600 text-white text-2xl font-black rounded-[24px] shadow-xl shadow-emerald-200 active:scale-95 transition-transform"
          >
            YES, I ATE
          </button>
          
          <p className="mt-6 text-[10px] text-slate-400 font-bold uppercase tracking-widest">Safe & Private • On-Device</p>
        </div>
      </div>

      <div className="px-6 pb-6">
        <div className="flex items-center gap-2 mb-3">
          <History size={14} className="text-slate-400" />
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Today's Timeline</h3>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {appState.logs.slice(0, 5).map(log => (
            <div key={log.id} className="bg-white px-4 py-3 rounded-2xl border border-slate-100 shrink-0">
               <p className="text-[10px] font-bold text-slate-800">{new Date(log.timestamp).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</p>
               <p className="text-[9px] text-slate-400 font-bold uppercase">{log.mealType}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardScreen;
