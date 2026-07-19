import styles from "../../VariationTable.module.css";
import { CSSProperties, useEffect, useLayoutEffect, useRef } from "react";
import renderMathInElement from 'katex/contrib/auto-render';
import 'katex/dist/katex.min.css'; //TODO decide on to keep this or not.
import { ColumnSeparatorLabel, LayoutData } from "../../transformer/types";
import { Labels } from "./Labels";
import { geometricCorrectionSetter } from "../../geometricCorrectionSetter";

export function KatexLayer({
  layoutData,
  fixLayout,
  setFixedLayoutData
}: {
  layoutData:LayoutData,
  fixLayout : Boolean,
  setFixedLayoutData : React.Dispatch<React.SetStateAction<LayoutData | null>>
}) { 
  const katexLayerRef = useRef<HTMLDivElement>(null);
  const labelRefs = useRef<Map<string, {node : HTMLElement, label : ColumnSeparatorLabel}>>(new Map()) ;

  useLayoutEffect(() => {
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
    if(fixLayout){
      console.log("I'm fixing layout accuracy....")
      setFixedLayoutData(geometricCorrectionSetter(layoutData, labelRefs.current)) ;
    }
  }, [layoutData]);

  return (
<div ref={katexLayerRef} className={styles.katexLayer} style={{'--left-right-margin' : `${layoutData.config.labelsLeftRightMargin}px`} as CSSProperties}>
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


