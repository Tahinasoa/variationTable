import styles from "../../VariationTable.module.css";
import { useEffect, useRef } from "react";
import renderMathInElement from 'katex/contrib/auto-render';
import 'katex/dist/katex.min.css'; //TODO decide on to keep this or not.
import { LayoutData } from "../../transformer/types";
import { Labels } from "./Labels";

export function KatexLayer({
  layoutData
}: {
  layoutData:LayoutData
}) {
  const katexLayerRef = useRef<HTMLDivElement>(null);

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
  />
</div>

  );
}
