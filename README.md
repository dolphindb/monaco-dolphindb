# monaco-dolphindb

## Install

```bash
# peerDependencies
pnpm add dolphindb monaco-editor vscode-oniguruma vscode-textmate
pnpm add monaco-dolphindb
# optionalDependencies if you want to use 'monaco-dolphindb/react'
pnpm add @monaco-editor/react
```

## Prepare

monaco-dolphindb need some external resources to work properly, you should copy them from node_modules to your project:

- `onig.wasm` from `vscode-oniguruma/release/onig.wasm`
- `docs.en.json` and `docs.zh.json` from `dolphindb`

Then write some code to load them.

## Usage

### Vanilla

```ts
import { registerDolphinDBLanguage } from 'monaco-dolphindb';
import { loadWASM } from 'vscode-oniguruma';

// load wasm
await loadWASM(await fetch('/onig.wasm'));

await registerDolphinDBLanguage(Monaco, {
  docs: '/docs.zh.json',
});

const editor = Monaco.editor.create(document.getElementById('root')!, {
  value: '1 + 2',
  language: 'dolphindb',
  ...settings,
});
```

### React

**PS:** `monaco-dolphindb/react` include some special logic to make it easy to use for our internal project, so it may not fit your project, you can copy the source code and modify it to fit your project.

```tsx
import { loadWASM } from 'vscode-oniguruma';
import { MonacoDolphinDBEditor } from 'monaco-dolphindb/react';
import * as monaco from 'monaco-editor';
import { loader } from '@monaco-editor/react';
import * as ReactDOM from 'react-dom/client';

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
```
