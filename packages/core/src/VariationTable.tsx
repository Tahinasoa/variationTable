import styles from './VariationTable.module.css';
import { SVGLayer } from './components/svgLayer/SVGLayer';
import { KatexLayer } from './components/katexLayer/KatexLayer';

import {
  TableData,
  type HorizontalPosition,
  type VerticalPosition,
} from './models/TableData';
import { memo, useMemo, useReducer } from 'react';
import {
  parseToTableData
} from './transform.ts';
import { SeparatorLabelRef } from './components/katexLayer/SeparatorLabels.tsx';

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
export type MeasuredData = {
  labelGeometry?: LabelGeometry[];
}

export type MeasurementAction = MeasurementAction_labels;
export interface MeasurementAction_labels {
  type: 'Labels';
  payload: Map<string, SeparatorLabelRef>;
}


const VariationTable = memo(__VariationTable);

function __VariationTable({ inputText, theme }: { inputText: string; theme?: 'light' | 'dark' }) {
  const { data, error } =
    useMemo(() => {
      return parseToTableData(inputText);
    }, [inputText]);

  const tableData = useMemo(() => {
    if (!data) return null;
    else return new TableData(data);
  }, [data]);

  const [measuredData, setDataMeasurement] = useReducer(measurementReducer, {});


  if (!tableData) {
    return <div>{error}</div>;
  }

  return (
    <div
      style={{
        display: 'flow-root',
        isolation: 'isolate', // Prevents parent z-index/blending interference
        contain: 'layout style paint', // Stops layout shifts, style inheritance, and painting leaks
      }}
      className={theme === 'dark' ? styles.dark : styles.light}
    >
      <div
        className={styles.canvas}
        style={{
          width: `${tableData.width}px`,
          height: `${tableData.height}px`,
          margin: 0,
          padding: 0,
          border: 'none',
          boxSizing: 'border-box',
        }}
      >
        <SVGLayer tableData={tableData} measuredData={measuredData} />
        <KatexLayer tableData={tableData} setDataMeasurement={setDataMeasurement} />
      </div>
    </div>
  );
}
export default VariationTable;


function measurementReducer(
  currentMesurement: MeasuredData,
  action: MeasurementAction): MeasuredData {
  switch (action.type) {
    case 'Labels':
      return { labelGeometry: getLabelsMeasurements(action.payload) };
  }
  return currentMesurement;
}


function getLabelsMeasurements(labelRef: Map<string, SeparatorLabelRef>): LabelGeometry[] {
  const labelGeometry: LabelGeometry[] = [];

  labelRef.forEach((value) => {
    if (value.type == 'separatorLabel') {
      const rect = value.node.getBoundingClientRect();
      labelGeometry.push({
        // Data attributes
        row: value.row,
        column: value.column,
        vpos: value.vpos,
        hpos: value.hpos,

        // Measurements
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height,
        top: rect.top,
        left: rect.left,
        right: rect.right,
        bottom: rect.bottom,
      });
    }
  }
  );
  return labelGeometry;
}
