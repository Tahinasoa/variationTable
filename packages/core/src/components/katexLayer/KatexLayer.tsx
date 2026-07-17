import styles from "../../VariationTable.module.css";
import { useEffect, useRef } from "react";
import renderMathInElement from 'katex/contrib/auto-render';
import 'katex/dist/katex.min.css'; //TODO decide on to keep this or not.
import { ColumnSeparatorLabel, LayoutData } from "../../transformer/types";
import { Labels } from "./Labels";
import { geometricCorrectionSetter } from "../../geometricCorrectionsetter";

export function KatexLayer({
  layoutData,
  layoutDataSetter
}: {
  layoutData:LayoutData,
  layoutDataSetter: React.Dispatch<React.SetStateAction<LayoutData | undefined>>
}) { 

  const katexLayerRef = useRef<HTMLDivElement>(null);
  const labelRefs = useRef<Map<string, {node : HTMLElement, label : ColumnSeparatorLabel}>>(new Map());

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
    layoutDataSetter(geometricCorrectionSetter(layoutData,labelRefs.current)) ;
  }, [layoutData]);

  return (
<div ref={katexLayerRef} className={styles.katexLayer}>
  <Labels
    labels={[
      ...layoutData.rowLabels,
      ...layoutData.columnHeaders,
      ...layoutData.columnSeparatorLabels,
      ...layoutData.lineContents,
      ...layoutData.intermediateAntecedents,
      ...layoutData.intermediateImages,
    ]}
    labelrefs={labelRefs.current}
  />
</div>

  );
}


