export function makeErrMsg({ line, column, msg }: { line: number; column: number; msg: string }): string {
  return `<b>Parse error</b> — Line <span>${line}</span>, Column <span>${column}</span>
  <div>${msg}</div>`;
}
