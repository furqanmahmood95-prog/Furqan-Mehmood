import React from 'react';
import { X, Target, Zap, Flame, Move, MousePointer, ShieldCheck } from 'lucide-react';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#05010a]/85 backdrop-blur-md animate-fadeIn">
      <div className="modal-scrollable w-full max-w-lg bg-[#0e071e] border border-cyan-500/30 rounded-2xl p-6 text-white shadow-[0_0_40px_rgba(0,240,255,0.25)] relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/60 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <ShieldCheck className="w-5 h-5 text-cyan-400" />
          <h2 className="font-orbitron font-bold text-lg sm:text-xl tracking-wider text-cyan-300 uppercase">
            OPERATOR MANUAL // PROTOCOLS
          </h2>
        </div>

        <div className="space-y-4 text-sm font-rajdhani text-slate-300">
          <div className="bg-[#150c2e] p-3 rounded-xl border border-cyan-500/20">
            <h3 className="font-orbitron text-xs font-bold text-cyan-400 uppercase flex items-center gap-1.5 mb-1.5">
              <Move className="w-4 h-4 text-cyan-400" />
              1. Tactical Placement Controls
            </h3>
            <p className="text-xs leading-relaxed text-slate-300">
              Drag shapes from the bottom dock directly onto the 8x8 matrix, or tap a shape to select it, then tap your target grid position. Placement preview gives instant visual feedback. Keyboard shortcuts <span className="text-cyan-400 font-mono">[1]</span>, <span className="text-cyan-400 font-mono">[2]</span>, <span className="text-cyan-400 font-mono">[3]</span> select shapes instantly.
            </p>
          </div>

          <div className="bg-[#150c2e] p-3 rounded-xl border border-pink-500/20">
            <h3 className="font-orbitron text-xs font-bold text-[#ff0055] uppercase flex items-center gap-1.5 mb-1.5">
              <Target className="w-4 h-4 text-[#ff0055]" />
              2. Line Overloads & Blast Points
            </h3>
            <p className="text-xs leading-relaxed text-slate-300">
              Fill any entire horizontal row or vertical column to detonate a neon line clear. Detonating multiple rows or columns simultaneously multiplies your point yield exponentially!
            </p>
          </div>

          <div className="bg-[#150c2e] p-3 rounded-xl border border-yellow-500/20">
            <h3 className="font-orbitron text-xs font-bold text-yellow-400 uppercase flex items-center gap-1.5 mb-1.5">
              <Flame className="w-4 h-4 text-yellow-400" />
              3. Combo Streaks & Surge Multipliers
            </h3>
            <p className="text-xs leading-relaxed text-slate-300">
              Clearing lines on consecutive turns builds your combo multiplier up to 5x. Maintaining combos charges the Overload Gauge at the top.
            </p>
          </div>

          <div className="bg-[#150c2e] p-3 rounded-xl border border-purple-500/20">
            <h3 className="font-orbitron text-xs font-bold text-purple-400 uppercase flex items-center gap-1.5 mb-1.5">
              <Zap className="w-4 h-4 text-purple-400" />
              4. Cyber Power-ups & Quantum Hold
            </h3>
            <ul className="text-xs leading-relaxed space-y-1 text-slate-300">
              <li>
                <strong className="text-red-400">EMP Strike:</strong> Vaporizes any 3x3 block section instantly.
              </li>
              <li>
                <strong className="text-yellow-400">Quantum Reroll:</strong> Discards current pieces and issues 3 fresh shapes.
              </li>
              <li>
                <strong className="text-purple-300">Hold Matrix:</strong> Store an awkward shape for later tactical deployment.
              </li>
            </ul>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full py-2.5 px-4 bg-cyan-500 hover:bg-cyan-400 text-[#05010a] font-orbitron font-bold text-xs tracking-wider uppercase rounded-xl transition-all shadow-[0_0_15px_rgba(0,240,255,0.4)] cursor-pointer"
        >
          ENGAGE MATRIX
        </button>
      </div>
    </div>
  );
};
