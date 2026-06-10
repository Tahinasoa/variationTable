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
  
  export interface LineElementEmpty {
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
    | LineElementEmpty
    | LineElementKeyword
    | LineElementContent;
  
  // ---------------------------------------------------------------------------
  // Éléments de \tkzTabVar
  // ---------------------------------------------------------------------------
  
  export type VarModifier = string;
  
  export interface VarElementSkip {
    kind: "skip";
    modifier: "R";
  }
  
  export interface VarElementSingle {
    kind: "single";
    modifier: VarModifier;
    value: LatexExpression | null;
  }
  
  export interface VarElementDouble {
    kind: "double";
    modifier: VarModifier;
    left: LatexExpression | null;
    right: LatexExpression | null;
  }
  
  export type VarElement =
    | VarElementSkip
    | VarElementSingle
    | VarElementDouble;
  
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
  }
  
  export interface TkzTabLine {
    type: "tkzTabLine";
    elements: LineElement[];
  }
  
  export interface TkzTabVar {
    type: "tkzTabVar";
    elements: VarElement[];
  }
  
  export interface TkzTabShortcut {
    type: "tkzTabShortcut";
    rows: TkzTabRow[];
    antecedents: LatexExpression[];
    signs: LineElement[];
    variations: VarElement[];
  }
  
  export interface TkzTabVal {
    type: "tkzTabVal";
    startRank: number;
    endRank: number;
    position: number;
    antecedent: LatexExpression | null;
    image: LatexExpression | null;
  }
  
  export interface TkzTabIma {
    type: "tkzTabIma";
    startRank: number;
    endRank: number;
    atRank: number;
    image: LatexExpression | null;
  }
  
  export interface TkzTabSlope {
    type: "tkzTabSlope";
    slopes: TkzTabSlopeEntry[];
  }
  
  // ---------------------------------------------------------------------------
  // Document
  // ---------------------------------------------------------------------------
  
  export interface TkzTabDocument {
    type: "TkzTabDocument";
    body: TkzTabCommand[];
  }