import { loadWASM } from 'vscode-oniguruma';
import { MonacoDolphinDBDiffEditor, MonacoDolphinDBEditor } from 'monaco-dolphindb/react';
import * as monaco from 'monaco-editor';
import { loader } from '@monaco-editor/react';
import * as ReactDOM from 'react-dom/client';
import * as React from 'react';
import { RegisterDolphinDBLanguageOptions } from 'monaco-dolphindb';

import './react-main.css';

loader.config({
  monaco,
});

async function beforeMonacoEditorInit() {
  return loadWASM(await fetch('/onig.wasm'));
}

function App() {
  const [demo, setDemo] = React.useState<string>('normal');
  const [docsLanguage, setDocsLanguage] = React.useState<'zh' | 'en'>('zh');
  const [theme, setTheme] = React.useState<'light' | 'dark'>('light');

  const dolphinDBLanguageOptions = React.useMemo<RegisterDolphinDBLanguageOptions>(() => {
    return {
      docs: `/docs.${docsLanguage}.json`,
      language: docsLanguage,
      theme,
    };
  }, [docsLanguage, theme]);

  return (
    <>
      <div className="header">
        <label>
          Editor Type:
          <select className="select" value={demo} onChange={(e) => setDemo(e.target.value)}>
            <option value="normal">Normal</option>
            <option value="diff">Diff</option>
          </select>
        </label>
        <label>
          DolphinDB Language:
          <select
            className="select"
            value={docsLanguage}
            onChange={(e) => setDocsLanguage(e.target.value as 'zh' | 'en')}
          >
            <option value="zh">Zh</option>
            <option value="en">En</option>
          </select>
        </label>
        <label>
          Theme:
          <select className="select" value={theme} onChange={(e) => setTheme(e.target.value as 'light' | 'dark')}>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </label>
      </div>
      <div className="editor-wrapper">
        {demo === 'normal' ? (
          <MonacoDolphinDBEditor
            dolphinDBLanguageOptions={dolphinDBLanguageOptions}
            beforeMonacoInit={beforeMonacoEditorInit}
            options={{
              acceptSuggestionOnEnter: 'on',
            }}
            theme={theme === 'light' ? 'light' : 'vs-dark'}
            defaultValue="1 + 2"
          />
        ) : (
          <MonacoDolphinDBDiffEditor
            dolphinDBLanguageOptions={dolphinDBLanguageOptions}
            options={{
              readOnly: true,
            }}
            beforeMonacoInit={beforeMonacoEditorInit}
            theme={theme === 'light' ? 'light' : 'vs-dark'}
            original="1 + 2"
            modified="1 + 3"
          />
        )}
      </div>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
