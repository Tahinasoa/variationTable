export interface LayoutConfig {
  labelColumnWidth: number;
  headerRowHeight: number;
  standardColumnWidth: number;
  baseRowHeight: number;
  headerLeftRightMargin: number;
  labelsTopBottomMargin: number;
  labelsLeftRightMargin : number ;
  strokeWidth: number;
}

export const defaultLayoutConfig: LayoutConfig = {
  labelColumnWidth: 120,
  headerRowHeight: 50,
  standardColumnWidth: 120,
  baseRowHeight: 60,
  headerLeftRightMargin: 8,
  labelsTopBottomMargin: 3,
  labelsLeftRightMargin : 3,
  strokeWidth: 1,
};

export function resolveLayoutConfig(
  overrides?: Partial<LayoutConfig>
): LayoutConfig {
  return { ...defaultLayoutConfig, ...overrides };
}