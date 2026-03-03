import styles from './VariationTable.module.css';
import { SVGLayer } from './components/svgLayer/SVGLayer';
import { KatexLayer } from './components/katexLayer/KatexLayer';

import {
  TableData,
  type HorizontalPosition,
  type VerticalPosition,
} from './models/TableData';
import { useMemo, useReducer } from 'react';
import {
  type transformationResult,
  parseToAst,
  astToTableData,
} from './transform';

export interface LabelGeometry {
  // Data attributes
  row: number;
  column: number;
  vpos: VerticalPosition;
  hpos: HorizontalPosition;

  // Measurements
  x: number;
  y: number;
  width: number;
  height: number;
  left: number;
  top: number;
  right: number;
  bottom: number;
}
export interface MeasuredData {
  labelGeometry?: LabelGeometry[];
}

function VariationTable({ inputText }: { inputText: string }) {
  const { data, error }: transformationResult =
    useMemo((): transformationResult => {
      let parseResult = parseToAst(inputText);
      let tableDataArg = astToTableData(parseResult);
      return tableDataArg;
    }, [inputText]);

  const tableData = useMemo(() => {
    if (!data) return null;
    else return new TableData(data);
  }, [data]);

  const [measuredData, setMeasurement] = useReducer(updateMeasurement, {});

  if (!tableData) {
    return <div>{error}</div>;
  }

  return (
    <div
      className={styles.canvas}
      style={{
        width: `${tableData.width}px`,
        height: `${tableData.height}px`,
      }}
    >
      <SVGLayer tableData={tableData} measuredData={measuredData} />
      <KatexLayer tableData={tableData} setMeasurement={setMeasurement} />
    </div>
  );
}
export default VariationTable;

function updateMeasurement(
  currentMesurement: MeasuredData,
  action: { type: string }
): MeasuredData {
  switch (action.type) {
    case 'measure':
      const columnSeparatorLabel = 'columnSeparatorLabel';
      const labels = document.querySelectorAll<HTMLSpanElement>(
        '.' + columnSeparatorLabel
      );

      const extractedLabelData = Array.from(labels).map((label) => {
        const rect = label.getBoundingClientRect();
        return {
          // Data attributes
          row: Number(label.dataset.row),
          column: Number(label.dataset.column),
          vpos: label.dataset.vpos as VerticalPosition,
          hpos: label.dataset.hpos as HorizontalPosition,

          // Measurements
          x: rect.x,
          y: rect.y,
          width: rect.width,
          height: rect.height,
          left: rect.left,
          top: rect.top,
          right: rect.right,
          bottom: rect.bottom,
        };
      });
      return { labelGeometry: extractedLabelData };
  }
  return currentMesurement;
}
