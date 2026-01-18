
import React, { useState } from 'react';
import { UserSettings } from '../types';
import { APP_VERSION, SUPPORT_EMAIL } from '../constants';
import { 
  ChevronLeft, Save, ShieldAlert, TestTube2, 
  Clock, Info, ShieldCheck, ExternalLink, 
  Mail, Heart, Globe, Trash2
} from 'lucide-react';

interface SettingsProps {
  settings: UserSettings;
  onSave: (settings: UserSettings) => void;
  onBack: () => void;
  onTriggerTestSms: () => void;
  onSimulateTimeout: () => void;
  onResetApp: () => void;
}

const SettingsScreen: React.FC<SettingsProps> = ({ settings, onSave, onBack, onTriggerTestSms, onSimulateTimeout, onResetApp }) => {
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

  return (
    <div className="flex-1 flex flex-col bg-slate-50">
      <div className="p-6 pt-10 flex items-center gap-4 bg-white border-b border-slate-100">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full"><ChevronLeft size={24} /></button>
        <h1 onClick={handleHeaderTap} className="text-xl font-bold text-slate-800">Settings</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-6 space-y-6 py-6 pb-32">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 space-y-4">
          <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Reminders</h2>
          <div className="grid grid-cols-1 gap-4">
            {['breakfastTime', 'lunchTime', 'dinnerTime'].map((key) => (
              <div key={key}>
                <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">{key.replace('Time', '')}</label>
                <input type="time" value={(formData as any)[key]} onChange={e => setFormData({...formData, [key]: e.target.value})} className="w-full bg-slate-50 p-3 rounded-xl border border-slate-200 outline-none" />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 space-y-4">
          <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Emergency Contact</h2>
          <input type="text" placeholder="Name" value={formData.contactName} onChange={e => setFormData({...formData, contactName: e.target.value})} className="w-full bg-slate-50 p-3 rounded-xl border border-slate-200 outline-none" />
          <input type="tel" placeholder="+1..." value={formData.contactPhone} onChange={e => setFormData({...formData, contactPhone: e.target.value})} className="w-full bg-slate-50 p-3 rounded-xl border border-slate-200 outline-none" />
        </div>

        <div className="space-y-3">
          <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Privacy & Control</h2>
          <button onClick={onResetApp} className="w-full p-4 bg-white border border-red-100 text-red-600 rounded-2xl text-sm font-bold flex items-center justify-center gap-2">
            <Trash2 size={16} /> Purge All Data (GDPR)
          </button>
        </div>

        {adminMode && (
          <div className="bg-red-50 p-5 rounded-2xl border border-red-100 space-y-3 animate-in fade-in">
            <h2 className="text-[10px] font-bold text-red-600 uppercase">Dev Mode</h2>
            <button onClick={onTriggerTestSms} className="w-full p-3 bg-white border border-red-200 text-red-600 rounded-xl text-xs font-bold">Test SMS</button>
            <button onClick={onSimulateTimeout} className="w-full p-3 bg-white border border-red-200 text-red-600 rounded-xl text-xs font-bold">Force Timeout</button>
          </div>
        )}
      </div>

      <div className="fixed bottom-6 left-0 right-0 px-6 max-w-md mx-auto">
        <button onClick={() => onSave(formData)} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-2xl flex items-center justify-center gap-2">
          <Save size={20} /> Save Changes
        </button>
      </div>
    </div>
  );
};

export default SettingsScreen;
