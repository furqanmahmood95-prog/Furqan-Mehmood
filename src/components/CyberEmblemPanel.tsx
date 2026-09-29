import React from 'react';
import { Shield, Sparkles, Volume2, Award, Zap } from 'lucide-react';
import { sound } from '../utils/audio';

interface CyberEmblemPanelProps {
  highScore: number;
  score: number;
}

export const CyberEmblemPanel: React.FC<CyberEmblemPanelProps> = ({ highScore, score }) => {
  const [vol, setVol] = React.useState<number>(0.4);

  const handleVolChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVol(val);
    sound.setVolume(val);
  };

  return (
    <div className="hidden xl:flex flex-col gap-4 w-72 text-slate-300">
      {/* Cyber Core Showcase */}
      <div className="relative overflow-hidden bg-[#0e071e]/90 border border-pink-500/20 rounded-2xl p-4 shadow-[0_4px_25px_rgba(0,0,0,0.6)] backdrop-blur-md flex flex-col items-center text-center">
        <div className="relative w-28 h-28 rounded-xl overflow-hidden mb-3 border border-pink-500/40 shadow-[0_0_20px_rgba(255,0,85,0.3)] bg-gradient-to-b from-[#1a0833] to-[#0a0217] flex items-center justify-center">
          <img
            src="/src/assets/images/cyber_core_matrix_icon_1790699084284.jpg"
            alt="Cyber Core Matrix Emblem"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
            onError={(e) => {
              // Graceful fallback per zero-broken-image policy
              e.currentTarget.style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e071e]/70 via-transparent to-transparent pointer-events-none" />
        </div>

        <h4 className="font-orbitron font-bold text-xs text-pink-400 tracking-wider uppercase mb-1">
          NEURAL MATRIX // 2077
        </h4>
        <p className="font-rajdhani text-xs text-slate-400">
          Overload grid controller calibrated for maximum throughput.
        </p>
      </div>

      {/* Point Multipliers Matrix */}
      <div className="bg-[#0e071e]/90 border border-cyan-500/20 rounded-2xl p-4 shadow-[0_4px_25px_rgba(0,0,0,0.6)] backdrop-blur-md">
        <div className="flex items-center gap-2 pb-2 mb-3 border-b border-cyan-500/20">
          <Award className="w-4 h-4 text-cyan-400" />
          <span className="font-orbitron font-bold text-xs text-cyan-300 tracking-wider">
            DETONATION MATRIX
          </span>
        </div>

        <div className="space-y-1.5 font-rajdhani text-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span>Single Line Clear</span>
            <span className="font-orbitron font-bold text-cyan-300">+10 PTS</span>
          </div>
          <div className="flex items-center justify-between text-slate-400">
            <span>Dual Line Overload</span>
            <span className="font-orbitron font-bold text-cyan-400">+30 PTS</span>
          </div>
          <div className="flex items-center justify-between text-slate-400">
            <span>Triple Line Surge</span>
            <span className="font-orbitron font-bold text-pink-400">+65 PTS</span>
          </div>
          <div className="flex items-center justify-between text-slate-400">
            <span>Quad Core Detonation</span>
            <span className="font-orbitron font-bold text-yellow-400">+120 PTS</span>
          </div>
          <div className="flex items-center justify-between text-slate-400 pt-1 border-t border-slate-800">
            <span>Consecutive Streak</span>
            <span className="font-orbitron font-bold text-emerald-400">Up to 5x</span>
          </div>
        </div>
      </div>

      {/* Master Audio Gain */}
      <div className="bg-[#0e071e]/90 border border-slate-800 rounded-2xl p-4 shadow-[0_4px_25px_rgba(0,0,0,0.6)] backdrop-blur-md">
        <div className="flex items-center justify-between text-xs font-rajdhani font-bold text-slate-400 mb-2">
          <div className="flex items-center gap-1.5">
            <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>SYNTH VOL GAIN</span>
          </div>
          <span className="font-mono-tech text-cyan-400 tabular-nums">
            {Math.round(vol * 100)}%
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={vol}
          onChange={handleVolChange}
          className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-[#180a30] rounded-lg"
        />
      </div>
    </div>
  );
};
