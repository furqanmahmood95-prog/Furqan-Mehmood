import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { RotateCcw, Trophy, Award, Flame, Zap } from 'lucide-react';

interface GameOverModalProps {
  isOpen: boolean;
  score: number;
  highScore: number;
  isNewHighScore: boolean;
  linesCleared: number;
  maxCombo: number;
  onRestart: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  score,
  highScore,
  isNewHighScore,
  linesCleared,
  maxCombo,
  onRestart,
}) => {
  useEffect(() => {
    if (isOpen && isNewHighScore) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00f0ff', '#ff0055', '#ffe600', '#b000ff'],
      });
    }
  }, [isOpen, isNewHighScore]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#05010a]/90 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md bg-[#0f0722] border-2 border-[#ff0055] rounded-2xl p-6 sm:p-8 text-center shadow-[0_0_50px_rgba(255,0,85,0.4)] relative overflow-hidden">
        {/* Neon top accent bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-[#ff0055] to-yellow-400" />

        <div className="inline-flex items-center justify-center p-3 rounded-full bg-red-950/60 border border-red-500/40 text-[#ff0055] mb-3 shadow-[0_0_15px_rgba(255,0,85,0.4)]">
          <Zap className="w-6 h-6 animate-pulse" />
        </div>

        <h2 className="font-orbitron font-black text-2xl sm:text-3xl text-white tracking-widest uppercase mb-1">
          OVERLOAD DETECTED
        </h2>
        <p className="font-rajdhani text-sm text-slate-400 uppercase tracking-widest mb-6">
          GRID EXHAUSTION // PROTOCOL TERMINATED
        </p>

        {isNewHighScore && (
          <div className="mb-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-950/60 border border-yellow-500/50 text-yellow-300 text-xs font-orbitron font-bold tracking-wider animate-bounce">
            <Trophy className="w-3.5 h-3.5" />
            <span>NEW ALL-TIME RECORD!</span>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-[#170c33] border border-cyan-500/20 rounded-xl p-3 text-left">
            <div className="text-[11px] font-rajdhani font-bold text-slate-400 uppercase">Final Score</div>
            <div className="font-orbitron font-black text-2xl text-cyan-400 tabular-nums">
              {score.toLocaleString()}
            </div>
          </div>

          <div className="bg-[#170c33] border border-yellow-500/20 rounded-xl p-3 text-left">
            <div className="text-[11px] font-rajdhani font-bold text-slate-400 uppercase">High Score</div>
            <div className="font-orbitron font-black text-2xl text-yellow-400 tabular-nums">
              {highScore.toLocaleString()}
            </div>
          </div>

          <div className="bg-[#170c33] border border-pink-500/20 rounded-xl p-3 text-left">
            <div className="flex items-center gap-1 text-[11px] font-rajdhani font-bold text-slate-400 uppercase">
              <Award className="w-3 h-3 text-[#ff0055]" />
              <span>Lines Cleared</span>
            </div>
            <div className="font-orbitron font-bold text-xl text-pink-400 tabular-nums">
              {linesCleared}
            </div>
          </div>

          <div className="bg-[#170c33] border border-purple-500/20 rounded-xl p-3 text-left">
            <div className="flex items-center gap-1 text-[11px] font-rajdhani font-bold text-slate-400 uppercase">
              <Flame className="w-3 h-3 text-purple-400" />
              <span>Max Combo</span>
            </div>
            <div className="font-orbitron font-bold text-xl text-purple-400 tabular-nums">
              {maxCombo}x
            </div>
          </div>
        </div>

        {/* Restart Action */}
        <button
          onClick={onRestart}
          className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-orbitron font-bold text-sm tracking-wider uppercase text-white bg-gradient-to-r from-[#ff0055] via-purple-600 to-cyan-500 hover:brightness-110 active:scale-[0.99] shadow-[0_0_20px_rgba(255,0,85,0.5)] transition-all cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>SYSTEM REBOOT</span>
        </button>
      </div>
    </div>
  );
};
