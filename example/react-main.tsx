import { loadWASM } from 'vscode-oniguruma';
import { MonacoDolphinDBDiffEditor, MonacoDolphinDBEditor } from 'monaco-dolphindb/react';
import * as monaco from 'monaco-editor';
import { loader } from '@monaco-editor/react';
import * as ReactDOM from 'react-dom/client';
import * as React from 'react';
import { DocsAnalyser } from 'monaco-dolphindb';

import style from './react-main.module.css';
import { Docs } from 'dolphindb/docs';

loader.config({
  monaco,
});

async function beforeMonacoEditorInit() {
  return loadWASM(await fetch('/onig.wasm'));
}

const docsAnalyser = new DocsAnalyser(await (await fetch('/docs.zh.json')).json());

function App() {
  const [demo, setDemo] = React.useState<string>('normal');
  const [docsLanguage, setDocsLanguage] = React.useState<'zh' | 'en'>('zh');
  const [theme, setTheme] = React.useState<'light' | 'dark'>('light');

  const onLanguageChanged = React.useCallback(async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value as 'zh' | 'en';
    setDocsLanguage(newLang);

    docsAnalyser.docs = await (await fetch(newLang === 'zh' ? '/docs.zh.json' : '/docs.en.json')).json();
    docsAnalyser.funcs = Object.keys(docsAnalyser.docs as Docs);
    docsAnalyser.lower_funcs = docsAnalyser.funcs.map((func) => func.toLowerCase());
  }, []);

  return (
    <>
      <div className={style.header}>
        <label>
          编辑器类型:
          <select className={style.select} value={demo} onChange={(e) => setDemo(e.target.value)}>
            <option value="normal">Normal</option>
            <option value="diff">Diff</option>
          </select>
        </label>
        <label>
          语言:
          <select className={style.select} value={docsLanguage} onChange={onLanguageChanged}>
            <option value="zh">Zh</option>
            <option value="en">En</option>
          </select>
        </label>
        <label>
          主题:
          <select className={style.select} value={theme} onChange={(e) => setTheme(e.target.value as 'light' | 'dark')}>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </label>
      </div>
      <div className={style['editor-wrapper']}>
        {demo === 'normal' ? (
          <MonacoDolphinDBEditor
            dolphinDBLanguageOptions={{
              docsAnalyser,
              theme,
            }}
            beforeMonacoInit={beforeMonacoEditorInit}
            options={{
              acceptSuggestionOnEnter: 'on',
            }}
            theme={theme === 'light' ? 'light' : 'vs-dark'}
            defaultValue="1 + 2"
          />
        ) : (
          <MonacoDolphinDBDiffEditor
            dolphinDBLanguageOptions={{
              docsAnalyser,
              theme,
            }}
            options={{
              domReadOnly: true,
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
