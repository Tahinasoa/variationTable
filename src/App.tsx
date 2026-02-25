import VariationTable from './variationTable/VariationTable';
import Editor from './Editor';
import { useEffect, useState } from 'react';

function App() {
  const [input, setInput] =
    useState<string>(`header "$x$": "$-\\infty$","$0$", "$+\\infty$"
    row "signe de $f$":  "$+$" |& "$+$"`);

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

let examples: Record<string, string> = {
  '2.1': `header "$x$": "-infty","$0$","+infty"
  row "signe de $f'$": "+" "-"
  row "variation de $f$": INC DEC`,
  '3.1': `header "$x$": "-infty","$0$","+infty"
  row "signe de f'": "$+$" "$-$"
  row "variation de f(x)": INC &{top-center:"5", bottom-center:"4"}DEC  `,
};
