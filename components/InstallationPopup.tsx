
import React, { useState } from 'react';
import { APP_LOGO } from '../constants.ts';
import { X, Share, Smartphone, BookOpen, Zap } from 'lucide-react';

interface InstallationPopupProps {
  onClose: () => void;
  onInstall: () => void;
  isNativeSupported: boolean;
}

const InstallationPopup: React.FC<InstallationPopupProps> = ({ onClose, onInstall, isNativeSupported }) => {
  const [showResearch, setShowResearch] = useState(false);

  if (showResearch) {
    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/90 backdrop-blur-xl animate-in fade-in duration-300">
        <div className="bg-white w-full max-w-sm rounded-[40px] overflow-hidden shadow-2xl p-10 space-y-6">
          <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-2 mx-auto">
            <img src={APP_LOGO} alt="Logo" className="w-10 h-10 object-contain" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 text-center">Safety Logic</h2>
          <div className="space-y-4 text-sm text-slate-600 font-medium">
            <p>• <strong>Monitor:</strong> The app tracks your last meal timestamp 100% locally.</p>
            <p>• <strong>Deadline:</strong> If 24 hours pass without a 'YES', the emergency protocol triggers.</p>
            <p>• <strong>SMS:</strong> We prepare a message to your emergency contact to ensure you are safe.</p>
          </div>
          <button onClick={() => setShowResearch(false)} className="w-full py-5 bg-slate-900 text-white rounded-3xl font-black uppercase text-xs tracking-widest">Close Information</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/90 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-sm rounded-[48px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="bg-emerald-950 p-10 flex flex-col items-center text-center text-white relative">
          <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"><X size={18} /></button>
          <div className="w-20 h-20 bg-white rounded-[28px] flex items-center justify-center mb-6 shadow-2xl">
            <img src={APP_LOGO} alt="Project Logo" className="w-14 h-14 object-contain" />
          </div>
          <h2 className="text-2xl font-black">Install Safety Tool</h2>
          <p className="text-emerald-400 text-[10px] font-bold uppercase tracking-widest mt-2">Continuous Background Protection</p>
        </div>

        <div className="p-10 space-y-8">
          <div className="p-5 bg-amber-50 border border-amber-100 rounded-[28px] flex gap-4">
             <Zap size={20} className="text-amber-600 shrink-0" />
             <p className="text-[11px] text-amber-900 font-bold leading-relaxed">
               Adding to your home screen prevents the OS from clearing the app memory, ensuring the safety timer remains active.
             </p>
          </div>

          {!isNativeSupported && (
            <div className="space-y-3">
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs font-bold text-slate-700">
                <Smartphone size={18} className="text-slate-400" />
                <span>Tap <Share size={14} className="inline mx-1 text-emerald-600" /> then <span className="text-emerald-600 underline">Add to Home Screen</span></span>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <button 
              onClick={isNativeSupported ? onInstall : onClose}
              className="w-full py-5 bg-emerald-600 text-white rounded-[24px] font-black uppercase text-xs tracking-widest shadow-xl shadow-emerald-100 active:scale-95 transition-transform"
            >
              {isNativeSupported ? "Begin Installation" : "I Understand"}
            </button>
            <button onClick={() => setShowResearch(true)} className="w-full py-2 text-slate-400 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2">
              <BookOpen size={14} /> View Safety Policy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstallationPopup;
