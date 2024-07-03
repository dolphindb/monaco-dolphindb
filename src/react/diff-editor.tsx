import { DiffEditor as MonacoDiffEditor, DiffEditorProps } from '@monaco-editor/react'

import { DEFAULT_SETTINGS } from './default-settings.js'
import { IUseInitDolphinDBMonacoOptions, use_init_dolphindb_monaco, use_dolphindb_monaco_options } from './shared.js'


export interface IMonacoDolphinDBDiffEditorProps extends DiffEditorProps, IUseInitDolphinDBMonacoOptions {}

export function MonacoDolphinDBDiffEditor ({
    onMonacoInit,
    beforeMonacoInit,
    onMonacoInitFailed,
    options,
    dolphinDBLanguageOptions,
    ...restProps
}: IMonacoDolphinDBDiffEditorProps) {
    use_init_dolphindb_monaco({
        beforeMonacoInit,
        onMonacoInit,
        onMonacoInitFailed,
        dolphinDBLanguageOptions
    })
    
    use_dolphindb_monaco_options(dolphinDBLanguageOptions)
    
    return <MonacoDiffEditor
            language='dolphindb'
            options={{
                ...DEFAULT_SETTINGS,
                ...options
            }}
            {...restProps}
        />
}
