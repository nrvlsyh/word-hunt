import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ArrowDown } from 'lucide-react';
import { PlacedWord } from '../utils/wordSearchGenerator';
import { getWordColor } from '../utils/pastelColors';
import { soundManager } from '../utils/sound';
import { Language } from '../data/words';
import { getUIText } from '../utils/translations';

interface CellCoord {
  row: number;
  col: number;
}

interface WordGridProps {
  grid: string[][];
  size: number;
  placedWords: PlacedWord[];
  onWordFound: (wordText: string) => void;
  hintCell: CellCoord | null;
  darkMode: boolean;
  onGridTouch?: () => void;
  language?: Language;
  onScrollToWordList?: () => void;
}

export const WordGrid: React.FC<WordGridProps> = ({
  grid,
  size,
  placedWords,
  onWordFound,
  hintCell,
  darkMode,
  onGridTouch,
  language = 'en',
  onScrollToWordList,
}) => {
  const t = getUIText(language);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [startCell, setStartCell] = useState<CellCoord | null>(null);
  const [currentCell, setCurrentCell] = useState<CellCoord | null>(null);
  const [selectedCells, setSelectedCells] = useState<CellCoord[]>([]);
  const [tappedCell, setTappedCell] = useState<CellCoord | null>(null);

  const pointerStartRef = useRef<{
    x: number;
    y: number;
    id: number;
    cell: CellCoord;
    time: number;
  } | null>(null);

  const remainingCount = placedWords.filter((w) => !w.found).length;

  // Map of "row-col" -> PlacedWord[] that contain this cell and are found
  const foundCellMap = React.useMemo(() => {
    const map = new Map<string, PlacedWord[]>();
    placedWords.forEach((pw) => {
      if (pw.found) {
        pw.cells.forEach((c) => {
          const key = `${c.row}-${c.col}`;
          const list = map.get(key) || [];
          list.push(pw);
          map.set(key, list);
        });
      }
    });
    return map;
  }, [placedWords]);

  // Compute straight-line path between two cells (strict 8 directions)
  const computeStraightLine = useCallback(
    (start: CellCoord, end: CellCoord): CellCoord[] => {
      const dRow = end.row - start.row;
      const dCol = end.col - start.col;

      if (dRow === 0 && dCol === 0) {
        return [start];
      }

      const absRow = Math.abs(dRow);
      const absCol = Math.abs(dCol);

      // Check if it's horizontal, vertical, or 45-degree diagonal
      const isHorizontal = dRow === 0 && dCol !== 0;
      const isVertical = dCol === 0 && dRow !== 0;
      const isDiagonal = absRow === absCol;

      if (!isHorizontal && !isVertical && !isDiagonal) {
        return [start];
      }

      const stepRow = dRow === 0 ? 0 : dRow > 0 ? 1 : -1;
      const stepCol = dCol === 0 ? 0 : dCol > 0 ? 1 : -1;
      const length = Math.max(absRow, absCol);

      const path: CellCoord[] = [];
      for (let i = 0; i <= length; i++) {
        const r = start.row + i * stepRow;
        const c = start.col + i * stepCol;
        if (r >= 0 && r < size && c >= 0 && c < size) {
          path.push({ row: r, col: c });
        }
      }

      return path;
    },
    [size]
  );

  // Coordinate hit testing from clientX and clientY
  const getCellFromCoords = useCallback(
    (clientX: number, clientY: number): CellCoord | null => {
      if (!containerRef.current) return null;
      const rect = containerRef.current.getBoundingClientRect();

      if (
        clientX < rect.left ||
        clientX > rect.right ||
        clientY < rect.top ||
        clientY > rect.bottom
      ) {
        return null;
      }

      const relX = clientX - rect.left;
      const relY = clientY - rect.top;

      const cellWidth = rect.width / size;
      const cellHeight = rect.height / size;

      const col = Math.floor(relX / cellWidth);
      const row = Math.floor(relY / cellHeight);

      if (row >= 0 && row < size && col >= 0 && col < size) {
        return { row, col };
      }
      return null;
    },
    [size]
  );

  // Helper to validate and award found word
  const checkAndAwardWord = useCallback(
    (cells: CellCoord[]): boolean => {
      if (cells.length < 2) return false;
      const selectedWord = cells.map((c) => grid[c.row][c.col]).join('');
      const reversedWord = cells
        .slice()
        .reverse()
        .map((c) => grid[c.row][c.col])
        .join('');

      const matched = placedWords.find(
        (pw) => !pw.found && (pw.word === selectedWord || pw.word === reversedWord)
      );

      if (matched) {
        onWordFound(matched.word);
        return true;
      }
      return false;
    },
    [grid, placedWords, onWordFound]
  );

  // Handle tap-to-select letter pair (Tap 1st letter, tap last letter)
  const handleCellTap = (cell: CellCoord) => {
    if (!tappedCell) {
      setTappedCell(cell);
      soundManager.playCellHover(1);
      soundManager.triggerVibrate(15);
      return;
    }

    // If tapped the same cell again, cancel selection
    if (tappedCell.row === cell.row && tappedCell.col === cell.col) {
      setTappedCell(null);
      soundManager.playClick();
      return;
    }

    // Connect straight line between tappedCell and new cell
    const line = computeStraightLine(tappedCell, cell);
    if (line.length >= 2) {
      const found = checkAndAwardWord(line);
      if (found) {
        setTappedCell(null);
      } else {
        soundManager.playInvalid();
        setTappedCell(cell);
      }
    } else {
      setTappedCell(cell);
    }
  };

  // Start drag selection
  const startDragSelection = useCallback((coord: CellCoord) => {
    setIsSelecting(true);
    setStartCell(coord);
    setCurrentCell(coord);
    setSelectedCells([coord]);
    soundManager.playCellHover(0);
    soundManager.triggerVibrate(15);
  }, []);

  // Move drag selection
  const handleMoveSelection = (coord: CellCoord) => {
    if (!isSelecting || !startCell) return;
    if (coord.row === currentCell?.row && coord.col === currentCell?.col) return;

    setCurrentCell(coord);
    const line = computeStraightLine(startCell, coord);
    if (line.length !== selectedCells.length) {
      soundManager.playCellHover(line.length);
    }
    setSelectedCells(line);
  };

  // End drag selection & check for valid word
  const handleEndSelection = useCallback(() => {
    if (!isSelecting) return;
    setIsSelecting(false);

    if (selectedCells.length >= 2) {
      const found = checkAndAwardWord(selectedCells);
      if (!found) {
        soundManager.playInvalid();
      }
    }

    setStartCell(null);
    setCurrentCell(null);
    setSelectedCells([]);
  }, [isSelecting, selectedCells, checkAndAwardWord]);

  // Pointer event handlers on grid:
  // Immediately captures pointer so dragging up, down, left, right, and diagonal
  // selects words without the browser intercepting up/down as a scroll!
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    onGridTouch?.();

    const cell = getCellFromCoords(e.clientX, e.clientY);
    if (!cell) return;

    pointerStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      id: e.pointerId,
      cell,
      time: Date.now(),
    };

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // ignore
    }
    startDragSelection(cell);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isSelecting) return;
    const cell = getCellFromCoords(e.clientX, e.clientY);
    if (cell) {
      handleMoveSelection(cell);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }
    }

    if (pointerStartRef.current) {
      const dx = Math.abs(e.clientX - pointerStartRef.current.x);
      const dy = Math.abs(e.clientY - pointerStartRef.current.y);

      // If it was a tap on a single letter without dragging (< 12px movement):
      if (dx < 12 && dy < 12 && selectedCells.length <= 1) {
        setIsSelecting(false);
        setSelectedCells([]);
        setStartCell(null);
        setCurrentCell(null);
        handleCellTap(pointerStartRef.current.cell);
        pointerStartRef.current = null;
        return;
      }
    }

    // If dragged across 2 or more letters:
    if (selectedCells.length >= 2) {
      handleEndSelection();
      setTappedCell(null);
    } else {
      setIsSelecting(false);
      setSelectedCells([]);
      setStartCell(null);
      setCurrentCell(null);
    }

    pointerStartRef.current = null;
  };

  const handlePointerCancel = () => {
    setIsSelecting(false);
    setSelectedCells([]);
    setStartCell(null);
    setCurrentCell(null);
    pointerStartRef.current = null;
  };

  // Global pointer up safety in case pointer is released outside window
  useEffect(() => {
    const handleGlobalUp = () => {
      if (isSelecting) {
        handleEndSelection();
      }
    };
    window.addEventListener('pointerup', handleGlobalUp);
    return () => {
      window.removeEventListener('pointerup', handleGlobalUp);
    };
  }, [isSelecting, handleEndSelection]);

  // Formed word string currently being dragged
  const currentDraggingString = selectedCells
    .map((c) => grid[c.row]?.[c.col] || '')
    .join('');

  // Font size responsive classes based on grid size
  const fontClass =
    size <= 8
      ? 'text-lg sm:text-2xl font-bold'
      : size <= 10
      ? 'text-base sm:text-xl font-bold'
      : size <= 12
      ? 'text-xs sm:text-base md:text-lg font-bold'
      : 'text-[11px] sm:text-xs md:text-sm font-bold';

  const handleScrollToBottom = () => {
    soundManager.playClick();
    if (onScrollToWordList) {
      onScrollToWordList();
    } else {
      const el = document.getElementById('stationary-word-list');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <div className="relative flex flex-col items-center select-none w-full max-w-[480px] mx-auto px-1 sm:px-0">
      {/* Mobile Top Bar: Words counter & Quick Scroll Button */}
      <div className="w-full flex items-center justify-between gap-2 mb-2 lg:hidden px-1">
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
          {t.wordsToFind}: <strong className="text-rose-500">{remainingCount} left</strong>
        </span>

        {/* Quick Jump to Word Hunt Button */}
        <button
          type="button"
          onClick={handleScrollToBottom}
          className="px-3 py-1.5 rounded-2xl bg-rose-50 hover:bg-rose-100 dark:bg-slate-800 dark:hover:bg-slate-700 border border-rose-200/80 dark:border-slate-700 text-rose-600 dark:text-rose-400 text-xs font-bold shadow-xs flex items-center gap-1.5 active:scale-95 transition-all"
        >
          <ArrowDown className="w-3.5 h-3.5" />
          <span>{t.jumpToWords || 'Words'}</span>
        </button>
      </div>

      {/* Floating Status Pill: Dragged letters or Tap instructions */}
      <div className="h-9 flex items-center justify-center mb-2 px-2 text-center">
        {isSelecting && currentDraggingString.length > 0 ? (
          <div className="animate-scale-in px-4 py-1 rounded-full bg-rose-500 text-white font-mono tracking-widest text-sm font-extrabold shadow-md flex items-center gap-1.5">
            <span>{currentDraggingString}</span>
          </div>
        ) : tappedCell ? (
          <div className="animate-scale-in px-3.5 py-1 rounded-full bg-amber-500 text-white text-xs font-bold shadow-md flex items-center gap-1.5">
            <span>
              Tapped: [{grid[tappedCell.row][tappedCell.col]}] · Tap end letter to complete word
            </span>
          </div>
        ) : (
          <div className="text-xs text-slate-400 dark:text-slate-500 font-medium">
            Drag across letters in any direction or tap 1st & last letter
          </div>
        )}
      </div>

      {/* Crossword Grid Container:
          Uses touch-none and immediate pointer capture so that dragging in ALL directions
          (horizontal, vertical, diagonal) selects words without the browser intercepting up/down as scroll! */}
      <div
        ref={containerRef}
        onTouchStart={onGridTouch}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        className="w-full aspect-square p-2 sm:p-3 bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-rose-100 dark:border-slate-800 touch-none grid select-none relative overflow-hidden transition-all cursor-crosshair"
        style={{
          gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${size}, minmax(0, 1fr))`,
          gap: size <= 10 ? '4px' : '2px',
        }}
      >
        {grid.map((row, r) =>
          row.map((letter, c) => {
            const isCurrentlySelected = selectedCells.some(
              (cell) => cell.row === r && cell.col === c
            );
            const isTappedStart = tappedCell?.row === r && tappedCell?.col === c;
            const foundWordsForCell = foundCellMap.get(`${r}-${c}`);
            const isFound = Boolean(foundWordsForCell && foundWordsForCell.length > 0);
            const isHint = hintCell?.row === r && hintCell?.col === c;

            // Pick color style if cell belongs to found word(s)
            let cellStyle: React.CSSProperties = {};
            let cellClasses =
              'relative flex items-center justify-center rounded-lg sm:rounded-xl font-display transition-all duration-150 ';

            if (isCurrentlySelected) {
              cellClasses +=
                'bg-rose-400 text-white scale-95 shadow-md shadow-rose-300 dark:shadow-none z-10 font-black';
            } else if (isTappedStart) {
              cellClasses +=
                'ring-3 ring-amber-500 ring-offset-2 scale-105 shadow-md bg-amber-400 text-white z-20 font-black animate-pulse';
            } else if (isFound && foundWordsForCell) {
              const primaryWord = foundWordsForCell[0];
              const palette = getWordColor(primaryWord.colorIndex);
              cellStyle = {
                backgroundColor: darkMode ? palette.bgDark : palette.bgLight,
                color: darkMode ? palette.textDark : palette.textLight,
                boxShadow: `inset 0 0 0 1.5px ${
                  darkMode ? palette.borderDark : palette.borderLight
                }`,
              };
              cellClasses += 'font-black scale-[0.98]';
            } else {
              cellClasses +=
                'bg-rose-50/40 dark:bg-slate-800/60 text-slate-700 dark:text-slate-200 hover:bg-rose-100/60 dark:hover:bg-slate-800';
            }

            return (
              <div
                key={`${r}-${c}`}
                style={cellStyle}
                className={`${cellClasses} ${fontClass}`}
                data-row={r}
                data-col={c}
              >
                {/* Letter */}
                <span className="leading-none pointer-events-none select-none">
                  {letter}
                </span>

                {/* Hint pulsing star */}
                {isHint && (
                  <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-500 border border-white text-[8px] text-white items-center justify-center font-bold">
                      ★
                    </span>
                  </span>
                )}

                {/* Overlap indicator dot if cell belongs to multiple found words */}
                {isFound && foundWordsForCell && foundWordsForCell.length > 1 && (
                  <span
                    className="absolute bottom-0.5 right-0.5 w-1.5 h-1.5 rounded-full"
                    style={{
                      backgroundColor: darkMode
                        ? getWordColor(foundWordsForCell[1].colorIndex).borderDark
                        : getWordColor(foundWordsForCell[1].colorIndex).borderLight,
                    }}
                  />
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Mobile Scroll Down to Word Hunt Bar */}
      <div className="w-full mt-3 lg:hidden">
        <button
          type="button"
          onClick={handleScrollToBottom}
          className="w-full py-2.5 px-4 rounded-2xl bg-rose-50/90 hover:bg-rose-100 dark:bg-slate-800/90 dark:hover:bg-slate-750 border border-rose-200/90 dark:border-slate-700 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center justify-center gap-2 active:scale-98 transition-all shadow-xs"
        >
          <span>{t.scrollToWords || 'View Words to Find'}</span>
          <span className="bg-rose-200/80 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300 px-2 py-0.5 rounded-full text-[10px] font-black">
            {remainingCount} left
          </span>
          <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
        </button>
      </div>
    </div>
  );
};
