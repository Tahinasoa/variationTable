import styles from './VariationTable.module.css';
import { memo, useMemo, useState } from 'react';
import { SVGLayer } from './components/svgLayer/SVGLayer';
import { KatexLayer } from './components/katexLayer/KatexLayer';
import { parseToLayoutData } from './transformer/transform';
import { LayoutData } from './transformer/types';


const VariationTable = memo(__VariationTable);

function __VariationTable({ inputText, theme }: { inputText: string; theme?: 'light' | 'dark' }) {
  
  const [fixedLayoutData,setFixedLayoutData] = useState<LayoutData|null>(null) ;
  const {layoutData, error} = useMemo(()=>{
    return parseToLayoutData(inputText) ;
  }, [inputText]) ;
  const styleTheme = (theme === 'dark' ? styles.dark : styles.light );

  if (!layoutData) {
    if(error){
      return <div className={styles.errorMsg+' '+ styleTheme} dangerouslySetInnerHTML={{__html : error}}></div>
    }
    return <h1>Something went wrong</h1>;
  }


  let data:LayoutData ;
  let mustFixLayout:Boolean ;
  if(!fixedLayoutData || (fixedLayoutData.id !== layoutData.id)){
    data = layoutData ; // always use the most recent Data
    mustFixLayout = true ; //Prepare geometric correction
  }
  else {
    data = fixedLayoutData ;
    mustFixLayout = false ; //we don't have to fix layout anymore
  }

  return (
    <div
      style={{
        display: 'flow-root',
        isolation: 'isolate', // Prevents parent z-index/blending interference
        contain: 'layout style paint', // Stops layout shifts, style inheritance, and painting leaks
        overflow : 'scroll'
      }}
      className={styleTheme}
    >
      <div
        className={styles.canvas + ' '}
        style={{
          width: `${layoutData.width}px`,
          height: `${layoutData.height}px`,
          margin: 0,
          padding: 0,
          border: 'none',
          boxSizing: 'border-box',
        }}
      >
        <SVGLayer layoutData={data} />
        <KatexLayer layoutData={data} fixLayout={mustFixLayout} setFixedLayoutData={setFixedLayoutData}/>
      </div>
    </div>
  );
}
export default VariationTable;
