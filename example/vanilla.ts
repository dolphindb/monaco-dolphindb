import * as Monaco from 'monaco-editor';
import { loadWASM } from 'vscode-oniguruma';
import { registerDolphinDBLanguage, DocsAnalyser } from 'monaco-dolphindb';

const settings: Monaco.editor.IStandaloneEditorConstructionOptions = {
  insertSpaces: true,
  folding: true,
  largeFileOptimizations: true,
  matchBrackets: 'always',
  smoothScrolling: false,
  suggest: {
    insertMode: 'replace',
    snippetsPreventQuickSuggestions: false,
  },
  wordBasedSuggestions: 'allDocuments',

  mouseWheelZoom: true,
  guides: {
    indentation: false,
    bracketPairs: false,
    highlightActiveIndentation: false,
  },

  detectIndentation: true,
  tabSize: 4,

  codeLens: true,
  roundedSelection: false,
  wordWrap: 'on',

  scrollBeyondLastLine: false,
  scrollbar: {
    vertical: 'visible',
  },

  find: {
    loop: true,
    seedSearchStringFromSelection: 'selection',
  },

  acceptSuggestionOnCommitCharacter: false,

  mouseWheelScrollSensitivity: 2,
  dragAndDrop: false,
  renderControlCharacters: true,
  lineNumbers: 'on',
  showFoldingControls: 'mouseover',
  foldingStrategy: 'indentation',
  accessibilitySupport: 'off',
  autoIndent: 'advanced',
  snippetSuggestions: 'none',
  renderLineHighlight: 'none',
  trimAutoWhitespace: false,
  hideCursorInOverviewRuler: true,
  renderWhitespace: 'none',
  overviewRulerBorder: true,

  gotoLocation: {
    multipleDeclarations: 'peek',
    multipleTypeDefinitions: 'peek',
    multipleDefinitions: 'peek',
  },

  foldingHighlight: false,
  unfoldOnClickAfterEndOfLine: true,

  inlayHints: {
    enabled: 'off',
  },

  acceptSuggestionOnEnter: 'on',

  quickSuggestions: {
    other: true,
    comments: true,
    strings: true,
  },
};

await loadWASM(await fetch('/onig.wasm'));

await registerDolphinDBLanguage(Monaco, {
  docsAnalyser: new DocsAnalyser(await (await fetch('/docs.zh.json')).json()),
});

const editor = Monaco.editor.create(document.getElementById('root')!, {
  value: '1 + 2',
  language: 'dolphindb',
  ...settings,
});
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(editor.getContribution('editor.contrib.suggestController') as any).widget.value._setDetailsVisible(true);
