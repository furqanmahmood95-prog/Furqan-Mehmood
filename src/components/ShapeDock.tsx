import React from 'react';
import { ShapeDef, COLOR_CONFIG } from '../utils/shapes';
import { Zap, RefreshCw, Archive, Sparkles } from 'lucide-react';

interface ShapeDockProps {
  dockShapes: (ShapeDef | null)[];
  selectedIndex: number | null;
  heldShape: ShapeDef | null;
  empCharges: number;
  rerollCharges: number;
  isEmpArmed: boolean;
  onSelectShape: (index: number) => void;
  onDragStartShape: (index: number, e: React.DragEvent) => void;
  onTouchStartShape: (index: number, e: React.TouchEvent) => void;
  onHoldShape: () => void;
  onTriggerEmp: () => void;
  onTriggerReroll: () => void;
}

export const ShapeDock: React.FC<ShapeDockProps> = ({
  dockShapes,
  selectedIndex,
  heldShape,
  empCharges,
  rerollCharges,
  isEmpArmed,
  onSelectShape,
  onDragStartShape,
  onTouchStartShape,
  onHoldShape,
  onTriggerEmp,
  onTriggerReroll,
}) => {
  return (
    <div className="w-full max-w-xl mx-auto mt-1 sm:mt-2 px-1 sm:px-2 shrink-0 select-none touch-none">
      {/* 3 Dock Slots */}
      <div className="flex items-center justify-between gap-1.5 sm:gap-2.5 bg-[#0e071e]/90 border border-cyan-500/20 rounded-xl sm:rounded-2xl p-1.5 sm:p-2.5 shadow-[0_4px_20px_rgba(0,0,0,0.7)] touch-none">
        {dockShapes.map((shape, idx) => {
          const isSelected = selectedIndex === idx;
          const colorInfo = shape ? COLOR_CONFIG[shape.color] : null;

          return (
            <div
              key={idx}
              onClick={() => shape && onSelectShape(idx)}
              onDragStart={(e) => shape && onDragStartShape(idx, e)}
              onTouchStart={(e) => {
                if (shape) {
                  onTouchStartShape(idx, e);
                }
              }}
              className={`shape-slot relative flex-1 h-[68px] sm:h-24 rounded-lg sm:rounded-xl flex items-center justify-center transition-colors duration-150 cursor-pointer touch-none select-none ${
                !shape
                  ? 'bg-[#090414]/50 border-2 border-slate-800/60 cursor-default'
                  : isSelected
                  ? 'bg-[#180a32] border-2 border-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.45)] ring-1 ring-cyan-400/50'
                  : 'bg-[#120826]/80 border-2 border-cyan-500/20 hover:border-cyan-400/60 hover:bg-[#160a30]'
              }`}
            >
              {/* Keyboard Key Hint */}
              <span className="absolute top-1 left-1.5 text-[9px] sm:text-[10px] font-mono-tech text-slate-500 uppercase select-none pointer-events-none">
                [{idx + 1}]
              </span>

              {shape ? (
                <div
                  draggable={false}
                  className="shape-preview p-1 flex flex-col items-center justify-center pointer-events-none touch-none select-none"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${shape.matrix[0].length}, minmax(0, 1fr))`,
                    gap: '2px',
                  }}
                >
                  {shape.matrix.map((row, r) =>
                    row.map((val, c) => (
                      <div
                        key={`${r}-${c}`}
                        className={`w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-[2.5px] transition-colors pointer-events-none ${
                          val === 1 ? 'shadow-sm' : 'opacity-0'
                        }`}
                        style={{
                          backgroundColor: val === 1 && colorInfo ? colorInfo.hex : 'transparent',
                          borderColor: val === 1 && colorInfo ? colorInfo.border : 'transparent',
                          boxShadow: val === 1 && colorInfo ? `0 0 5px ${colorInfo.glow}` : undefined,
                        }}
                      />
                    ))
                  )}
                </div>
              ) : (
                <span className="text-slate-600 text-[10px] sm:text-xs font-mono-tech uppercase select-none pointer-events-none">EMPTY</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Cyber Power-up & Tactical Tray */}
      <div className="flex items-center justify-between gap-1 sm:gap-2 mt-1 sm:mt-1.5 touch-none">
        {/* Hold Matrix / Storage */}
        <button
          onClick={onHoldShape}
          disabled={!heldShape && selectedIndex === null}
          className={`flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg text-[10px] sm:text-xs font-rajdhani font-bold tracking-wider transition-all border ${
            heldShape
              ? 'bg-purple-950/70 text-purple-300 border-purple-500/50 hover:bg-purple-900/60 shadow-[0_0_8px_rgba(176,0,255,0.3)]'
              : selectedIndex !== null
              ? 'bg-[#150d2c] text-cyan-400 border-cyan-500/30 hover:bg-[#1f1440]'
              : 'bg-[#0e071e]/50 text-slate-600 border-slate-800 cursor-not-allowed'
          }`}
          title="Store or recall piece in Quantum Hold"
        >
          <Archive className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          <span className="hidden xs:inline">HOLD MATRIX</span>
          <span className="xs:hidden">HOLD</span>
          {heldShape && <span className="text-purple-300">(1)</span>}
        </button>

        <div className="flex items-center gap-1 sm:gap-1.5">
          {/* EMP Power-up */}
          <button
            onClick={onTriggerEmp}
            disabled={empCharges <= 0}
            className={`flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg text-[10px] sm:text-xs font-rajdhani font-bold tracking-wider transition-all border ${
              isEmpArmed
                ? 'bg-red-600 text-white border-red-400 shadow-[0_0_12px_rgba(255,0,85,0.6)] animate-pulse'
                : empCharges > 0
                ? 'bg-cyan-950/60 text-cyan-300 border-cyan-500/40 hover:bg-cyan-900/60'
                : 'bg-[#0e071e]/50 text-slate-600 border-slate-800 cursor-not-allowed'
            }`}
            title="Arm EMP Strike (Vaporizes 3x3 area)"
          >
            <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span>EMP ({empCharges})</span>
          </button>

          {/* Reroll Power-up */}
          <button
            onClick={onTriggerReroll}
            disabled={rerollCharges <= 0}
            className={`flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg text-[10px] sm:text-xs font-rajdhani font-bold tracking-wider transition-all border ${
              rerollCharges > 0
                ? 'bg-yellow-950/60 text-yellow-300 border-yellow-500/40 hover:bg-yellow-900/60'
                : 'bg-[#0e071e]/50 text-slate-600 border-slate-800 cursor-not-allowed'
            }`}
            title="Scramble dock shapes"
          >
            <RefreshCw className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span>REROLL ({rerollCharges})</span>
          </button>
        </div>
      </div>

      {/* Control instruction hint */}
      <div className="hidden xs:flex items-center justify-center gap-1.5 mt-1 text-center text-[10px] sm:text-[11px] font-rajdhani font-medium text-slate-400 pointer-events-none select-none">
        <Sparkles className="w-2.5 h-2.5 text-cyan-400" />
        <span>Tap piece to select & deploy, or drag directly onto grid</span>
      </div>
    </div>
  );
};
