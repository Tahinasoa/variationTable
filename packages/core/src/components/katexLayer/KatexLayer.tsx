import type { TableData } from "../../models/TableData";
import styles from "../../VariationTable.module.css";
import { RowLabels } from "./RowLabels";
import { Headers } from "./Headers";
import { Variable } from "./Variable";
import { useEffect, useRef } from "react";
import { Signs } from "./Signs";
import { SeparatorLabelRef, SeparatorLabels } from "./SeparatorLabels";
import renderMathInElement from 'katex/contrib/auto-render';
import 'katex/dist/katex.min.css'; //TODO decide on to keep this or not.
import { MeasuredData, MeasurementAction } from "../../VariationTable";
import { IntermediateAntecedents } from "./IntermediateAntecedents";
import { IntermediateImages } from "./IntermediateImages";

export function KatexLayer({
  tableData,
  measuredData,
  setDataMeasurement,
}: {
  tableData: TableData;
  measuredData: MeasuredData;
  setDataMeasurement: React.Dispatch<MeasurementAction>;
}) {
  const katexLayerRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<Map<string, SeparatorLabelRef>>(new Map());

  useEffect(() => {
    if (katexLayerRef.current) {
      try {
        renderMathInElement(katexLayerRef.current, {
          delimiters: [
            { left: "$$", right: "$$", display: true },
            { left: "$", right: "$", display: false },
          ],
          throwOnError: false,
        });
      } catch (e) {
        console.log("Katex auto renderer not loaded");
      }
    }

    setDataMeasurement({ type: "Labels", payload: labelRef.current });

  }, [tableData]);

  return (
    <div ref={katexLayerRef} className={styles.katexLayer}>
      <Variable tableData={tableData} />
      <RowLabels tableData={tableData} />
      <Headers tableData={tableData} />
      <IntermediateAntecedents tableData={tableData} />
      <IntermediateImages tableData={tableData} measuredData={measuredData} />
      <Signs tableData={tableData} />
      <SeparatorLabels tableData={tableData} labelrefs={labelRef.current} />
    </div>
  );
}
