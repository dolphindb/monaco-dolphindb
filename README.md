# donaco

[![npm package][npm-img]][npm-url] [![downloads][downloads-img]][downloads-url] [![issues][issues-img]][issues-url]

## Install

```bash
# peerDependencies
pnpm add dolphindb monaco-editor vscode-oniguruma vscode-textmate

pnpm add donaco

# optionalDependencies if you want to use 'donaco/react'
pnpm add @monaco-editor/react
```

## Prepare

donaco need some external resources to work properly, you should copy follow things from node_modules to your project:

- `onig.wasm` from `vscode-oniguruma/release/onig.wasm`
- `docs.en.json` and `docs.zh.json` from `dolphindb`

## Usage

### Vanilla

```ts
import { registerDolphinDBLanguage } from 'donaco';
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

**PS:** `donaco/react` include some special logic to make it easy to use for our internal project, so it may not fit your project, you can copy the source code and modify it to fit your project.

#### `MonacoDolphinDBEditor`

```tsx
import { loadWASM } from 'vscode-oniguruma';
import { MonacoDolphinDBEditor } from 'donaco/react';
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
        language: 'zh',
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

#### `MonacoDolphinDBDiffEditor`

```tsx
import { loadWASM } from 'vscode-oniguruma';
import { MonacoDolphinDBDiffEditor } from 'donaco/react';
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
  return (
    <MonacoDolphinDBDiffEditor
      dolphinDBLanguageOptions={{
        docs: '/docs.zh.json',
        language: 'zh',
      }}
      beforeInit={beforeMonacoEditorInit}
      original="1 + 2"
      modified="1 + 3"
    />
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
```

[npm-img]: https://img.shields.io/npm/v/donaco
[npm-url]: https://www.npmjs.com/package/donaco
[downloads-img]: https://img.shields.io/npm/dt/donaco
[downloads-url]: https://www.npmtrends.com/donaco
[issues-img]: https://img.shields.io/github/issues/dolphindb/donaco
[issues-url]: https://github.com/dolphindb/donaco/issues
