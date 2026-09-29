export interface ShapeDef {
  id: string;
  name: string;
  color: string;
  matrix: number[][];
  weight: number; // Higher = more frequent
}

export const COLOR_CONFIG: Record<string, { hex: string; border: string; glow: string; name: string }> = {
  'color-1': { hex: '#ff0055', border: '#ff3377', glow: 'rgba(255, 0, 85, 0.65)', name: 'Neon Pink' },
  'color-2': { hex: '#00f0ff', border: '#33f3ff', glow: 'rgba(0, 240, 255, 0.65)', name: 'Laser Cyan' },
  'color-3': { hex: '#ffe600', border: '#ffeb33', glow: 'rgba(255, 230, 0, 0.65)', name: 'Cyber Gold' },
  'color-4': { hex: '#b000ff', border: '#c033ff', glow: 'rgba(176, 0, 255, 0.65)', name: 'Ultra Violet' },
  'color-5': { hex: '#00ff66', border: '#33ff85', glow: 'rgba(0, 255, 102, 0.65)', name: 'Matrix Green' },
  'color-6': { hex: '#ff6a00', border: '#ff8833', glow: 'rgba(255, 106, 0, 0.65)', name: 'Plasma Orange' },
};

export const SHAPE_LIBRARY: ShapeDef[] = [
  // 1x1 Dot
  { id: 'dot', name: 'Micro Node', color: 'color-1', matrix: [[1]], weight: 14 },

  // 1x2 and 2x1
  { id: 'line_2h', name: 'Dual Bus H', color: 'color-1', matrix: [[1, 1]], weight: 12 },
  { id: 'line_2v', name: 'Dual Bus V', color: 'color-1', matrix: [[1], [1]], weight: 12 },

  // 1x3 and 3x1
  { id: 'line_3h', name: 'Tri-Beam H', color: 'color-2', matrix: [[1, 1, 1]], weight: 11 },
  { id: 'line_3v', name: 'Tri-Beam V', color: 'color-2', matrix: [[1], [1], [1]], weight: 11 },

  // 1x4 and 4x1
  { id: 'line_4h', name: 'Quad Laser H', color: 'color-2', matrix: [[1, 1, 1, 1]], weight: 8 },
  { id: 'line_4v', name: 'Quad Laser V', color: 'color-2', matrix: [[1], [1], [1], [1]], weight: 8 },

  // 1x5 and 5x1
  { id: 'line_5h', name: 'Overcharge Rail H', color: 'color-6', matrix: [[1, 1, 1, 1, 1]], weight: 5 },
  { id: 'line_5v', name: 'Overcharge Rail V', color: 'color-6', matrix: [[1], [1], [1], [1], [1]], weight: 5 },

  // Squares
  { id: 'sq_2x2', name: 'Subcore 2x2', color: 'color-3', matrix: [[1, 1], [1, 1]], weight: 11 },
  { id: 'sq_3x3', name: 'Mainframe 3x3', color: 'color-3', matrix: [[1, 1, 1], [1, 1, 1], [1, 1, 1]], weight: 3 },

  // Small Corners (2x2 with 3 blocks)
  { id: 'corner_sm_1', name: 'Angle Pin TL', color: 'color-4', matrix: [[1, 1], [1, 0]], weight: 9 },
  { id: 'corner_sm_2', name: 'Angle Pin TR', color: 'color-4', matrix: [[1, 1], [0, 1]], weight: 9 },
  { id: 'corner_sm_3', name: 'Angle Pin BL', color: 'color-4', matrix: [[1, 0], [1, 1]], weight: 9 },
  { id: 'corner_sm_4', name: 'Angle Pin BR', color: 'color-4', matrix: [[0, 1], [1, 1]], weight: 9 },

  // Large Corners (3x3 with 5 blocks)
  { id: 'corner_lg_1', name: 'Apex Bracket TL', color: 'color-5', matrix: [[1, 1, 1], [1, 0, 0], [1, 0, 0]], weight: 5 },
  { id: 'corner_lg_2', name: 'Apex Bracket TR', color: 'color-5', matrix: [[1, 1, 1], [0, 0, 1], [0, 0, 1]], weight: 5 },
  { id: 'corner_lg_3', name: 'Apex Bracket BL', color: 'color-5', matrix: [[1, 0, 0], [1, 0, 0], [1, 1, 1]], weight: 5 },
  { id: 'corner_lg_4', name: 'Apex Bracket BR', color: 'color-5', matrix: [[0, 0, 1], [0, 0, 1], [1, 1, 1]], weight: 5 },

  // Tetrominos T
  { id: 't_down', name: 'T-Coupler D', color: 'color-5', matrix: [[1, 1, 1], [0, 1, 0]], weight: 8 },
  { id: 't_up', name: 'T-Coupler U', color: 'color-5', matrix: [[0, 1, 0], [1, 1, 1]], weight: 8 },
  { id: 't_right', name: 'T-Coupler R', color: 'color-5', matrix: [[1, 0], [1, 1], [1, 0]], weight: 7 },
  { id: 't_left', name: 'T-Coupler L', color: 'color-5', matrix: [[0, 1], [1, 1], [0, 1]], weight: 7 },

  // Tetrominos L & J
  { id: 'l_v1', name: 'L-Relay', color: 'color-4', matrix: [[1, 0], [1, 0], [1, 1]], weight: 8 },
  { id: 'j_v1', name: 'J-Relay', color: 'color-4', matrix: [[0, 1], [0, 1], [1, 1]], weight: 8 },
  { id: 'l_h1', name: 'L-Relay Flat', color: 'color-4', matrix: [[1, 1, 1], [1, 0, 0]], weight: 7 },
  { id: 'j_h1', name: 'J-Relay Flat', color: 'color-4', matrix: [[1, 1, 1], [0, 0, 1]], weight: 7 },

  // Tetrominos S & Z
  { id: 's_h', name: 'S-Circuit', color: 'color-6', matrix: [[0, 1, 1], [1, 1, 0]], weight: 6 },
  { id: 'z_h', name: 'Z-Circuit', color: 'color-6', matrix: [[1, 1, 0], [0, 1, 1]], weight: 6 },

  // Cross / Plus
  { id: 'plus', name: 'Quantum Core', color: 'color-2', matrix: [[0, 1, 0], [1, 1, 1], [0, 1, 0]], weight: 4 },
];

export function getRandomShape(): ShapeDef {
  const totalWeight = SHAPE_LIBRARY.reduce((sum, s) => sum + s.weight, 0);
  let randomVal = Math.random() * totalWeight;

  for (const shape of SHAPE_LIBRARY) {
    if (randomVal < shape.weight) {
      return shape;
    }
    randomVal -= shape.weight;
  }
  return SHAPE_LIBRARY[0];
}

export function generateDockBatch(count: number = 3): ShapeDef[] {
  const result: ShapeDef[] = [];
  let largePieceCount = 0;

  for (let i = 0; i < count; i++) {
    let shape = getRandomShape();
    // Prevent 3 bulky 3x3 or huge shapes appearing all at once
    const isBig = shape.matrix.length >= 3 && shape.matrix[0].length >= 3;
    if (isBig && largePieceCount >= 1) {
      // Pick a smaller piece
      shape = SHAPE_LIBRARY.find(s => s.id === 'line_2h' || s.id === 'dot' || s.id === 'sq_2x2') || shape;
    }
    if (isBig) largePieceCount++;
    result.push(shape);
  }
  return result;
}
