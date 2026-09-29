import React, { useRef, useEffect } from 'react';
import { COLOR_CONFIG, ShapeDef } from '../utils/shapes';
import { ParticleEngine } from '../utils/particles';

export const BOARD_SIZE = 8;

export interface BoardCell {
  color: string | null; // e.g. 'color-1' or null
  isGlitch?: boolean;
  glitchCountdown?: number;
}

interface GameBoardProps {
  board: BoardCell[][];
  blastingCoords: Set<string>;
  hoverCells: { r: number; c: number }[] | null;
  hoverColor: string | null;
  isEmpTargeting: boolean;
  empCenter: { r: number; c: number } | null;
  onCellClick: (row: number, col: number) => void;
  onCellHover: (row: number, col: number) => void;
  onCellLeave: () => void;
  particleEngine: ParticleEngine;
  shakeType: 'none' | 'light' | 'heavy';
}

export const GameBoard: React.FC<GameBoardProps> = ({
  board,
  blastingCoords,
  hoverCells,
  hoverColor,
  isEmpTargeting,
  empCenter,
  onCellClick,
  onCellHover,
  onCellLeave,
  particleEngine,
  shakeType,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Initialize canvas particle engine on mount & handle resize
  useEffect(() => {
    if (canvasRef.current) {
      particleEngine.init(canvasRef.current);
    }
    return () => {
      particleEngine.destroy();
    };
  }, [particleEngine]);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current && canvasRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        canvasRef.current.width = rect.width;
        canvasRef.current.height = rect.height;
        particleEngine.resize(rect.width, rect.height);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [particleEngine]);

  const isCellHovered = (r: number, c: number) => {
    if (!hoverCells) return false;
    return hoverCells.some(cell => cell.r === r && cell.c === c);
  };

  const isEmpAffected = (r: number, c: number) => {
    if (!isEmpTargeting || !empCenter) return false;
    return Math.abs(empCenter.r - r) <= 1 && Math.abs(empCenter.c - c) <= 1;
  };

  return (
    <div
      ref={containerRef}
      style={{
        width: 'min(92vw, calc(100dvh - 280px), 380px)',
        height: 'min(92vw, calc(100dvh - 280px), 380px)',
        maxWidth: '380px',
        maxHeight: '380px',
      }}
      className="relative aspect-square mx-auto p-1.5 sm:p-2.5 rounded-xl sm:rounded-2xl bg-[#0e071e]/90 border border-cyan-500/30 shadow-[0_0_25px_rgba(0,0,0,0.9),inset_0_0_15px_rgba(0,0,0,0.8)] select-none touch-none shrink-0"
      onMouseLeave={onCellLeave}
    >
      {/* 8x8 Grid Container */}
      <div className="grid grid-cols-8 grid-rows-8 gap-1 sm:gap-1.5 w-full h-full">
        {board.map((row, r) =>
          row.map((cell, c) => {
            const coordKey = `${r},${c}`;
            const isBlasting = blastingCoords.has(coordKey);
            const isHover = isCellHovered(r, c);
            const isEmp = isEmpAffected(r, c);
            const cellColorInfo = cell.color ? COLOR_CONFIG[cell.color] : null;
            const previewColorInfo = hoverColor ? COLOR_CONFIG[hoverColor] : null;

            return (
              <div
                key={coordKey}
                data-row={r}
                data-col={c}
                onClick={() => onCellClick(r, c)}
                onMouseEnter={() => onCellHover(r, c)}
                className={`relative rounded-md transition-colors duration-100 flex items-center justify-center cursor-pointer overflow-hidden touch-none select-none ${
                  isBlasting
                    ? 'bg-white z-20 shadow-[0_0_25px_#ffffff]'
                    : isEmp
                    ? 'bg-red-600/40 border border-red-500 shadow-[0_0_15px_rgba(255,0,85,0.7)] animate-pulse'
                    : isHover
                    ? 'border border-cyan-400/90 z-10 ring-1 ring-cyan-400'
                    : cell.color
                    ? 'border border-transparent shadow-md'
                    : 'bg-[#0d1222] border border-[#1a233d]/70 hover:border-cyan-500/40'
                }`}
                style={{
                  backgroundColor: isBlasting
                    ? '#ffffff'
                    : isEmp
                    ? 'rgba(255, 0, 85, 0.4)'
                    : isHover && previewColorInfo
                    ? `${previewColorInfo.hex}77`
                    : cellColorInfo
                    ? cellColorInfo.hex
                    : undefined,
                  borderColor: isHover && previewColorInfo
                    ? previewColorInfo.border
                    : cellColorInfo
                    ? cellColorInfo.border
                    : undefined,
                  boxShadow: isBlasting
                    ? '0 0 25px #ffffff, 0 0 40px #ff0055'
                    : isHover && previewColorInfo
                    ? `0 0 15px ${previewColorInfo.glow}`
                    : cellColorInfo
                    ? `0 0 10px ${cellColorInfo.glow}, inset 0 0 6px rgba(255,255,255,0.4)`
                    : undefined,
                }}
              >
                {/* Tech circuit micro-texture for placed block */}
                {cell.color && !isBlasting && (
                  <div className="absolute inset-0 bg-gradient-to-br from-white/25 via-transparent to-black/40 pointer-events-none rounded-[5px]" />
                )}

                {/* Glitch Node Indicator */}
                {cell.isGlitch && (
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <span className="font-orbitron font-black text-xs text-yellow-300 drop-shadow-[0_0_6px_#ffe600] animate-pulse">
                      {cell.glitchCountdown ?? 5}
                    </span>
                  </div>
                )}

                {/* EMP Target Crosshair on center */}
                {isEmpTargeting && empCenter?.r === r && empCenter?.c === c && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-5 h-5 rounded-full border-2 border-red-400 animate-ping opacity-75" />
                    <div className="w-2 h-2 rounded-full bg-red-400" />
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* FX Canvas Overlay for Particles and Floating Scores */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-30"
      />
    </div>
  );
};
