import React, { useState, useRef, useEffect, useCallback } from 'react';
import { TopNav, GameMode } from './components/TopNav';
import { ScoreHeader } from './components/ScoreHeader';
import { MultiplierDisplay } from './components/MultiplierDisplay';
import { GameBoard, BOARD_SIZE } from './components/GameBoard';
import { ShapeDock } from './components/ShapeDock';
import { GameOverModal } from './components/GameOverModal';
import { HowToPlayModal } from './components/HowToPlayModal';
import { CyberTerminal } from './components/CyberTerminal';
import { CyberEmblemPanel } from './components/CyberEmblemPanel';
import { useBlockGame } from './hooks/useBlockGame';
import { sound } from './utils/audio';

export default function App() {
  const {
    board,
    score,
    highScore,
    isNewHighScore,
    mode,
    setMode,
    dockShapes,
    selectedIndex,
    heldShape,
    comboStreak,
    maxCombo,
    lastBonusEarned,
    linesClearedTotal,
    overloadEnergy,
    empCharges,
    rerollCharges,
    isEmpArmed,
    empCenter,
    blastingCoords,
    shakeType,
    hoverCells,
    hoverColor,
    isGameOver,
    overdriveTimeLeft,
    particleEngine,
    resetGame,
    handleCellClick,
    handleCellHover,
    handleCellLeave,
    handleSelectShape,
    handleHoldShape,
    handleTriggerEmp,
    handleTriggerReroll,
    placeShapeAt,
  } = useBlockGame();

  const [crtEnabled, setCrtEnabled] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(() => sound.getMuted());
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);

  // Dragging states
  const draggedShapeIndexRef = useRef<number | null>(null);
  const [isDraggingTouch, setIsDraggingTouch] = useState<boolean>(false);
  const [touchGhostPos, setTouchGhostPos] = useState<{ x: number; y: number } | null>(null);

  const handleToggleMute = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  const handleToggleCrt = () => {
    setCrtEnabled((prev) => !prev);
  };

  // Desktop HTML5 Drag Handlers
  const handleDragStartShape = (index: number, e: React.DragEvent) => {
    draggedShapeIndexRef.current = index;
    handleSelectShape(index);
    e.dataTransfer.setData('text/plain', String(index));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOverBoard = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';

    const target = document.elementFromPoint(e.clientX, e.clientY)?.closest('[data-row]') as HTMLElement | null;
    if (target && target.dataset.row && target.dataset.col) {
      const r = parseInt(target.dataset.row, 10);
      const c = parseInt(target.dataset.col, 10);
      handleCellHover(r, c);
    }
  };

  const handleDropBoard = (e: React.DragEvent) => {
    e.preventDefault();
    const index = draggedShapeIndexRef.current;
    if (index === null || !dockShapes[index]) return;

    const target = document.elementFromPoint(e.clientX, e.clientY)?.closest('[data-row]') as HTMLElement | null;
    if (target && target.dataset.row && target.dataset.col) {
      const r = parseInt(target.dataset.row, 10);
      const c = parseInt(target.dataset.col, 10);
      placeShapeAt(dockShapes[index]!, r, c, index);
    }

    draggedShapeIndexRef.current = null;
    handleCellLeave();
  };

  // Mobile Touch Drag Handlers
  const handleTouchStartShape = (index: number, e: React.TouchEvent) => {
    if (!dockShapes[index]) return;
    if (e.cancelable) e.preventDefault();
    e.stopPropagation();

    draggedShapeIndexRef.current = index;
    handleSelectShape(index);
    setIsDraggingTouch(true);

    const touch = e.touches[0];
    setTouchGhostPos({ x: touch.clientX, y: touch.clientY - 60 });
  };

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDraggingTouch || draggedShapeIndexRef.current === null) return;
    if (e.cancelable) e.preventDefault();
    e.stopPropagation();

    const touch = e.touches[0];
    setTouchGhostPos({ x: touch.clientX, y: touch.clientY - 60 });

    // Identify cell under touch pointer
    const target = document.elementFromPoint(touch.clientX, touch.clientY - 60)?.closest('[data-row]') as HTMLElement | null;
    if (target && target.dataset.row && target.dataset.col) {
      const r = parseInt(target.dataset.row, 10);
      const c = parseInt(target.dataset.col, 10);
      handleCellHover(r, c);
    } else {
      handleCellLeave();
    }
  }, [isDraggingTouch, handleCellHover, handleCellLeave]);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (!isDraggingTouch || draggedShapeIndexRef.current === null) return;
    if (e.cancelable) e.preventDefault();
    e.stopPropagation();

    const touch = e.changedTouches[0];
    const target = document.elementFromPoint(touch.clientX, touch.clientY - 60)?.closest('[data-row]') as HTMLElement | null;
    const index = draggedShapeIndexRef.current;

    if (target && target.dataset.row && target.dataset.col && index !== null && dockShapes[index]) {
      const r = parseInt(target.dataset.row, 10);
      const c = parseInt(target.dataset.col, 10);
      placeShapeAt(dockShapes[index]!, r, c, index);
    }

    draggedShapeIndexRef.current = null;
    setIsDraggingTouch(false);
    setTouchGhostPos(null);
    handleCellLeave();
  }, [isDraggingTouch, dockShapes, placeShapeAt, handleCellLeave]);

  // Global listener to completely lock mobile screen scrolling and gestures
  useEffect(() => {
    const handleGlobalTouch = (e: TouchEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest('.modal-scrollable')) return;
      if (e.cancelable) {
        e.preventDefault();
      }
    };

    const handleTouchStartGlobal = (e: TouchEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest('.modal-scrollable') || target?.tagName === 'BUTTON' || target?.tagName === 'A') return;
      if (target?.closest('.shape-slot') || target?.closest('[data-row]')) {
        if (e.cancelable) {
          e.preventDefault();
        }
      }
    };

    document.addEventListener('touchstart', handleTouchStartGlobal, { passive: false });
    document.addEventListener('touchmove', handleGlobalTouch, { passive: false });
    return () => {
      document.removeEventListener('touchstart', handleTouchStartGlobal);
      document.removeEventListener('touchmove', handleGlobalTouch);
    };
  }, []);

  useEffect(() => {
    if (isDraggingTouch) {
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('touchend', handleTouchEnd);
      return () => {
        window.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isDraggingTouch, handleTouchMove, handleTouchEnd]);

  const activeShape = selectedIndex !== null ? dockShapes[selectedIndex] : null;

  return (
    <div className="fixed inset-0 h-[100dvh] w-full bg-[#05010a] text-white flex flex-col justify-between overflow-hidden font-rajdhani select-none touch-none">
      {/* Background Cyberpunk Cityscape */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-20 bg-cover bg-center"
        style={{ backgroundImage: `url('/src/assets/images/cyberpunk_grid_backdrop_1790699071328.jpg')` }}
      />
      <div className="fixed inset-0 bg-radial from-transparent via-[#05010a]/80 to-[#05010a] pointer-events-none z-0" />

      {/* CRT Scanline Overlay */}
      {crtEnabled && (
        <div className="fixed inset-0 crt-overlay z-50 pointer-events-none" />
      )}

      {/* Top Bar Header */}
      <TopNav
        currentMode={mode}
        onSelectMode={setMode}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        crtEnabled={crtEnabled}
        onToggleCrt={handleToggleCrt}
        onResetGame={resetGame}
        onOpenHelp={() => setIsHelpOpen(true)}
        streak={comboStreak}
      />

      {/* Main Viewport Stage - Centered in Viewport */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-1 sm:px-4 flex justify-center items-center gap-4 xl:gap-8 z-10 py-0.5 sm:py-2 min-h-0 overflow-hidden">
        {/* Left Terminal HUD for wide screens */}
        <CyberTerminal
          mode={mode}
          score={score}
          highScore={highScore}
          linesClearedTotal={linesClearedTotal}
          maxCombo={maxCombo}
          comboStreak={comboStreak}
          lastBonusEarned={lastBonusEarned}
          empCharges={empCharges}
          rerollCharges={rerollCharges}
        />

        {/* Center Game Arena - Firmly Centered, Auto-Adjusting & Stationary */}
        <div
          className="flex flex-col items-center justify-between sm:justify-center w-full max-w-[400px] h-full max-h-full mx-auto my-auto overflow-hidden"
          onDragOver={handleDragOverBoard}
          onDrop={handleDropBoard}
        >
          {/* Header Scores & Surge Gauge */}
          <ScoreHeader
            score={score}
            highScore={highScore}
            mode={mode}
            comboStreak={comboStreak}
            overloadEnergy={overloadEnergy}
            overdriveTimeLeft={overdriveTimeLeft}
          />

          {/* Dynamic Visual Multiplier & Extra Points Display (Fixed Height) */}
          <MultiplierDisplay
            comboStreak={comboStreak}
            maxCombo={maxCombo}
            lastBonusEarned={lastBonusEarned}
          />

          {/* Interactive 8x8 Board & FX Canvas */}
          <GameBoard
            board={board}
            blastingCoords={blastingCoords}
            hoverCells={hoverCells}
            hoverColor={hoverColor}
            isEmpTargeting={isEmpArmed}
            empCenter={empCenter}
            onCellClick={handleCellClick}
            onCellHover={handleCellHover}
            onCellLeave={handleCellLeave}
            particleEngine={particleEngine}
            shakeType={shakeType}
          />

          {/* Bottom Shapes Dock & Powers */}
          <ShapeDock
            dockShapes={dockShapes}
            selectedIndex={selectedIndex}
            heldShape={heldShape}
            empCharges={empCharges}
            rerollCharges={rerollCharges}
            isEmpArmed={isEmpArmed}
            onSelectShape={handleSelectShape}
            onDragStartShape={handleDragStartShape}
            onTouchStartShape={handleTouchStartShape}
            onHoldShape={handleHoldShape}
            onTriggerEmp={handleTriggerEmp}
            onTriggerReroll={handleTriggerReroll}
          />
        </div>

        {/* Right Emblem & Multipliers HUD for wide screens */}
        <CyberEmblemPanel highScore={highScore} score={score} />
      </main>

      {/* Floating Ghost Element during Mobile Touch Dragging */}
      {isDraggingTouch && touchGhostPos && activeShape && (
        <div
          className="fixed pointer-events-none z-50 transform -translate-x-1/2 -translate-y-1/2 opacity-95 filter drop-shadow-[0_0_12px_rgba(0,240,255,0.8)]"
          style={{
            left: `${touchGhostPos.x}px`,
            top: `${touchGhostPos.y}px`,
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${activeShape.matrix[0].length}, 16px)`,
              gap: '2px',
            }}
          >
            {activeShape.matrix.map((row, r) =>
              row.map((val, c) => (
                <div
                  key={`${r}-${c}`}
                  className="w-4 h-4 rounded-[2.5px] border border-cyan-300 bg-cyan-400 shadow-[0_0_6px_#00f0ff]"
                  style={{ opacity: val === 1 ? 1 : 0 }}
                />
              ))
            )}
          </div>
        </div>
      )}

      {/* Game Over Modal */}
      <GameOverModal
        isOpen={isGameOver}
        score={score}
        highScore={highScore}
        isNewHighScore={isNewHighScore}
        linesCleared={linesClearedTotal}
        maxCombo={maxCombo}
        onRestart={resetGame}
      />

      {/* How To Play Modal */}
      <HowToPlayModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />

      {/* Quiet Footer (Hidden on tiny mobile to give maximum room to playing board) */}
      <footer className="w-full py-1 text-center text-[10px] sm:text-[11px] font-rajdhani text-slate-500 z-10 border-t border-cyan-500/10 shrink-0 hidden xs:block">
        <span>BLOCK OVERLOAD 2077</span>
        <span className="mx-2">·</span>
        <span>Neural Matrix Grid System</span>
      </footer>
    </div>
  );
}
