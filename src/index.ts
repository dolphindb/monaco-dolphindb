import { registerTokenizer, setColorMap } from './tokenizer.js';
import { DocsAvailableValue, loadDocs, registerDocsRelatedLanguageProviders } from './docs.js';
import type * as Monaco from 'monaco-editor';
import { IRawTheme } from 'vscode-textmate';
import { LANGUAGE_ID } from './constant.js';

export interface RegisterDolphinDBLanguageOptions {
  docs: DocsAvailableValue;
  language: 'zh' | 'en';
  theme?: 'light' | 'dark' | IRawTheme;
}

export async function registerDolphinDBLanguage(monaco: typeof Monaco, options: RegisterDolphinDBLanguageOptions) {
  const { languages } = monaco;

  languages.register({ id: LANGUAGE_ID });

  const loadDocsPromise = loadDocs(options.docs).catch((err) => {
    console.error('[monaco-dolphindb] Load docs assets failed, please check your option');
    console.error(err);
  });

  await registerTokenizer(languages);

  setColorMap(monaco, options?.theme ?? 'light');

  registerDocsRelatedLanguageProviders(monaco, options.language);

  await loadDocsPromise;
}
