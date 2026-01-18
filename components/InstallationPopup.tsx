
import React, { useState } from 'react';
import { X, Download, Share, MoreVertical, Smartphone, ShieldCheck, BookOpen, ChevronRight } from 'lucide-react';

interface InstallationPopupProps {
  onClose: () => void;
}

const InstallationPopup: React.FC<InstallationPopupProps> = ({ onClose }) => {
  const [showResearch, setShowResearch] = useState(false);

  if (showResearch) {
    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
        <div className="bg-white w-full max-w-sm rounded-[32px] overflow-hidden shadow-2xl">
          <div className="p-8 space-y-6">
            <h2 className="text-2xl font-bold text-slate-800">How it Works</h2>
            <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 font-bold">1</div>
                <p>You check in daily by tapping <span className="font-bold">"YES, I ATE"</span> during meal times.</p>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 font-bold">2</div>
                <p>Our 24-hour <span className="font-bold">Safety Monitor</span> runs in the background of your phone.</p>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0 font-bold">3</div>
                <p>If you miss a check-in for 24 hours, the app triggers an <span className="font-bold">SOS SMS</span> to your chosen contact.</p>
              </div>
            </div>
            <button 
              onClick={() => setShowResearch(false)}
              className="w-full py-4 bg-slate-800 text-white rounded-2xl font-bold"
            >
              Back to Install
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-sm rounded-[32px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
        {/* Header Section */}
        <div className="bg-slate-900 p-8 flex flex-col items-center text-center text-white relative">
          <button 
            onClick={onClose}
            title="Close / Cut"
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
          
          <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/20">
            <ShieldCheck size={32} />
          </div>
          <h2 className="text-2xl font-bold">App Installation Required</h2>
          <p className="text-slate-400 text-sm mt-1">Safety features are limited in browser</p>
        </div>

        {/* Body Section */}
        <div className="p-8 space-y-6">
          <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl">
            <p className="text-xs text-amber-800 leading-relaxed font-medium">
              ⚠️ <span className="font-bold">Notice:</span> Browsers stop background timers to save battery. To ensure your 24h safety alert actually works, you <span className="underline">must</span> install the app to your home screen.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Instructions:</h3>
            
            {/* Steps Container */}
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-3">
                  <Smartphone size={16} className="text-slate-400" />
                  <span className="text-sm font-semibold text-slate-700">Android: Tap <MoreVertical size={14} className="inline" /> → Install</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-3">
                  <Smartphone size={16} className="text-slate-400" />
                  <span className="text-sm font-semibold text-slate-700">iPhone: Tap <Share size={14} className="inline" /> → Add to Home</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2 space-y-3">
            <button 
              onClick={onClose}
              className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold shadow-lg shadow-emerald-100 flex items-center justify-center gap-2 active:scale-95 transition-transform"
            >
              <Download size={18} />
              Install App Now
            </button>
            
            <button 
              onClick={() => setShowResearch(true)}
              className="w-full py-3 flex items-center justify-center gap-2 text-slate-500 text-sm font-semibold hover:text-slate-800 transition-colors"
            >
              <BookOpen size={16} />
              How it Works / Research
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstallationPopup;
