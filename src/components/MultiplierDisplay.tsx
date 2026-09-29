import React from 'react';
import { Flame, TrendingUp, Sparkles } from 'lucide-react';
import { BonusInfo } from '../hooks/useBlockGame';

interface MultiplierDisplayProps {
  comboStreak: number;
  maxCombo: number;
  lastBonusEarned: BonusInfo | null;
}

export const MultiplierDisplay: React.FC<MultiplierDisplayProps> = ({
  comboStreak,
  maxCombo,
  lastBonusEarned,
}) => {
  const multiplier = 1 + (comboStreak - 1) * 0.25;
  const bonusPercent = Math.round((comboStreak - 1) * 25);
  const isActive = comboStreak >= 2;

  // Potential extra bonus points for next clear
  const singleExtra = Math.round(10 * multiplier) - 10;
  const dualExtra = Math.round(30 * multiplier) - 30;
  const tripleExtra = Math.round(65 * multiplier) - 65;

  // Visual tiers for color & glow
  const tier =
    comboStreak >= 5
      ? 'hyper'
      : comboStreak === 4
      ? 'quantum'
      : comboStreak === 3
      ? 'overdrive'
      : comboStreak === 2
      ? 'surge'
      : 'standby';

  const tierStyles = {
    standby: {
      container: 'border-cyan-500/20 bg-[#0c0618]/90 text-slate-400',
      badge: 'bg-slate-800/80 text-slate-400 border-slate-700',
      multiplierText: 'text-cyan-400',
      title: 'COMBO MULTIPLIER // STANDBY',
      flameColor: 'text-slate-500',
    },
    surge: {
      container: 'border-cyan-400/60 bg-[#0e0924] shadow-[0_0_12px_rgba(0,240,255,0.25)]',
      badge: 'bg-cyan-950/70 text-cyan-300 border-cyan-500/50',
      multiplierText: 'text-cyan-300 drop-shadow-[0_0_8px_rgba(0,240,255,0.7)]',
      title: 'CYBER SURGE // LEVEL 1',
      flameColor: 'text-cyan-400',
    },
    overdrive: {
      container: 'border-pink-500/70 bg-[#160726] shadow-[0_0_15px_rgba(255,0,85,0.3)]',
      badge: 'bg-pink-950/70 text-pink-300 border-pink-500/50',
      multiplierText: 'text-[#ff0055] drop-shadow-[0_0_10px_rgba(255,0,85,0.8)]',
      title: 'NEURAL OVERDRIVE // LEVEL 2',
      flameColor: 'text-[#ff0055]',
    },
    quantum: {
      container: 'border-yellow-400/80 bg-[#1a0e28] shadow-[0_0_20px_rgba(255,230,0,0.4)]',
      badge: 'bg-yellow-950/80 text-yellow-300 border-yellow-500/60',
      multiplierText: 'text-yellow-300 drop-shadow-[0_0_12px_rgba(255,230,0,0.9)]',
      title: 'QUANTUM OVERLOAD // LEVEL 3',
      flameColor: 'text-yellow-400',
    },
    hyper: {
      container:
        'border-purple-400 bg-gradient-to-r from-[#1f093a] via-[#2a0736] to-[#12072e] shadow-[0_0_25px_rgba(176,0,255,0.5)]',
      badge: 'bg-purple-950 text-purple-200 border-purple-400',
      multiplierText:
        'text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-[#ff0055] to-cyan-300 drop-shadow-[0_0_12px_rgba(255,0,85,0.9)]',
      title: 'HYPER MATRIX MAXIMUM // OVERCLOCK',
      flameColor: 'text-yellow-300',
    },
  }[tier];

  return (
    <div className="w-full max-w-xl mx-auto mb-1 px-1 sm:px-2 select-none shrink-0">
      {/* Mobile Streamlined 26px Strip */}
      <div
        className={`sm:hidden relative overflow-hidden rounded-md border px-2 h-[26px] flex items-center justify-between transition-colors duration-200 ${tierStyles.container}`}
      >
        <div className="flex items-center gap-1.5 min-w-0">
          <Flame className={`w-3 h-3 shrink-0 ${tierStyles.flameColor}`} />
          <span className={`font-orbitron font-bold text-xs tabular-nums ${tierStyles.multiplierText}`}>
            {multiplier.toFixed(2)}x
          </span>
          {bonusPercent > 0 && (
            <span className="text-[9px] font-mono-tech font-bold text-yellow-300 shrink-0">
              (+{bonusPercent}%)
            </span>
          )}
        </div>
        <div className="text-[9px] font-rajdhani text-slate-300 truncate text-right">
          {lastBonusEarned && lastBonusEarned.bonusPoints > 0 ? (
            <span className="text-pink-300 font-mono-tech font-bold">
              +{lastBonusEarned.bonusPoints} PTS BONUS
            </span>
          ) : (
            <span>Next: +{singleExtra}..+{tripleExtra} pts</span>
          )}
        </div>
      </div>

      {/* Desktop/Tablet Full Display (62px) */}
      <div
        className={`hidden sm:flex relative overflow-hidden rounded-xl border p-2 h-[62px] flex-col justify-between transition-colors duration-200 ${tierStyles.container}`}
      >
        {/* Top Accent Line */}
        {isActive && (
          <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400 via-pink-500 to-transparent" />
        )}

        {/* Row 1: Title, Streak & Multiplier Value */}
        <div className="flex items-center justify-between gap-1.5 h-6">
          <div className="flex items-center gap-1.5 min-w-0">
            <div
              className={`p-1 rounded-md border flex items-center justify-center shrink-0 ${tierStyles.badge}`}
            >
              <Flame className={`w-3.5 h-3.5 ${tierStyles.flameColor}`} />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-orbitron font-bold tracking-wider uppercase text-slate-400 truncate">
                {tierStyles.title}
              </div>
              <div className="text-[11px] font-rajdhani font-semibold text-slate-300 leading-none truncate">
                {comboStreak > 1 ? `${comboStreak} Consecutive Clears` : 'Chain line clears for bonus yield'}
              </div>
            </div>
          </div>

          {/* Multiplier Value */}
          <div className="text-right flex items-baseline gap-1 shrink-0">
            <span
              className={`font-orbitron font-black text-xl tracking-tight tabular-nums ${tierStyles.multiplierText}`}
            >
              {multiplier.toFixed(2)}x
            </span>
            <span
              className={`text-[10px] font-mono-tech font-bold uppercase tracking-wider ${
                isActive ? 'text-yellow-300' : 'text-slate-500'
              }`}
            >
              {bonusPercent > 0 ? `+${bonusPercent}%` : 'BASE'}
            </span>
          </div>
        </div>

        {/* Row 2: 5-Step Segmented Streak Diodes */}
        <div className="grid grid-cols-5 gap-1 my-0.5 shrink-0">
          {[1, 2, 3, 4, 5].map((step) => {
            const isLit = comboStreak >= step;
            const isCurrent = comboStreak === step || (step === 5 && comboStreak >= 5);

            return (
              <div
                key={step}
                className={`h-1 rounded-full transition-colors duration-200 relative overflow-hidden ${
                  isLit
                    ? step >= 4
                      ? 'bg-gradient-to-r from-pink-500 to-yellow-400'
                      : step >= 2
                      ? 'bg-gradient-to-r from-cyan-400 to-[#ff0055]'
                      : 'bg-cyan-500'
                    : 'bg-[#18112e] border border-slate-800'
                } ${isCurrent && isActive ? 'ring-1 ring-white/70' : ''}`}
                title={`Tier ${step}: ${(1 + (step - 1) * 0.25).toFixed(2)}x`}
              />
            );
          })}
        </div>

        {/* Row 3: Single-line fixed info bar */}
        <div className="h-3.5 flex items-center justify-between text-[10px] font-rajdhani text-slate-400 border-t border-cyan-500/10 pt-0.5 truncate">
          {lastBonusEarned && lastBonusEarned.bonusPoints > 0 ? (
            <div className="flex items-center gap-1 text-pink-300 font-mono-tech font-bold truncate">
              <Sparkles className="w-3 h-3 text-[#ff0055] shrink-0" />
              <span className="truncate">
                LAST BLAST: +{lastBonusEarned.bonusPoints} PTS EXTRA (Total {lastBonusEarned.totalEarned})
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1 truncate">
              <TrendingUp className="w-3 h-3 text-cyan-400 shrink-0" />
              <span className="truncate">
                Next clear: +{singleExtra} (1L) · +{dualExtra} (2L) · +{tripleExtra} (3L) extra pts
              </span>
            </div>
          )}

          {maxCombo > 1 && (
            <span className="font-mono-tech text-slate-500 shrink-0 ml-1.5">
              Peak: {maxCombo}x
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
