
import React, { useState } from 'react';
import { UserSettings } from '../types.ts';
import { APP_LOGO } from '../constants.ts';

interface SetupProps {
  onComplete: (settings: UserSettings) => void;
  initialSettings: UserSettings;
}

const SetupScreen: React.FC<SetupProps> = ({ onComplete, initialSettings }) => {
  const [step, setStep] = useState(1);
  const [settings, setSettings] = useState<UserSettings>(initialSettings);

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleFinish = () => {
    if (!settings.contactName || !settings.contactPhone) {
      alert("Please enter emergency contact details.");
      return;
    }
    if (!settings.contactPhone.startsWith('+')) {
      alert("CRITICAL: Please include the country code starting with '+' (e.g., +1555...). This ensures the SMS reaches the contact globally.");
      return;
    }
    onComplete(settings);
  };

  return (
    <div className="flex-1 flex flex-col p-8 animate-in fade-in slide-in-from-bottom-4 duration-500 bg-white">
      <div className="mb-10 mt-6 flex flex-col items-center text-center">
        <img src={APP_LOGO} alt="Logo" className="w-20 h-20 rounded-3xl shadow-xl mb-6" />
        <h1 className="text-3xl font-black text-slate-900">Welcome</h1>
        <p className="text-slate-500 mt-2 font-medium">Let's set up your daily safety routine.</p>
      </div>

      <div className="flex-1">
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <h2 className="text-xl font-bold text-slate-800">1. Meal Reminder Times</h2>
            <p className="text-sm text-slate-500 font-medium">When should we remind you to check in?</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-widest">Breakfast</label>
                <input 
                  type="time" 
                  value={settings.breakfastTime}
                  onChange={e => setSettings({...settings, breakfastTime: e.target.value})}
                  className="w-full p-4 rounded-2xl border border-slate-100 bg-slate-50 text-lg font-bold focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-widest">Lunch</label>
                <input 
                  type="time" 
                  value={settings.lunchTime}
                  onChange={e => setSettings({...settings, lunchTime: e.target.value})}
                  className="w-full p-4 rounded-2xl border border-slate-100 bg-slate-50 text-lg font-bold focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-widest">Dinner</label>
                <input 
                  type="time" 
                  value={settings.dinnerTime}
                  onChange={e => setSettings({...settings, dinnerTime: e.target.value})}
                  className="w-full p-4 rounded-2xl border border-slate-100 bg-slate-50 text-lg font-bold focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <h2 className="text-xl font-bold text-slate-800">2. Emergency Contact</h2>
            <p className="text-sm text-slate-500 font-medium">Who should we alert if you don't respond?</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-widest">Contact Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Daughter (Mary)"
                  value={settings.contactName}
                  onChange={e => setSettings({...settings, contactName: e.target.value})}
                  className="w-full p-4 rounded-2xl border border-slate-100 bg-slate-50 text-lg font-bold focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1 flex justify-between uppercase tracking-widest">
                  Phone Number 
                  <span className="text-red-500 font-black">START WITH +</span>
                </label>
                <input 
                  type="tel" 
                  placeholder="+15551234567"
                  value={settings.contactPhone}
                  onChange={e => setSettings({...settings, contactPhone: e.target.value})}
                  className="w-full p-4 rounded-2xl border border-slate-100 bg-slate-50 text-lg font-bold focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                />
              </div>
            </div>

            <div className="p-5 bg-emerald-50 border border-emerald-100 rounded-3xl space-y-2 mt-4 shadow-sm">
              <p className="text-xs font-black text-emerald-900 uppercase tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                Privacy Protected
              </p>
              <p className="text-[11px] text-emerald-800/80 leading-relaxed font-medium">
                Your data stays strictly on this device. We never upload your personal contact information to any server.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-10 flex gap-4">
        {step > 1 && (
          <button 
            onClick={prevStep}
            className="flex-1 py-5 px-6 rounded-[24px] bg-slate-100 text-slate-600 font-black uppercase text-xs tracking-widest active:scale-95 transition-transform"
          >
            Back
          </button>
        )}
        <button 
          onClick={step === 2 ? handleFinish : nextStep}
          className="flex-[2] py-5 px-6 rounded-[24px] bg-emerald-600 text-white font-black uppercase text-xs tracking-widest shadow-xl shadow-emerald-100 active:scale-95 transition-transform"
        >
          {step === 2 ? "Accept & Start" : "Next Step"}
        </button>
      </div>
    </div>
  );
};

export default SetupScreen;
