import type { Dispatch, SetStateAction } from 'react';

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

export default Editor;
