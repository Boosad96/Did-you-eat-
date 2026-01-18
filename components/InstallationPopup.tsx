
import React, { useState } from 'react';
import { X, Download, Share, MoreVertical, Smartphone, ShieldCheck, BookOpen, ChevronRight, Zap } from 'lucide-react';

interface InstallationPopupProps {
  onClose: () => void;
  onInstall: () => void;
  isNativeSupported: boolean;
}

const InstallationPopup: React.FC<InstallationPopupProps> = ({ onClose, onInstall, isNativeSupported }) => {
  const [showResearch, setShowResearch] = useState(false);

  if (showResearch) {
    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
        <div className="bg-white w-full max-w-sm rounded-[32px] overflow-hidden shadow-2xl p-8 space-y-6">
          <h2 className="text-2xl font-bold text-slate-800">Safety Logic</h2>
          <div className="space-y-4 text-sm text-slate-600">
            <p>• <strong>Continuous Monitoring:</strong> The app tracks your last check-in timestamp locally.</p>
            <p>• <strong>SOS Trigger:</strong> If 24 hours pass without a 'YES', the SOS screen overrides the UI.</p>
            <p>• <strong>SMS Intent:</strong> We use native OS protocols to ensure the message is ready for you to send instantly.</p>
          </div>
          <button onClick={() => setShowResearch(false)} className="w-full py-4 bg-slate-800 text-white rounded-2xl font-bold">Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-sm rounded-[32px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="bg-emerald-900 p-8 flex flex-col items-center text-center text-white relative">
          <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-white/10 rounded-full"><X size={18} /></button>
          <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center mb-4"><ShieldCheck size={28} /></div>
          <h2 className="text-xl font-bold">Install Safety Tool</h2>
          <p className="text-emerald-300 text-xs mt-1">Enable 24h background protection</p>
        </div>

        <div className="p-8 space-y-6">
          <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex gap-3">
             <Zap size={16} className="text-amber-600 shrink-0" />
             <p className="text-[11px] text-amber-800 font-medium">Installing adds the icon to your home screen and prevents the phone from "sleeping" the safety timer.</p>
          </div>

          {!isNativeSupported && (
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 text-sm">
                <Smartphone size={16} className="text-slate-400" />
                <span className="font-medium text-slate-700">Tap <Share size={14} className="inline mx-1" /> then 'Add to Home Screen'</span>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <button 
              onClick={isNativeSupported ? onInstall : onClose}
              className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold shadow-lg shadow-emerald-100 active:scale-95 transition-transform"
            >
              {isNativeSupported ? "Install Now" : "Got it"}
            </button>
            <button onClick={() => setShowResearch(true)} className="w-full py-2 text-slate-400 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-1">
              <BookOpen size={14} /> How it works
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstallationPopup;
