import React from 'react';
import { Trophy, Zap, Flame, Clock } from 'lucide-react';
import { GameMode } from './TopNav';

interface ScoreHeaderProps {
  score: number;
  highScore: number;
  mode: GameMode;
  comboStreak: number;
  overloadEnergy: number; // 0 - 100%
  overdriveTimeLeft?: number; // for overdrive mode
  glitchesRemaining?: number; // for glitch matrix mode
}

export const ScoreHeader: React.FC<ScoreHeaderProps> = ({
  score,
  highScore,
  mode,
  comboStreak,
  overloadEnergy,
  overdriveTimeLeft,
  glitchesRemaining,
}) => {
  return (
    <div className="w-full max-w-xl mx-auto mb-1 px-1 sm:px-2 shrink-0 select-none">
      {/* 4 Cards in ONE Single Row on all screen sizes */}
      <div className="grid grid-cols-4 gap-1 sm:gap-2 mb-1">
        {/* Score */}
        <div className="relative overflow-hidden bg-[#120a24]/90 border border-cyan-500/30 rounded-lg p-1.5 sm:p-2 shadow-[0_2px_12px_rgba(0,0,0,0.6)]">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400 to-[#ff0055]" />
          <div className="text-[9px] sm:text-[11px] font-rajdhani font-bold text-slate-400 tracking-wider uppercase truncate">
            Score
          </div>
          <div className="font-orbitron font-black text-sm sm:text-lg text-cyan-400 tracking-tight drop-shadow-[0_0_8px_rgba(0,240,255,0.5)] tabular-nums truncate">
            {score.toLocaleString()}
          </div>
        </div>

        {/* High Score */}
        <div className="relative overflow-hidden bg-[#120a24]/90 border border-yellow-500/30 rounded-lg p-1.5 sm:p-2 shadow-[0_2px_12px_rgba(0,0,0,0.6)]">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-yellow-400 to-[#ff0055]" />
          <div className="flex items-center justify-between text-[9px] sm:text-[11px] font-rajdhani font-bold text-slate-400 tracking-wider uppercase truncate">
            <span className="truncate">High</span>
            <Trophy className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-yellow-400 shrink-0" />
          </div>
          <div className="font-orbitron font-black text-sm sm:text-lg text-yellow-400 tracking-tight drop-shadow-[0_0_8px_rgba(255,230,0,0.5)] tabular-nums truncate">
            {highScore.toLocaleString()}
          </div>
        </div>

        {/* Multiplier / Streak Card */}
        <div
          className={`relative overflow-hidden rounded-lg p-1.5 sm:p-2 transition-colors duration-200 ${
            comboStreak >= 2
              ? 'bg-[#18092c] border border-pink-500 shadow-[0_0_12px_rgba(255,0,85,0.4)]'
              : 'bg-[#120a24]/90 border border-pink-500/30 shadow-[0_2px_12px_rgba(0,0,0,0.6)]'
          }`}
        >
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#ff0055] via-pink-400 to-purple-500" />
          <div className="flex items-center justify-between text-[9px] sm:text-[11px] font-rajdhani font-bold text-slate-400 tracking-wider uppercase truncate">
            <span className="truncate">Combo</span>
            <Flame
              className={`w-2.5 h-2.5 sm:w-3 sm:h-3 shrink-0 ${
                comboStreak >= 2 ? 'text-[#ff0055]' : 'text-slate-500'
              }`}
            />
          </div>
          <div className="flex items-baseline justify-between gap-0.5">
            <div className="font-orbitron font-black text-sm sm:text-lg text-[#ff0055] tracking-tight drop-shadow-[0_0_8px_rgba(255,0,85,0.6)] tabular-nums truncate">
              {(1 + (comboStreak - 1) * 0.25).toFixed(2)}x
            </div>
            {comboStreak >= 2 && (
              <span className="text-[8px] sm:text-[10px] font-mono-tech font-bold text-yellow-300">
                +{(comboStreak - 1) * 25}%
              </span>
            )}
          </div>
        </div>

        {/* Mode-Specific Status */}
        <div className="relative overflow-hidden bg-[#120a24]/90 border border-purple-500/30 rounded-lg p-1.5 sm:p-2 shadow-[0_2px_12px_rgba(0,0,0,0.6)]">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-cyan-400" />
          <div className="flex items-center justify-between text-[9px] sm:text-[11px] font-rajdhani font-bold text-slate-400 tracking-wider uppercase truncate">
            <span className="truncate">{mode === 'OVERDRIVE' ? 'Time' : mode === 'GLITCH' ? 'Glitch' : 'Status'}</span>
            {mode === 'OVERDRIVE' ? (
              <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-orange-400 shrink-0" />
            ) : (
              <Zap className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-cyan-400 shrink-0" />
            )}
          </div>
          <div className="font-orbitron font-black text-sm sm:text-lg text-purple-300 tracking-tight tabular-nums truncate">
            {mode === 'OVERDRIVE' && overdriveTimeLeft !== undefined ? (
              <span className={overdriveTimeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-orange-400'}>
                {overdriveTimeLeft}s
              </span>
            ) : mode === 'GLITCH' && glitchesRemaining !== undefined ? (
              <span className="text-yellow-400">{glitchesRemaining}N</span>
            ) : (
              <span className="text-emerald-400 text-xs sm:text-base">ONLINE</span>
            )}
          </div>
        </div>
      </div>

      {/* Overload Surge Meter (Compact) */}
      <div className="bg-[#0e071e]/90 border border-cyan-500/20 rounded-md px-2 py-1 flex items-center gap-1.5">
        <div className="flex items-center gap-1 text-[9px] sm:text-[10px] font-orbitron font-bold text-cyan-400 tracking-wider whitespace-nowrap">
          <Zap className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-cyan-400" />
          <span className="hidden xs:inline">OVERLOAD SURGE</span>
          <span className="xs:hidden">SURGE</span>
        </div>
        <div className="flex-1 h-1.5 bg-[#1a0f30] rounded-full overflow-hidden relative">
          <div
            className="h-full bg-gradient-to-r from-cyan-400 via-[#ff0055] to-yellow-400 transition-all duration-300 rounded-full shadow-[0_0_6px_rgba(0,240,255,0.7)]"
            style={{ width: `${Math.min(100, overloadEnergy)}%` }}
          />
        </div>
        <span className="text-[9px] sm:text-[10px] font-mono-tech text-slate-400 tabular-nums">
          {Math.floor(overloadEnergy)}%
        </span>
      </div>
    </div>
  );
};
