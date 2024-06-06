import type * as Monaco from 'monaco-editor'
import { IRawTheme } from 'vscode-textmate'

import { Docs, DocsAnalyser } from 'dolphindb/docs.js'

import { LANGUAGE_ID } from './constant.js'
import { registerTokenizer, setColorMap } from './tokenizer.js'
import { registerMonacoLanguageProviders, setDocsAnalyser } from './docs.js'


export interface RegisterDolphinDBLanguageOptions {
    docs: Docs
    theme?: 'light' | 'dark' | IRawTheme
}


export async function registerDolphinDBLanguage (monaco: typeof Monaco, { docs, theme }: RegisterDolphinDBLanguageOptions) {
    const { languages } = monaco
    
    languages.register({ id: LANGUAGE_ID })
    
    setDocsAnalyser(new DocsAnalyser(docs))
    registerMonacoLanguageProviders(monaco)
    
    await registerTokenizer(languages)
    
    setColorMap(monaco, theme ?? 'light')
}
