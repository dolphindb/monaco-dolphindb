import type * as Monaco from 'monaco-editor'
import type { IRawTheme } from 'vscode-textmate'

import { type Docs, DocsProvider } from 'dolphindb/docs.js'

import { LANGUAGE_ID } from './constant.js'
import { register_tokenizer, set_color_map } from './tokenizer.js'
import { register_monaco_language_providers, set_docs_provider } from './docs.js'


export interface RegisterDolphinDBLanguageOptions {
    docs: Docs
    theme?: 'light' | 'dark' | IRawTheme
}


export async function register_dolphindb_language (monaco: typeof Monaco, { docs, theme }: RegisterDolphinDBLanguageOptions) {
    const { languages } = monaco
    
    languages.register({ id: LANGUAGE_ID })
    
    set_docs_provider(new DocsProvider(docs))
    register_monaco_language_providers(monaco)
    
    await register_tokenizer(languages)
    
    set_color_map(monaco, theme ?? 'light')
}
