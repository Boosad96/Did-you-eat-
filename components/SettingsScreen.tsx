
import React, { useState, useEffect } from 'react';
import { UserSettings } from '../types';
import { APP_VERSION, SUPPORT_EMAIL, APP_LOGO } from '../constants';
import { notificationService } from '../services/notificationService.ts';
import { 
  ChevronLeft, Save, ShieldAlert, TestTube2, 
  Clock, Info, ShieldCheck, ExternalLink, 
  Mail, Heart, Globe, Trash2, Bell, BellOff, CheckCircle, Copy, Check
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
  const [notifPermission, setNotifPermission] = useState(Notification.permission);
  const [copied, setCopied] = useState(false);

  const ethAddress = "0x73cf2b2eb72a243602e9dcda9efec6473e5c1741";

  useEffect(() => {
    const interval = setInterval(() => {
      setNotifPermission(Notification.permission);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleHeaderTap = () => {
    const newCount = tapCount + 1;
    setTapCount(newCount);
    if (newCount === 3) {
      setAdminMode(!adminMode);
      setTapCount(0);
    }
    setTimeout(() => setTapCount(0), 2000);
  };

  const handleCopyEth = () => {
    navigator.clipboard.writeText(ethAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleNotifications = async () => {
    if (notifPermission === 'denied') {
      alert("Notification access is blocked in your browser settings. Please enable them for this site to receive safety reminders.");
      return;
    }
    const granted = await notificationService.requestPermission();
    setNotifPermission(granted ? 'granted' : 'denied');
    if (granted) {
      notificationService.sendNotification("Test Notification", "This is how we'll remind you to check in.");
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50">
      <div className="p-6 pt-10 flex items-center gap-4 bg-white border-b border-slate-100">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full"><ChevronLeft size={24} /></button>
        <h1 onClick={handleHeaderTap} className="text-xl font-bold text-slate-800">Settings</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-6 space-y-6 py-6 pb-32">
        {/* Notification Status Section */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 space-y-4">
          <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Notification Status</h2>
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
             <div className="flex items-center gap-3">
               {notifPermission === 'granted' ? (
                 <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg"><Bell size={18} /></div>
               ) : (
                 <div className="p-2 bg-red-100 text-red-600 rounded-lg"><BellOff size={18} /></div>
               )}
               <div>
                 <p className="text-xs font-bold text-slate-800">
                   {notifPermission === 'granted' ? 'Reminders Active' : 'Reminders Disabled'}
                 </p>
                 <p className="text-[10px] text-slate-500 font-medium">
                   {notifPermission === 'granted' ? 'You will receive meal nudges.' : 'You will not be reminded.'}
                 </p>
               </div>
             </div>
             <button 
               onClick={handleToggleNotifications}
               className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 ${
                 notifPermission === 'granted'
                   ? 'bg-white border border-slate-200 text-slate-400'
                   : 'bg-emerald-600 text-white shadow-lg shadow-emerald-100'
               }`}
             >
               {notifPermission === 'granted' ? 'Verify' : 'Enable'}
             </button>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 space-y-4">
          <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Reminder Windows</h2>
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

        {/* Support & About Section */}
        <div className="space-y-4">
          <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Support & About</h2>
          
          <div className="bg-slate-900 rounded-2xl p-6 text-white space-y-4 shadow-xl shadow-slate-200">
            <div className="flex items-center gap-2 text-emerald-400">
              <Heart size={16} />
              <p className="text-[10px] font-black uppercase tracking-widest">Support Development</p>
            </div>
            <p className="text-xs font-medium text-slate-300 leading-relaxed">
              This app is open-source and free forever. Optional donations help keep the safety systems running.
            </p>
            <button 
              onClick={handleCopyEth}
              className="w-full bg-white/10 hover:bg-white/15 border border-white/10 p-4 rounded-xl flex flex-col gap-1 text-left transition-colors relative"
            >
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">[ETH] Address</span>
                {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} className="text-slate-500" />}
              </div>
              <p className="text-[11px] font-mono break-all text-emerald-100">{ethAddress}</p>
              {copied && <span className="absolute top-4 right-10 text-[9px] font-black text-emerald-400 uppercase">Copied!</span>}
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            <a 
              href={`mailto:${SUPPORT_EMAIL}`}
              className="w-full p-4 flex items-center justify-between border-b border-slate-50 active:bg-slate-50"
            >
              <div className="flex items-center gap-3 text-slate-700">
                <div className="p-2 bg-slate-50 rounded-lg text-slate-400"><Mail size={18} /></div>
                <span className="text-sm font-bold">Contact Support</span>
              </div>
              <ChevronLeft size={16} className="text-slate-300 rotate-180" />
            </a>
            <div className="p-4 flex items-center justify-between bg-white">
              <div className="flex items-center gap-3 text-slate-700">
                <div className="p-2 bg-slate-50 rounded-lg text-slate-400"><Info size={18} /></div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold">App Version</span>
                  <span className="text-[10px] text-slate-400 font-medium">Build v{APP_VERSION}</span>
                </div>
              </div>
              <div className="px-3 py-1 bg-slate-50 rounded-full">
                <span className="text-[10px] font-black text-slate-400">STABLE</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3 pb-6">
          <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Privacy & Control</h2>
          <button onClick={onResetApp} className="w-full p-4 bg-white border border-red-100 text-red-600 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 active:bg-red-50">
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
        <button onClick={() => onSave(formData)} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-2xl flex items-center justify-center gap-2 active:scale-95 transition-transform">
          <Save size={20} /> Save Changes
        </button>
      </div>
    </div>
  );
};

export default SettingsScreen;
