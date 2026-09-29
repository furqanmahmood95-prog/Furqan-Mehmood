import React from 'react';
import { Shield, Cpu, Activity, Sparkles, Terminal, Keyboard, Flame } from 'lucide-react';
import { GameMode } from './TopNav';
import { BonusInfo } from '../hooks/useBlockGame';

interface CyberTerminalProps {
  mode: GameMode;
  score: number;
  highScore: number;
  linesClearedTotal: number;
  maxCombo: number;
  comboStreak: number;
  lastBonusEarned: BonusInfo | null;
  empCharges: number;
  rerollCharges: number;
}

export const CyberTerminal: React.FC<CyberTerminalProps> = ({
  mode,
  score,
  highScore,
  linesClearedTotal,
  maxCombo,
  comboStreak,
  lastBonusEarned,
  empCharges,
  rerollCharges,
}) => {
  const efficiency = linesClearedTotal > 0 ? (score / (linesClearedTotal * 10)).toFixed(1) : '1.0';
  const currentMultiplier = (1 + (comboStreak - 1) * 0.25).toFixed(2);
  const bonusPct = (comboStreak - 1) * 25;

  return (
    <div className="hidden xl:flex flex-col gap-4 w-72 text-slate-300">
      {/* System Hardware Diagnostics */}
      <div className="bg-[#0e071e]/90 border border-cyan-500/20 rounded-2xl p-4 shadow-[0_4px_25px_rgba(0,0,0,0.6)] backdrop-blur-md">
        <div className="flex items-center justify-between pb-2 mb-3 border-b border-cyan-500/20">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span className="font-orbitron font-bold text-xs text-cyan-300 tracking-wider">
              CORE METRICS
            </span>
          </div>
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
          </span>
        </div>

        <div className="space-y-2.5 font-rajdhani text-xs">
          <div className="flex items-center justify-between bg-[#150a2e] px-2.5 py-1.5 rounded-lg border border-cyan-500/10">
            <span className="text-slate-400 uppercase">Active Matrix</span>
            <span className="font-orbitron font-bold text-cyan-400">8 x 8 GRID</span>
          </div>

          {/* Real-time Multiplier telemetry row */}
          <div
            className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg border transition-all ${
              comboStreak >= 2
                ? 'bg-[#1b0933] border-pink-500/50 shadow-[0_0_12px_rgba(255,0,85,0.3)]'
                : 'bg-[#150a2e] border-cyan-500/10'
            }`}
          >
            <div className="flex items-center gap-1.5 text-slate-400 uppercase">
              <Flame
                className={`w-3.5 h-3.5 ${
                  comboStreak >= 2 ? 'text-[#ff0055] animate-bounce' : 'text-slate-500'
                }`}
              />
              <span>Surge Multiplier</span>
            </div>
            <div className="text-right">
              <span
                className={`font-orbitron font-bold tabular-nums ${
                  comboStreak >= 2 ? 'text-[#ff0055]' : 'text-slate-300'
                }`}
              >
                {currentMultiplier}x
              </span>
              {bonusPct > 0 && (
                <span className="block text-[9px] font-mono-tech text-yellow-300">
                  +{bonusPct}% Extra Pts
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between bg-[#150a2e] px-2.5 py-1.5 rounded-lg border border-cyan-500/10">
            <span className="text-slate-400 uppercase">Total Lines Blasted</span>
            <span className="font-orbitron font-bold text-pink-400 tabular-nums">
              {linesClearedTotal}
            </span>
          </div>

          <div className="flex items-center justify-between bg-[#150a2e] px-2.5 py-1.5 rounded-lg border border-cyan-500/10">
            <span className="text-slate-400 uppercase">Peak Multiplier</span>
            <span className="font-orbitron font-bold text-purple-400 tabular-nums">
              {maxCombo}x
            </span>
          </div>

          <div className="flex items-center justify-between bg-[#150a2e] px-2.5 py-1.5 rounded-lg border border-cyan-500/10">
            <span className="text-slate-400 uppercase">Yield Efficiency</span>
            <span className="font-orbitron font-bold text-yellow-400 tabular-nums">
              {efficiency}x
            </span>
          </div>

          <div className="flex items-center justify-between bg-[#150a2e] px-2.5 py-1.5 rounded-lg border border-cyan-500/10">
            <span className="text-slate-400 uppercase">EMP Reserves</span>
            <span className="font-orbitron font-bold text-cyan-400 tabular-nums">
              {empCharges} / 3
            </span>
          </div>
        </div>
      </div>

      {/* Cyber Tactical Hotkeys */}
      <div className="bg-[#0e071e]/90 border border-purple-500/20 rounded-2xl p-4 shadow-[0_4px_25px_rgba(0,0,0,0.6)] backdrop-blur-md">
        <div className="flex items-center gap-2 pb-2 mb-3 border-b border-purple-500/20">
          <Keyboard className="w-4 h-4 text-purple-400" />
          <span className="font-orbitron font-bold text-xs text-purple-300 tracking-wider">
            TACTICAL CONTROLS
          </span>
        </div>

        <div className="space-y-2 text-xs font-rajdhani text-slate-300">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Select Dock Shapes</span>
            <span className="font-mono-tech text-cyan-400 bg-[#160a30] px-1.5 py-0.5 rounded border border-cyan-500/30">
              Keys [1], [2], [3]
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Trigger EMP Strike</span>
            <span className="font-mono-tech text-red-400 bg-[#160a30] px-1.5 py-0.5 rounded border border-red-500/30">
              Key [E]
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Quantum Reroll</span>
            <span className="font-mono-tech text-yellow-400 bg-[#160a30] px-1.5 py-0.5 rounded border border-yellow-500/30">
              Key [R]
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Deploy Method</span>
            <span className="text-emerald-400">Drag or Tap-to-Place</span>
          </div>
        </div>
      </div>

      {/* Mode Briefing */}
      <div className="bg-[#0e071e]/90 border border-yellow-500/20 rounded-2xl p-4 shadow-[0_4px_25px_rgba(0,0,0,0.6)] backdrop-blur-md">
        <div className="flex items-center gap-2 pb-2 mb-2 border-b border-yellow-500/20">
          <Terminal className="w-4 h-4 text-yellow-400" />
          <span className="font-orbitron font-bold text-xs text-yellow-300 tracking-wider uppercase">
            PROTOCOL // {mode}
          </span>
        </div>
        <p className="font-rajdhani text-xs text-slate-300 leading-relaxed">
          {mode === 'CLASSIC' && 'Standard endless block placement. Maximize point yield through dual and triple line detonations.'}
          {mode === 'OVERDRIVE' && 'Rapid overdrive surge. The clock drains continuously—blast rows and columns to siphon time back!'}
          {mode === 'GLITCH' && 'Glitch anomaly matrices detected. Align line clears with glitch nodes to defuse them before detonation.'}
        </p>
      </div>
    </div>
  );
};
