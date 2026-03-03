import VariationTable from './variationTable/VariationTable';
import Editor from './Editor';
import { useEffect, useState } from 'react';
import { examples } from './examples';

function App() {
  const [input, setInput] =
    useState<string>(examples["default"]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      // todo : fix typing ,ensure security
      let btn: HTMLElement | null = (
        (e.target as HTMLElement) || null
      )?.closest('.try-it');
      if (btn) {
        let exampleId = btn.dataset['exampleId'];
        if (exampleId && exampleId in examples) {
          setInput(examples[exampleId]);
        }
      }
    }

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <>
      <div className="editor">
        <Editor input={input} setInput={setInput} />
      </div>
      <div className="preview">
        <VariationTable inputText={input} />
      </div>
    </>
  );
}
export default App;