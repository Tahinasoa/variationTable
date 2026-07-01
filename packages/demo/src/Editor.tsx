import CodeMirror from '@uiw/react-codemirror';
import { latexLanguage } from 'codemirror-lang-latex';

import { type Dispatch, type SetStateAction } from 'react';

export interface EditorProps {
  input: string;
  setInput: Dispatch<SetStateAction<string>>;
}

function Editor({ input, setInput }: EditorProps) {



  return (
    <CodeMirror
      value={input}
      height="300px"
      onChange={(e) => { setInput(e); }}
      // basicSetup controls standard features like line numbers and history
      basicSetup={{
        lineNumbers: true,
        foldGutter: true,
        dropCursor: true,
        allowMultipleSelections: true,
        indentOnInput: true,
        lintKeymap: false,
      }}
      extensions={[latexLanguage]}
      style={{ border: '1px solid #ccc', borderRadius: '4px' }}
    />
  );
}



export default Editor;
