import CodeMirror from '@uiw/react-codemirror';

import { type Dispatch, type SetStateAction } from 'react';

export interface EditorProps {
  input: string;
  setInput: Dispatch<SetStateAction<string>>;
}

function Editor({ input, setInput }: EditorProps) {

  return (
    <textarea
      value={input}
      onChange={(e) => setInput(e.target.value)}
    />
  );
}



export function CodeEditor({input, setInput}: EditorProps) {



  return (
    <div style={{ border: '1px solid #ccc', borderRadius: '4px' }}>
      <CodeMirror
        value={input}
        height="300px"
        onChange={(e)=>{setInput(e);}}
        // basicSetup controls standard features like line numbers and history
        basicSetup={{
          lineNumbers: true,
          foldGutter: true,
          dropCursor: true,
          allowMultipleSelections: true,
          indentOnInput: true,
        }}
      />
    </div>
  );
}



export default Editor;
