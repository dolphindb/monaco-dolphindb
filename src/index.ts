import { registerTokenizer, setColorMap } from './tokenizer.js';
import type * as Monaco from 'monaco-editor';
import { IRawTheme } from 'vscode-textmate';
import { LANGUAGE_ID } from './constant.js';
import { DocsAnalyser } from './docs/analyser.js';
import { registerMonacoLanguageProviders, setDocsAnalyser } from './monaco.js';

export interface RegisterDolphinDBLanguageOptions {
  docsAnalyser: DocsAnalyser;
  theme?: 'light' | 'dark' | IRawTheme;
}

export async function registerDolphinDBLanguage(monaco: typeof Monaco, options: RegisterDolphinDBLanguageOptions) {
  const { languages } = monaco;

  languages.register({ id: LANGUAGE_ID });

  setDocsAnalyser(options.docsAnalyser);
  registerMonacoLanguageProviders(monaco);

  await registerTokenizer(languages);

  setColorMap(monaco, options?.theme ?? 'light');
}

export { DocsAnalyser } from './docs/analyser.js';
