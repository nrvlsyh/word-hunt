/**
 * Pastel Palette for found words in Word Hunt
 * Delightful, high-contrast, cute pastel colors for highlighting words.
 */

export interface WordColor {
  id: string;
  name: string;
  // Background highlight on grid cells
  bgLight: string;
  bgDark: string;
  // Stroke / Border for selected word pill
  borderLight: string;
  borderDark: string;
  // Text color on pill
  textLight: string;
  textDark: string;
  // Subtle glow
  glowLight: string;
  glowDark: string;
}

export const PASTEL_PALETTE: WordColor[] = [
  {
    id: 'pink',
    name: 'Strawberry Milk',
    bgLight: '#FFE4E8',
    bgDark: '#831843',
    borderLight: '#F472B6',
    borderDark: '#F472B6',
    textLight: '#9D174D',
    textDark: '#FCE7F3',
    glowLight: 'rgba(244, 114, 182, 0.35)',
    glowDark: 'rgba(244, 114, 182, 0.45)',
  },
  {
    id: 'lavender',
    name: 'Lavender Mist',
    bgLight: '#EDE9FE',
    bgDark: '#4C1D95',
    borderLight: '#A78BFA',
    borderDark: '#C4B5FD',
    textLight: '#5B21B6',
    textDark: '#EDE9FE',
    glowLight: 'rgba(167, 139, 250, 0.35)',
    glowDark: 'rgba(167, 139, 250, 0.45)',
  },
  {
    id: 'sky',
    name: 'Baby Blue',
    bgLight: '#E0F2FE',
    bgDark: '#0C4A6E',
    borderLight: '#38BDF8',
    borderDark: '#7DD3FC',
    textLight: '#0369A1',
    textDark: '#E0F2FE',
    glowLight: 'rgba(56, 189, 248, 0.35)',
    glowDark: 'rgba(56, 189, 248, 0.45)',
  },
  {
    id: 'mint',
    name: 'Mint Breeze',
    bgLight: '#D1FAE5',
    bgDark: '#064E3B',
    borderLight: '#34D399',
    borderDark: '#6EE7B7',
    textLight: '#065F46',
    textDark: '#D1FAE5',
    glowLight: 'rgba(52, 211, 153, 0.35)',
    glowDark: 'rgba(52, 211, 153, 0.45)',
  },
  {
    id: 'butter',
    name: 'Butter Yellow',
    bgLight: '#FEF3C7',
    bgDark: '#78350F',
    borderLight: '#FBBF24',
    borderDark: '#FDE68A',
    textLight: '#92400E',
    textDark: '#FEF3C7',
    glowLight: 'rgba(251, 191, 36, 0.35)',
    glowDark: 'rgba(251, 191, 36, 0.45)',
  },
  {
    id: 'peach',
    name: 'Peach Bellini',
    bgLight: '#FFEDD5',
    bgDark: '#7C2D12',
    borderLight: '#FB923C',
    borderDark: '#FDBA74',
    textLight: '#9A3412',
    textDark: '#FFEDD5',
    glowLight: 'rgba(251, 146, 60, 0.35)',
    glowDark: 'rgba(251, 146, 60, 0.45)',
  },
  {
    id: 'teal',
    name: 'Aqua Seafoam',
    bgLight: '#CCFBF1',
    bgDark: '#134E4A',
    borderLight: '#2DD4BF',
    borderDark: '#5EEAD4',
    textLight: '#115E59',
    textDark: '#CCFBF1',
    glowLight: 'rgba(45, 212, 191, 0.35)',
    glowDark: 'rgba(45, 212, 191, 0.45)',
  },
  {
    id: 'rose',
    name: 'Rose Macaron',
    bgLight: '#FFE4E6',
    bgDark: '#881337',
    borderLight: '#FDA4AF',
    borderDark: '#FECDD3',
    textLight: '#881337',
    textDark: '#FFE4E6',
    glowLight: 'rgba(253, 164, 175, 0.35)',
    glowDark: 'rgba(253, 164, 175, 0.45)',
  },
  {
    id: 'lime',
    name: 'Matcha Cream',
    bgLight: '#ECFCCB',
    bgDark: '#365314',
    borderLight: '#A3E635',
    borderDark: '#BEF264',
    textLight: '#3F6212',
    textDark: '#ECFCCB',
    glowLight: 'rgba(163, 230, 53, 0.35)',
    glowDark: 'rgba(163, 230, 53, 0.45)',
  },
  {
    id: 'lilac',
    name: 'Sugar Lilac',
    bgLight: '#F3E8FF',
    bgDark: '#581C87',
    borderLight: '#C084FC',
    borderDark: '#D8B4FE',
    textLight: '#6B21A8',
    textDark: '#F3E8FF',
    glowLight: 'rgba(192, 132, 252, 0.35)',
    glowDark: 'rgba(192, 132, 252, 0.45)',
  },
  {
    id: 'coral',
    name: 'Coral Punch',
    bgLight: '#FCE7F3',
    bgDark: '#701A75',
    borderLight: '#E879F9',
    borderDark: '#F0ABFC',
    textLight: '#86198F',
    textDark: '#FCE7F3',
    glowLight: 'rgba(232, 121, 249, 0.35)',
    glowDark: 'rgba(232, 121, 249, 0.45)',
  },
  {
    id: 'vanilla',
    name: 'Vanilla Custard',
    bgLight: '#FFFBEB',
    bgDark: '#713F12',
    borderLight: '#FBBF24',
    borderDark: '#FCD34D',
    textLight: '#78350F',
    textDark: '#FFFBEB',
    glowLight: 'rgba(251, 191, 36, 0.35)',
    glowDark: 'rgba(251, 191, 36, 0.45)',
  },
];

export function getWordColor(index: number): WordColor {
  return PASTEL_PALETTE[index % PASTEL_PALETTE.length];
}
