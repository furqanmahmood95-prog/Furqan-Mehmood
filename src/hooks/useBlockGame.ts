import { useState, useEffect, useCallback, useRef } from 'react';
import { BOARD_SIZE, BoardCell } from '../components/GameBoard';
import { ShapeDef, generateDockBatch, COLOR_CONFIG } from '../utils/shapes';
import { sound } from '../utils/audio';
import { ParticleEngine } from '../utils/particles';
import { GameMode } from '../components/TopNav';

export interface BonusInfo {
  basePoints: number;
  bonusPoints: number;
  totalEarned: number;
  streak: number;
  multiplier: number;
}

export function useBlockGame() {
  const [mode, setMode] = useState<GameMode>('CLASSIC');
  const [board, setBoard] = useState<BoardCell[][]>(() =>
    Array(BOARD_SIZE).fill(null).map(() =>
      Array(BOARD_SIZE).fill(null).map(() => ({ color: null }))
    )
  );

  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => {
    const saved = localStorage.getItem('block_overload_high_score');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [isNewHighScore, setIsNewHighScore] = useState<boolean>(false);

  const [dockShapes, setDockShapes] = useState<(ShapeDef | null)[]>(() => generateDockBatch(3));
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [heldShape, setHeldShape] = useState<ShapeDef | null>(null);

  const [comboStreak, setComboStreak] = useState<number>(1);
  const [maxCombo, setMaxCombo] = useState<number>(1);
  const [lastBonusEarned, setLastBonusEarned] = useState<BonusInfo | null>(null);
  const [linesClearedTotal, setLinesClearedTotal] = useState<number>(0);
  const [overloadEnergy, setOverloadEnergy] = useState<number>(0);

  // Power-ups
  const [empCharges, setEmpCharges] = useState<number>(1);
  const [rerollCharges, setRerollCharges] = useState<number>(2);
  const [isEmpArmed, setIsEmpArmed] = useState<boolean>(false);
  const [empCenter, setEmpCenter] = useState<{ r: number; c: number } | null>(null);

  // Visual effects
  const [blastingCoords, setBlastingCoords] = useState<Set<string>>(new Set());
  const [shakeType, setShakeType] = useState<'none' | 'light' | 'heavy'>('none');
  const [hoverCells, setHoverCells] = useState<{ r: number; c: number }[] | null>(null);
  const [hoverColor, setHoverColor] = useState<string | null>(null);

  // Modals & Game state
  const [isGameOver, setIsGameOver] = useState<boolean>(false);

  // Overdrive Mode timer
  const [overdriveTimeLeft, setOverdriveTimeLeft] = useState<number>(35);

  const particleEngineRef = useRef<ParticleEngine>(new ParticleEngine());

  // Can place shape logic
  const canPlaceShape = useCallback(
    (matrix: number[][], startR: number, startC: number, currentBoard: BoardCell[][] = board): boolean => {
      for (let r = 0; r < matrix.length; r++) {
        for (let c = 0; c < matrix[r].length; c++) {
          if (matrix[r][c] === 1) {
            const targetR = startR + r;
            const targetC = startC + c;
            if (
              targetR < 0 ||
              targetR >= BOARD_SIZE ||
              targetC < 0 ||
              targetC >= BOARD_SIZE ||
              currentBoard[targetR][targetC].color !== null
            ) {
              return false;
            }
          }
        }
      }
      return true;
    },
    [board]
  );

  // Check Game Over logic
  const checkGameOver = useCallback(
    (shapes: (ShapeDef | null)[], currentBoard: BoardCell[][]) => {
      const remaining = shapes.filter((s): s is ShapeDef => s !== null);
      if (remaining.length === 0) return false;

      let canFitAny = false;
      for (const shape of remaining) {
        for (let r = 0; r < BOARD_SIZE; r++) {
          for (let c = 0; c < BOARD_SIZE; c++) {
            if (canPlaceShape(shape.matrix, r, c, currentBoard)) {
              canFitAny = true;
              break;
            }
          }
          if (canFitAny) break;
        }
        if (canFitAny) break;
      }

      if (!canFitAny) {
        setIsGameOver(true);
        sound.playGameOver();
        return true;
      }
      return false;
    },
    [canPlaceShape]
  );

  // Overdrive Mode Countdown
  useEffect(() => {
    if (mode !== 'OVERDRIVE' || isGameOver) return;
    const interval = setInterval(() => {
      setOverdriveTimeLeft((prev) => {
        if (prev <= 1) {
          setIsGameOver(true);
          sound.playGameOver();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [mode, isGameOver]);

  // Screen shake reset helper
  const triggerShake = (intensity: 'light' | 'heavy') => {
    setShakeType(intensity);
    setTimeout(() => {
      setShakeType('none');
    }, intensity === 'heavy' ? 400 : 250);
  };

  // Reset/Reboot Game
  const resetGame = useCallback(() => {
    const newBoard: BoardCell[][] = Array(BOARD_SIZE).fill(null).map(() =>
      Array(BOARD_SIZE).fill(null).map(() => ({ color: null }))
    );

    // If Glitch mode, spawn 3 glitch nodes
    if (mode === 'GLITCH') {
      const placedGlitches: { r: number; c: number }[] = [];
      while (placedGlitches.length < 3) {
        const gr = Math.floor(Math.random() * BOARD_SIZE);
        const gc = Math.floor(Math.random() * BOARD_SIZE);
        if (!placedGlitches.some(g => g.r === gr && g.c === gc)) {
          placedGlitches.push({ r: gr, c: gc });
          newBoard[gr][gc] = { color: 'color-4', isGlitch: true, glitchCountdown: 6 };
        }
      }
    }

    setBoard(newBoard);
    setScore(0);
    setIsNewHighScore(false);
    setComboStreak(1);
    setMaxCombo(1);
    setLinesClearedTotal(0);
    setOverloadEnergy(0);
    setEmpCharges(1);
    setRerollCharges(2);
    setIsEmpArmed(false);
    setEmpCenter(null);
    setSelectedIndex(null);
    setHeldShape(null);
    setHoverCells(null);
    setHoverColor(null);
    setBlastingCoords(new Set());
    setIsGameOver(false);
    setOverdriveTimeLeft(35);
    setLastBonusEarned(null);

    const initialShapes = generateDockBatch(3);
    setDockShapes(initialShapes);
  }, [mode]);

  // Mode Selection handler
  const handleSelectMode = (newMode: GameMode) => {
    setMode(newMode);
  };

  useEffect(() => {
    resetGame();
  }, [mode, resetGame]);

  // Update Score and High Score
  const addScore = useCallback((pts: number) => {
    setScore((prev) => {
      const next = prev + pts;
      if (next > highScore) {
        setHighScore(next);
        setIsNewHighScore(true);
        localStorage.setItem('block_overload_high_score', String(next));
      }
      return next;
    });

    // Surge gauge accumulation
    setOverloadEnergy((prev) => {
      const next = prev + (pts * 0.4);
      if (next >= 100) {
        sound.playHighScore();
        setEmpCharges((c) => Math.min(3, c + 1));
        particleEngineRef.current.addFloatingText('EMP CHARGE GRANTED!', 210, 80, '#00f0ff', 20);
        return next % 100;
      }
      return next;
    });
  }, [highScore]);

  // Check and clear completed lines
  const checkLines = useCallback((currentBoard: BoardCell[][]) => {
    const rowsToClear: number[] = [];
    const colsToClear: number[] = [];

    // Check rows
    for (let r = 0; r < BOARD_SIZE; r++) {
      if (currentBoard[r].every(cell => cell.color !== null)) {
        rowsToClear.push(r);
      }
    }

    // Check cols
    for (let c = 0; c < BOARD_SIZE; c++) {
      let full = true;
      for (let r = 0; r < BOARD_SIZE; r++) {
        if (currentBoard[r][c].color === null) {
          full = false;
          break;
        }
      }
      if (full) colsToClear.push(c);
    }

    const totalLines = rowsToClear.length + colsToClear.length;

    if (totalLines > 0) {
      // Line clear occurred
      const newStreak = comboStreak + 1;
      setComboStreak(newStreak);
      setMaxCombo((prev) => Math.max(prev, newStreak));
      setLinesClearedTotal((prev) => prev + totalLines);

      // Overdrive time bonus
      if (mode === 'OVERDRIVE') {
        setOverdriveTimeLeft((t) => Math.min(60, t + totalLines * 6));
      }

      // Collect cleared coordinates
      const clearedSet = new Set<string>();
      const explosionCells: { x: number; y: number; color: string }[] = [];

      rowsToClear.forEach((r) => {
        for (let c = 0; c < BOARD_SIZE; c++) {
          clearedSet.add(`${r},${c}`);
        }
      });
      colsToClear.forEach((c) => {
        for (let r = 0; r < BOARD_SIZE; r++) {
          clearedSet.add(`${r},${c}`);
        }
      });

      // Sound & Screen Shake
      triggerShake(totalLines > 1 ? 'heavy' : 'light');
      sound.playLineClear(totalLines, newStreak);

      setBlastingCoords(clearedSet);

      // Canvas particles
      clearedSet.forEach((key) => {
        const [r, c] = key.split(',').map(Number);
        const cellColor = currentBoard[r][c].color || 'color-2';
        const colorHex = COLOR_CONFIG[cellColor]?.hex || '#00f0ff';
        // Center position in board coordinates
        const cellX = (c + 0.5) * (400 / BOARD_SIZE);
        const cellY = (r + 0.5) * (400 / BOARD_SIZE);
        explosionCells.push({ x: cellX, y: cellY, color: colorHex });
      });

      particleEngineRef.current.spawnLineClear(explosionCells);

      // Points calculation
      const basePoints = totalLines === 1 ? 10 : totalLines === 2 ? 30 : totalLines === 3 ? 65 : 120;
      const streakMultiplier = 1 + (newStreak - 1) * 0.25;
      const earned = Math.round(basePoints * streakMultiplier);
      const bonusPoints = Math.max(0, earned - basePoints);

      setLastBonusEarned({
        basePoints,
        bonusPoints,
        totalEarned: earned,
        streak: newStreak,
        multiplier: streakMultiplier,
      });

      addScore(earned);

      // Floating text combat feedback showing bonus points prominently
      const bonusSnippet = bonusPoints > 0 ? ` (+${bonusPoints} BONUS!)` : '';
      const label = totalLines >= 3
        ? `MEGA OVERLOAD +${earned}${bonusSnippet}`
        : totalLines === 2
        ? `DUAL CLEAR +${earned}${bonusSnippet}`
        : `LINE CLEAR +${earned}${bonusSnippet}`;
      particleEngineRef.current.addFloatingText(
        label,
        200,
        160,
        totalLines > 1 ? '#ff0055' : newStreak > 1 ? '#ffe600' : '#00f0ff',
        totalLines > 1 ? 22 : 19
      );

      // Clear the cells after brief blast animation
      setTimeout(() => {
        setBoard((prev) => {
          const next = prev.map((row, r) =>
            row.map((cell, c) => {
              if (clearedSet.has(`${r},${c}`)) {
                return { color: null };
              }
              return cell;
            })
          );
          setBlastingCoords(new Set());
          return next;
        });
      }, 300);
    } else {
      // Streak broken if no line cleared
      setComboStreak(1);
      setLastBonusEarned(null);
    }
  }, [comboStreak, mode, addScore]);

  // Place Shape on Board
  const placeShapeAt = useCallback(
    (shape: ShapeDef, startR: number, startC: number, dockIndex?: number) => {
      if (!canPlaceShape(shape.matrix, startR, startC)) {
        sound.playInvalid();
        return false;
      }

      // Copy board and place blocks
      let blocksPlaced = 0;
      const nextBoard = board.map(row => [...row]);

      shape.matrix.forEach((row, r) => {
        row.forEach((val, c) => {
          if (val === 1) {
            nextBoard[startR + r][startC + c] = {
              color: shape.color,
            };
            blocksPlaced++;
          }
        });
      });

      sound.playPlace();
      setBoard(nextBoard);
      addScore(blocksPlaced);

      // Consume from dock or hold
      let newDockShapes = [...dockShapes];
      if (dockIndex !== undefined && dockIndex >= 0) {
        newDockShapes[dockIndex] = null;
      } else if (selectedIndex !== null) {
        newDockShapes[selectedIndex] = null;
      }

      // If all dock shapes used, spawn fresh batch
      if (newDockShapes.every(s => s === null)) {
        newDockShapes = generateDockBatch(3);
      }

      setDockShapes(newDockShapes);
      setSelectedIndex(null);
      setHoverCells(null);
      setHoverColor(null);

      // Check lines
      checkLines(nextBoard);

      // Check game over
      checkGameOver(newDockShapes, nextBoard);

      return true;
    },
    [board, canPlaceShape, addScore, dockShapes, selectedIndex, checkLines, checkGameOver]
  );

  // Cell hover preview calculation
  const handleCellHover = useCallback(
    (row: number, col: number) => {
      if (isEmpArmed) {
        setEmpCenter({ r: row, c: col });
        return;
      }

      const activeShape = selectedIndex !== null ? dockShapes[selectedIndex] : null;
      if (!activeShape) {
        setHoverCells(null);
        setHoverColor(null);
        return;
      }

      if (canPlaceShape(activeShape.matrix, row, col)) {
        const previewCoords: { r: number; c: number }[] = [];
        activeShape.matrix.forEach((rArr, r) => {
          rArr.forEach((val, c) => {
            if (val === 1) {
              previewCoords.push({ r: row + r, c: col + c });
            }
          });
        });
        setHoverCells(previewCoords);
        setHoverColor(activeShape.color);
      } else {
        setHoverCells(null);
        setHoverColor(null);
      }
    },
    [isEmpArmed, selectedIndex, dockShapes, canPlaceShape]
  );

  const handleCellLeave = useCallback(() => {
    if (!isEmpArmed) {
      setHoverCells(null);
      setHoverColor(null);
    }
  }, [isEmpArmed]);

  // Click on cell
  const handleCellClick = useCallback(
    (row: number, col: number) => {
      // EMP power-up execution
      if (isEmpArmed && empCharges > 0) {
        sound.playEmp();
        triggerShake('heavy');

        const nextBoard = board.map(rArr => [...rArr]);
        for (let r = Math.max(0, row - 1); r <= Math.min(BOARD_SIZE - 1, row + 1); r++) {
          for (let c = Math.max(0, col - 1); c <= Math.min(BOARD_SIZE - 1, col + 1); c++) {
            nextBoard[r][c] = { color: null };
          }
        }

        const centerX = (col + 0.5) * (400 / BOARD_SIZE);
        const centerY = (row + 0.5) * (400 / BOARD_SIZE);
        particleEngineRef.current.spawnEmpWave(centerX, centerY);
        particleEngineRef.current.addFloatingText('EMP BLAST!', centerX, centerY - 20, '#ff0055', 24);

        setBoard(nextBoard);
        setEmpCharges((prev) => prev - 1);
        setIsEmpArmed(false);
        setEmpCenter(null);
        checkGameOver(dockShapes, nextBoard);
        return;
      }

      // Tap-to-place selected shape
      if (selectedIndex !== null && dockShapes[selectedIndex]) {
        const shape = dockShapes[selectedIndex]!;
        placeShapeAt(shape, row, col, selectedIndex);
      }
    },
    [isEmpArmed, empCharges, board, dockShapes, selectedIndex, placeShapeAt, checkGameOver]
  );

  // Shape Selection in Dock
  const handleSelectShape = useCallback(
    (index: number) => {
      if (isEmpArmed) {
        setIsEmpArmed(false);
        setEmpCenter(null);
      }

      if (selectedIndex === index) {
        setSelectedIndex(null);
        setHoverCells(null);
        setHoverColor(null);
      } else {
        sound.playPickup();
        setSelectedIndex(index);
      }
    },
    [isEmpArmed, selectedIndex]
  );

  // Hold Matrix Swap/Store
  const handleHoldShape = useCallback(() => {
    if (selectedIndex === null && !heldShape) return;

    sound.playPickup();
    if (selectedIndex !== null && dockShapes[selectedIndex]) {
      const shapeToHold = dockShapes[selectedIndex]!;
      if (!heldShape) {
        // Store in hold, remove from dock
        setHeldShape(shapeToHold);
        const nextDock = [...dockShapes];
        nextDock[selectedIndex] = null;
        if (nextDock.every(s => s === null)) {
          setDockShapes(generateDockBatch(3));
        } else {
          setDockShapes(nextDock);
        }
        setSelectedIndex(null);
      } else {
        // Swap with held shape
        const currentHeld = heldShape;
        setHeldShape(shapeToHold);
        const nextDock = [...dockShapes];
        nextDock[selectedIndex] = currentHeld;
        setDockShapes(nextDock);
      }
    } else if (heldShape) {
      // Pick held shape into active hand
      const emptySlot = dockShapes.findIndex(s => s === null);
      if (emptySlot !== -1) {
        const nextDock = [...dockShapes];
        nextDock[emptySlot] = heldShape;
        setDockShapes(nextDock);
        setHeldShape(null);
        setSelectedIndex(emptySlot);
      }
    }
  }, [selectedIndex, heldShape, dockShapes]);

  // EMP Strike Button Toggle
  const handleTriggerEmp = useCallback(() => {
    if (empCharges <= 0) return;
    setIsEmpArmed((prev) => !prev);
    setSelectedIndex(null);
    setHoverCells(null);
    setHoverColor(null);
  }, [empCharges]);

  // Quantum Reroll
  const handleTriggerReroll = useCallback(() => {
    if (rerollCharges <= 0) return;
    sound.playReroll();
    setRerollCharges((prev) => prev - 1);
    const newShapes = generateDockBatch(3);
    setDockShapes(newShapes);
    setSelectedIndex(null);
    setHoverCells(null);
    setHoverColor(null);
    particleEngineRef.current.addFloatingText('QUANTUM REROLL!', 200, 100, '#ffe600', 20);
    checkGameOver(newShapes, board);
  }, [rerollCharges, board, checkGameOver]);

  // Keyboard controls for 1, 2, 3 shortcuts and Space/R
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isGameOver) return;
      if (e.key === '1' && dockShapes[0]) handleSelectShape(0);
      if (e.key === '2' && dockShapes[1]) handleSelectShape(1);
      if (e.key === '3' && dockShapes[2]) handleSelectShape(2);
      if (e.key.toLowerCase() === 'r' && rerollCharges > 0) handleTriggerReroll();
      if (e.key.toLowerCase() === 'e' && empCharges > 0) handleTriggerEmp();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGameOver, dockShapes, rerollCharges, empCharges, handleSelectShape, handleTriggerReroll, handleTriggerEmp]);

  return {
    board,
    score,
    highScore,
    isNewHighScore,
    mode,
    setMode: handleSelectMode,
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
    particleEngine: particleEngineRef.current,
    resetGame,
    handleCellClick,
    handleCellHover,
    handleCellLeave,
    handleSelectShape,
    handleHoldShape,
    handleTriggerEmp,
    handleTriggerReroll,
    placeShapeAt,
  };
}
