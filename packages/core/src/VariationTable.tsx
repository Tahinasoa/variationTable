import styles from './VariationTable.module.css';
import { memo, useMemo } from 'react';
import { SVGLayer } from './components/svgLayer/SVGLayer';
import { parseToLayoutData } from './transformer/transform';
import { KatexLayer } from './components/katexLayer/KatexLayer';

const VariationTable = memo(__VariationTable);

function __VariationTable({ inputText, theme }: { inputText: string; theme?: 'light' | 'dark' }) {
  const { layoutData, error } = useMemo(() => parseToLayoutData(inputText), [inputText]);

  if (!layoutData) {
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
        className={styles.canvas + ' ' + styles.debug}
        style={{
          width: `${layoutData.width}px`,
          height: `${layoutData.height}px`,
          margin: 0,
          padding: 0,
          border: 'none',
          boxSizing: 'border-box',
        }}
      >
        <SVGLayer layoutData={layoutData} />
        <KatexLayer layoutData={layoutData} />
      </div>
    </div>
  );
}
export default VariationTable;