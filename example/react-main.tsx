import { loadWASM } from 'vscode-oniguruma';
import { MonacoDolphinDBDiffEditor, MonacoDolphinDBEditor } from 'monaco-dolphindb/react';
import * as monaco from 'monaco-editor';
import { loader } from '@monaco-editor/react';
import * as ReactDOM from 'react-dom/client';
import * as React from 'react';

loader.config({
  monaco,
});

async function beforeMonacoEditorInit() {
  return loadWASM(await fetch('/onig.wasm'));
}

function App() {
  const [demo, setDemo] = React.useState<string>('normal');

  return (
    <>
      <select value={demo} onChange={(e) => setDemo(e.target.value)}>
        <option value="normal">Normal</option>
        <option value="diff">Diff</option>
      </select>
      {demo === 'normal' ? (
        <MonacoDolphinDBEditor
          dolphinDBLanguageOptions={{
            docs: '/docs.zh.json',
          }}
          beforeMonacoInit={beforeMonacoEditorInit}
          options={{
            acceptSuggestionOnEnter: 'on',
          }}
          defaultValue="1 + 2"
        />
      ) : (
        <MonacoDolphinDBDiffEditor
          dolphinDBLanguageOptions={{
            docs: '/docs.zh.json',
          }}
          options={{
            readOnly: true,
          }}
          beforeMonacoInit={beforeMonacoEditorInit}
          original="1 + 2"
          modified="1 + 3"
        />
      )}
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
