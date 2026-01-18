
import React, { useState } from 'react';
import { UserSettings } from '../types';

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
    <div className="flex-1 flex flex-col p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 mt-4">
        <h1 className="text-3xl font-bold text-slate-800">Welcome</h1>
        <p className="text-slate-500 mt-2">Let's set up your daily care routine.</p>
      </div>

      <div className="flex-1">
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-slate-700">1. Meal Reminder Times</h2>
            <p className="text-sm text-slate-500 italic">When should we remind you to check in?</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Breakfast</label>
                <input 
                  type="time" 
                  value={settings.breakfastTime}
                  onChange={e => setSettings({...settings, breakfastTime: e.target.value})}
                  className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 text-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Lunch</label>
                <input 
                  type="time" 
                  value={settings.lunchTime}
                  onChange={e => setSettings({...settings, lunchTime: e.target.value})}
                  className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 text-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Dinner</label>
                <input 
                  type="time" 
                  value={settings.dinnerTime}
                  onChange={e => setSettings({...settings, dinnerTime: e.target.value})}
                  className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 text-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-slate-700">2. Emergency Contact</h2>
            <p className="text-sm text-slate-500">Who should we alert if you don't respond for 24 hours?</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Contact Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Mary (Daughter)"
                  value={settings.contactName}
                  onChange={e => setSettings({...settings, contactName: e.target.value})}
                  className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 text-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1 flex justify-between">
                  Phone Number 
                  <span className="text-[10px] text-red-500 font-bold uppercase">Required: +Code</span>
                </label>
                <input 
                  type="tel" 
                  placeholder="e.g. +15550000000"
                  value={settings.contactPhone}
                  onChange={e => setSettings({...settings, contactPhone: e.target.value})}
                  className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 text-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl space-y-2 mt-4">
              <p className="text-xs font-bold text-amber-900">Privacy First Approach</p>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                We take your data seriously. This phone number is stored <strong>only</strong> on your device. By continuing, you agree to our privacy policy and allow the app to store this info locally.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 flex gap-4">
        {step > 1 && (
          <button 
            onClick={prevStep}
            className="flex-1 py-4 px-6 rounded-2xl bg-slate-100 text-slate-600 font-semibold hover:bg-slate-200 transition-colors"
          >
            Back
          </button>
        )}
        <button 
          onClick={step === 2 ? handleFinish : nextStep}
          className="flex-[2] py-4 px-6 rounded-2xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-shadow shadow-lg shadow-emerald-200"
        >
          {step === 2 ? "Accept & Finish" : "Next"}
        </button>
      </div>
    </div>
  );
};

export default SetupScreen;
