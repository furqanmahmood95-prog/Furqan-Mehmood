import React from 'react';
import { Volume2, VolumeX, Monitor, RotateCcw, HelpCircle, ShieldAlert } from 'lucide-react';

export type GameMode = 'CLASSIC' | 'OVERDRIVE' | 'GLITCH';

interface TopNavProps {
  currentMode: GameMode;
  onSelectMode: (mode: GameMode) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  crtEnabled: boolean;
  onToggleCrt: () => void;
  onResetGame: () => void;
  onOpenHelp: () => void;
  streak: number;
}

export const TopNav: React.FC<TopNavProps> = ({
  currentMode,
  onSelectMode,
  isMuted,
  onToggleMute,
  crtEnabled,
  onToggleCrt,
  onResetGame,
  onOpenHelp,
  streak,
}) => {
  return (
    <header className="w-full max-w-6xl mx-auto px-2 sm:px-4 py-1.5 sm:py-2.5 flex items-center justify-between border-b border-cyan-500/20 bg-[#0d071a]/90 backdrop-blur-md sticky top-0 z-40 shrink-0">
      {/* Zone 1: Single text element wordmark in Orbitron display face */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onSelectMode('CLASSIC');
          }}
          className="font-orbitron font-black text-sm sm:text-lg tracking-wider uppercase bg-gradient-to-r from-white via-cyan-400 to-[#ff0055] bg-clip-text text-transparent hover:opacity-90 transition-opacity whitespace-nowrap"
        >
          <span className="sm:hidden">BLOCK OVERLOAD</span>
          <span className="hidden sm:inline">BLOCK OVERLOAD 2077</span>
        </a>
        {streak >= 2 && (
          <span className="inline-flex items-center gap-1 font-mono-tech text-[10px] sm:text-xs text-yellow-400 px-1.5 py-0.5 rounded border border-yellow-500/40 bg-yellow-950/30 animate-pulse">
            <ShieldAlert className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-yellow-400" />
            <span>{streak}x</span>
          </span>
        )}
      </div>

      {/* Zone 2: Mode controls & Help */}
      <nav className="flex items-center gap-1">
        <div className="flex items-center bg-[#150e2a] border border-cyan-500/20 p-0.5 sm:p-1 rounded-lg">
          <button
            onClick={() => onSelectMode('CLASSIC')}
            className={`px-1.5 sm:px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-xs font-rajdhani font-bold tracking-wider rounded transition-all whitespace-nowrap ${
              currentMode === 'CLASSIC'
                ? 'bg-cyan-500 text-[#05010a] shadow-[0_0_10px_rgba(0,240,255,0.5)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Classic
          </button>
          <button
            onClick={() => onSelectMode('OVERDRIVE')}
            className={`px-1.5 sm:px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-xs font-rajdhani font-bold tracking-wider rounded transition-all whitespace-nowrap ${
              currentMode === 'OVERDRIVE'
                ? 'bg-[#ff0055] text-white shadow-[0_0_10px_rgba(255,0,85,0.5)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Surge
          </button>
          <button
            onClick={() => onSelectMode('GLITCH')}
            className={`px-1.5 sm:px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-xs font-rajdhani font-bold tracking-wider rounded transition-all whitespace-nowrap ${
              currentMode === 'GLITCH'
                ? 'bg-purple-600 text-white shadow-[0_0_10px_rgba(176,0,255,0.5)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Glitch
          </button>
        </div>

        <button
          onClick={onOpenHelp}
          title="Field Manual & Rules"
          className="p-1 sm:p-1.5 text-slate-400 hover:text-cyan-400 transition-colors rounded hover:bg-cyan-950/30"
          aria-label="How to play"
        >
          <HelpCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
      </nav>

      {/* Zone 3: 1-2 primary actions & hardware toggles */}
      <div className="flex items-center gap-1 sm:gap-1.5">
        <button
          onClick={onToggleMute}
          title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          className={`p-1 sm:p-1.5 rounded transition-all ${
            isMuted ? 'text-red-400 bg-red-950/30 border border-red-500/30' : 'text-cyan-400 hover:bg-cyan-950/30'
          }`}
          aria-label="Toggle Audio"
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
        </button>

        <button
          onClick={onToggleCrt}
          title={crtEnabled ? 'Disable CRT Scanlines' : 'Enable CRT Scanlines'}
          className={`hidden xs:flex p-1 sm:p-1.5 rounded transition-all ${
            crtEnabled ? 'text-green-400 bg-green-950/30 border border-green-500/30' : 'text-slate-400 hover:text-white'
          }`}
          aria-label="Toggle CRT Scanlines"
        >
          <Monitor className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>

        <button
          onClick={onResetGame}
          title="Reboot Board"
          className="flex items-center gap-1 px-2 sm:px-2.5 py-1 text-[11px] sm:text-xs font-rajdhani font-bold tracking-wider text-white bg-gradient-to-r from-[#ff0055] to-purple-600 hover:from-[#ff1a6c] hover:to-purple-500 rounded border border-pink-500/30 shadow-[0_0_10px_rgba(255,0,85,0.3)] transition-all whitespace-nowrap active:scale-95"
        >
          <RotateCcw className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          <span className="hidden sm:inline">REBOOT</span>
        </button>
      </div>
    </header>
  );
};
