import styles from './VariationTable.module.css';
import { memo, useMemo, useState } from 'react';
import { SVGLayer } from './components/svgLayer/SVGLayer';
import { KatexLayer } from './components/katexLayer/KatexLayer';
import { parseToLayoutData } from './transformer/transform';


const VariationTable = memo(__VariationTable);

function __VariationTable({ inputText, theme }: { inputText: string; theme?: 'light' | 'dark' }) {
  const { layoutData, error } = useMemo(() => parseToLayoutData(inputText), [inputText]);
  const [correctedLayoutData , setCorrectedLayoutData] = useState(layoutData) ;

  if (!layoutData || !correctedLayoutData) {
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
          width: `${correctedLayoutData.width}px`,
          height: `${correctedLayoutData.height}px`,
          margin: 0,
          padding: 0,
          border: 'none',
          boxSizing: 'border-box',
        }}
      >
        <SVGLayer layoutData={correctedLayoutData} />
        <KatexLayer layoutData={layoutData} layoutDataSetter={setCorrectedLayoutData} />
      </div>
    </div>
  );
}
export default VariationTable;
