import { loadWASM } from 'vscode-oniguruma';
import { MonacoDolphinDBEditor } from 'monaco-dolphindb/react';
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
  const [value, setValue] = React.useState('1 + 2');

  const onChange = React.useCallback((value?: string) => {
    setValue(value ?? '');
  }, []);

  return (
    <MonacoDolphinDBEditor
      dolphinDBLanguageOptions={{
        docs: '/docs.zh.json',
      }}
      beforeInit={beforeMonacoEditorInit}
      options={{
        acceptSuggestionOnEnter: 'on',
      }}
      value={value}
      onChange={onChange}
    />
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
