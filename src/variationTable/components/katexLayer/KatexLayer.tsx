import type { TableData } from "../../models/TableData";
import styles from "../../VariationTable.module.css";
import { RowLabels } from "./RowLabels";
import { Headers } from "./Headers";
import { Variable } from "./Variable";
import { useEffect, useRef } from "react";
import { Signs } from "./Signs";
import { SeparatorLabels } from "./SeparatorLabels";
import renderMathInElement from "katex/dist/contrib/auto-render";
import 'katex/dist/katex.min.css';

export function KatexLayer({
  tableData,
  setMeasurement,
}: {
  tableData: TableData;
  setMeasurement: React.ActionDispatch<
    [
      action: {
        type: string;
      }
    ]
  >;
}) {
  const katexLayerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!katexLayerRef.current) return;

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

    setMeasurement({ type: "measure" });
  }, [tableData]);

  return (
    <div ref={katexLayerRef} className={styles.katexLayer}>
      <Variable tableData={tableData} />
      <RowLabels tableData={tableData} />
      <Headers tableData={tableData} />
      <Signs tableData={tableData} />
      <SeparatorLabels tableData={tableData} />
    </div>
  );
}
