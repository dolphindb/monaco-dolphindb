import { loadWASM } from 'vscode-oniguruma';
import { MonacoDolphinDBEditor } from 'monaco-dolphindb/react';
import * as monaco from 'monaco-editor';
import { loader } from '@monaco-editor/react';
import * as ReactDOM from 'react-dom/client';

loader.config({
  monaco,
});

function App() {
  return (
    <MonacoDolphinDBEditor
      dolphinDBLanguageOptions={{
        docs: '/docs.zh.json',
      }}
      beforeInit={async () => loadWASM(await fetch('/onig.wasm'))}
      options={{
        acceptSuggestionOnEnter: 'on',
      }}
      value="1 + 2"
    />
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
