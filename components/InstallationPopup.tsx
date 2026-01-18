
import React from 'react';
import { X, Download, Share, MoreVertical, Smartphone, Info } from 'lucide-react';

interface InstallationPopupProps {
  onClose: () => void;
}

const InstallationPopup: React.FC<InstallationPopupProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-sm rounded-[32px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
        {/* Header Image/Icon */}
        <div className="bg-emerald-600 p-8 flex flex-col items-center text-center text-white relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/10 hover:bg-black/20 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
          
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
            <Download size={32} />
          </div>
          <h2 className="text-2xl font-bold">Install App</h2>
          <p className="text-emerald-100 text-sm mt-1">Unlock 24h background alerts</p>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          <div className="flex gap-4 items-start">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg shrink-0">
              <Info size={20} />
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              To ensure your <span className="font-bold text-slate-800">24-hour safety timer</span> works correctly, you must add this app to your home screen.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">How to download:</h3>
            
            {/* Android Instructions */}
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-slate-200 shadow-sm">
                  <Smartphone size={16} className="text-slate-400" />
                </div>
                <span className="text-sm font-semibold text-slate-700">Android / Chrome</span>
              </div>
              <div className="flex items-center gap-1 text-slate-400">
                <span className="text-[10px] font-bold">Tap</span>
                <MoreVertical size={16} />
              </div>
            </div>

            {/* iOS Instructions */}
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-slate-200 shadow-sm">
                  <Smartphone size={16} className="text-slate-400" />
                </div>
                <span className="text-sm font-semibold text-slate-700">iPhone / Safari</span>
              </div>
              <div className="flex items-center gap-1 text-slate-400">
                <span className="text-[10px] font-bold">Tap</span>
                <Share size={16} />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button 
              onClick={onClose}
              className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold shadow-lg shadow-emerald-100 active:scale-95 transition-transform"
            >
              Got it, thanks!
            </button>
            <button 
              onClick={onClose}
              className="w-full py-3 mt-2 text-slate-400 text-xs font-semibold hover:text-slate-600 transition-colors"
            >
              I'll do it later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstallationPopup;
