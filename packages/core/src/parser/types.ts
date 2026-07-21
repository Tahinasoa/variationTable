// ---------------------------------------------------------------------------
// Contenu brut
// ---------------------------------------------------------------------------

export interface LatexExpression {
  type: "LatexExpression";
  value: string;
}

// ---------------------------------------------------------------------------
// Éléments de \tkzTabLine
// ---------------------------------------------------------------------------

export interface EmptyElement {
  kind: "empty";
}

export interface LineElementKeyword {
  kind: "keyword";
  value: "z" | "d" | "t" | "h" | "+" | "-";
}

export interface LineElementContent {
  kind: "content";
  value: LatexExpression;
}

export type LineElement =
  | EmptyElement
  | LineElementKeyword
  | LineElementContent;

// ---------------------------------------------------------------------------
// Éléments de \tkzTabVar
// ---------------------------------------------------------------------------

export type VarModifier = string; //"+" | "-" | "+C" | "-C" | "+D" | "-D" | "D+" | "D-" | "+DH" | "-DH" | "+CH" | "-CH" | "+H" | "-H" | "R" | "+D-" | "-D+" | "+D+" | "-D-" | "+CD+" | "-CD-" | "+CD-" | "-CD+" | "+DC+" | "-DC-" | "+DC-" | "-DC+" | "+V+" | "-V-" | "+V-" | "-V+";

export interface VarElementSkip {
  kind: "skip";
  modifier: "R";
}

export type VarElement = {
  modifier: VarModifier;
  left: LatexExpression | null;
  right: LatexExpression | null
} | EmptyElement ;

// ---------------------------------------------------------------------------
// Types partagés
// ---------------------------------------------------------------------------

export type TkzTabRow = {
  label: LatexExpression;
  height: number;
};

export type TkzTabSlopeEntry = {
  atRank: number;
  leftValue: LatexExpression | null;
  rightValue: LatexExpression | null;
};

// ---------------------------------------------------------------------------
// Commandes
// ---------------------------------------------------------------------------

export type TkzTabCommand =
  | TkzTabInit
  | TkzTabLine
  | TkzTabVar
  | TkzTabShortcut
  | TkzTabVal
  | TkzTabIma
  | TkzTabSlope;

export interface TkzTabInit {
  type: "tkzTabInit";
  rows: TkzTabRow[];
  antecedents: LatexExpression[];
  line: number;
  column: number;
}

export interface TkzTabLine {
  type: "tkzTabLine";
  elements: LineElement[];
  line: number;
  column: number;
}

export interface TkzTabVar {
  type: "tkzTabVar";
  elements: VarElement[];
  line: number;
  column: number;
}

export interface TkzTabShortcut {
  type: "tkzTabShortcut";
  rows: TkzTabRow[];
  antecedents: LatexExpression[];
  signs: LineElement[];
  variations: VarElement[];
  line: number;
  column: number;
}

export interface TkzTabVal {
  type: "tkzTabVal";
  startRank: number;
  endRank: number;
  position: number;
  antecedent: LatexExpression | null;
  image: LatexExpression | null;
  line: number;
  column: number;
}

export interface TkzTabIma {
  type: "tkzTabIma";
  startRank: number;
  endRank: number;
  atRank: number;
  image: LatexExpression | null;
  line: number;
  column: number;
}

export interface TkzTabSlope {
  type: "tkzTabSlope";
  slopes: TkzTabSlopeEntry[];
  line: number;
  column: number;
}

// ---------------------------------------------------------------------------
// Document
// ---------------------------------------------------------------------------

export interface TkzTabDocument {
  type: "TkzTabDocument";
  body: TkzTabCommand[];
}