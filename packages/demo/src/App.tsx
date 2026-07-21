import {VariationTable} from '@variation/core'
import Editor from './Editor';
import { useEffect, useState } from 'react';
import { examples } from './examples';
import { ThemeToggle } from './ThemeToggle';
import 'katex/dist/katex.min.css'; 

function App() {
  const [input, setInput] =
    useState<string>(examples["default"]);
  const [isDark, setIsDark] = useState<boolean>(false);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
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
        <ThemeToggle isDark={isDark} setIsDark={setIsDark} />
        <VariationTable inputText={input} theme={isDark ? 'dark' : 'light'} />
      </div>
    </>
  );
}
export default App;