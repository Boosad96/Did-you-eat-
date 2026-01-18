
import React, { useState } from 'react';
import { UserSettings } from '../types';
import { APP_VERSION, SUPPORT_EMAIL } from '../constants';
import { 
  ChevronLeft, Save, ShieldAlert, TestTube2, 
  Clock, Info, ShieldCheck, ExternalLink, 
  Mail, Heart, Globe 
} from 'lucide-react';

interface SettingsProps {
  settings: UserSettings;
  onSave: (settings: UserSettings) => void;
  onBack: () => void;
  onTriggerTestSms: () => void;
  onSimulateTimeout: () => void;
}

const SettingsScreen: React.FC<SettingsProps> = ({ settings, onSave, onBack, onTriggerTestSms, onSimulateTimeout }) => {
  const [formData, setFormData] = useState<UserSettings>(settings);
  const [adminMode, setAdminMode] = useState(false);
  const [tapCount, setTapCount] = useState(0);

  const handleHeaderTap = () => {
    const newCount = tapCount + 1;
    setTapCount(newCount);
    if (newCount === 3) {
      setAdminMode(!adminMode);
      setTapCount(0);
    }
    setTimeout(() => setTapCount(0), 2000);
  };

  const handleSave = () => {
    if (!formData.contactPhone.startsWith('+')) {
      alert("Error: Phone number must start with '+' and include the country code.");
      return;
    }
    onSave(formData);
  };

  const handleSupportEmail = () => {
    window.location.href = `mailto:${SUPPORT_EMAIL}?subject=Support: Did You Eat? App`;
  };

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Header */}
      <div className="p-6 pt-8 flex items-center gap-4">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-slate-100 rounded-full transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 
          onClick={handleHeaderTap}
          className="text-2xl font-bold text-slate-800 cursor-pointer select-none active:text-emerald-600"
        >
          Settings
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto px-6 space-y-8 pb-40">
        {/* Section 1: Reminders */}
        <div className="space-y-4">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Reminders</h2>
          <div className="space-y-4 bg-slate-50 p-6 rounded-2xl border border-slate-100">
             <div>
                <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase">Breakfast</label>
                <input 
                  type="time" 
                  value={formData.breakfastTime}
                  onChange={e => setFormData({...formData, breakfastTime: e.target.value})}
                  className="w-full bg-white p-3 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase">Lunch</label>
                <input 
                  type="time" 
                  value={formData.lunchTime}
                  onChange={e => setFormData({...formData, lunchTime: e.target.value})}
                  className="w-full bg-white p-3 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase">Dinner</label>
                <input 
                  type="time" 
                  value={formData.dinnerTime}
                  onChange={e => setFormData({...formData, dinnerTime: e.target.value})}
                  className="w-full bg-white p-3 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
          </div>
        </div>

        {/* Section 2: Emergency Contact */}
        <div className="space-y-4">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Emergency Contact</h2>
          <div className="space-y-4 bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase">Contact Name</label>
                <input 
                  type="text" 
                  value={formData.contactName}
                  onChange={e => setFormData({...formData, contactName: e.target.value})}
                  className="w-full bg-white p-3 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase">
                  Phone Number
                  <span className="ml-2 text-[9px] text-red-500 font-bold">(Include +Code)</span>
                </label>
                <input 
                  type="tel" 
                  value={formData.contactPhone}
                  onChange={e => setFormData({...formData, contactPhone: e.target.value})}
                  placeholder="+15550000000"
                  className="w-full bg-white p-3 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
          </div>
        </div>

        {/* Section 3: Developer & Support (MANDATORY FOR PLAY STORE) */}
        <div className="space-y-4">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Support & Developer</h2>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-100 rounded-lg text-slate-500">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700">App Support</p>
                  <p className="text-[10px] text-slate-400">{SUPPORT_EMAIL}</p>
                </div>
              </div>
              <button 
                onClick={handleSupportEmail}
                className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full"
              >
                CONTACT
              </button>
            </div>

            <div className="flex items-center justify-between border-t border-slate-50 pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-100 rounded-lg text-slate-500">
                  <Globe size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700">Website</p>
                  <p className="text-[10px] text-slate-400">View developer info</p>
                </div>
              </div>
              <ExternalLink size={16} className="text-slate-300" />
            </div>
          </div>
        </div>

        {/* Section 4: Privacy & Data Safety */}
        <div className="space-y-4">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Privacy & Data Safety</h2>
          <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100 space-y-4">
            <div className="flex gap-3">
              <ShieldCheck className="text-emerald-600 shrink-0" size={20} />
              <div>
                <p className="text-sm font-bold text-emerald-900">100% On-Device Storage</p>
                <p className="text-xs text-emerald-700 mt-1 leading-relaxed">
                  Your phone number and meal logs are stored locally. We never upload your data to a server.
                </p>
              </div>
            </div>
            
            <button className="flex items-center gap-2 text-[10px] font-bold text-emerald-600 uppercase tracking-wider bg-emerald-100/50 px-3 py-2 rounded-lg">
              Read Full Privacy Policy <ExternalLink size={12} />
            </button>
          </div>
        </div>

        {/* ADMIN TOOLS */}
        {adminMode && (
          <div className="space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-bold text-red-500 uppercase tracking-widest">Admin / Developer Tools</h2>
              <ShieldAlert size={14} className="text-red-500" />
            </div>
            <div className="space-y-3 bg-red-50/50 p-6 rounded-2xl border border-red-100">
              <button 
                onClick={onTriggerTestSms}
                className="w-full py-3 px-4 bg-white border border-red-200 text-red-600 rounded-xl text-sm font-bold flex items-center justify-center gap-2 active:bg-red-50 transition-colors"
              >
                <TestTube2 size={18} />
                Test SMS Alert
              </button>
              <button 
                onClick={onSimulateTimeout}
                className="w-full py-3 px-4 bg-white border border-red-200 text-red-600 rounded-xl text-sm font-bold flex items-center justify-center gap-2 active:bg-red-50 transition-colors"
              >
                <Clock size={18} />
                Simulate 24h Inactivity
              </button>
            </div>
          </div>
        )}

        {/* Footer Info */}
        <div className="p-8 flex flex-col items-center gap-2">
          <div className="flex items-center gap-1.5 text-slate-300">
            <Heart size={14} fill="currentColor" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Built for Care</span>
          </div>
          <p className="text-[10px] text-slate-400 text-center leading-relaxed">
            Version {APP_VERSION} <br />
            "Did You Eat?" is a safety tool.
          </p>
        </div>
      </div>

      {/* Floating Save Button */}
      <div className="fixed bottom-6 left-0 right-0 px-6 max-w-md mx-auto pointer-events-none">
        <button 
          onClick={handleSave}
          className="w-full py-4 bg-slate-800 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-transform pointer-events-auto"
        >
          <Save size={20} />
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default SettingsScreen;
