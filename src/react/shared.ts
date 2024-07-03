import { useEffect } from 'react'
import type * as Monaco from 'monaco-editor'
import { loader, useMonaco } from '@monaco-editor/react'

import { RegisterDolphinDBLanguageOptions, register_dolphindb_language } from '../index.js'
import { set_color_map } from '../tokenizer.js'

import use_is_unmounted from './use-is-unmounted.js'

let monaco_initialized = false
let init_monaco_promise: Promise<typeof Monaco> | null = null


export interface IUseInitDolphinDBMonacoOptions {
    /** 只会触发在 monaco 初始化完成前渲染的组件的，初始化完成后重新渲染组件将不再触发该方法 */
    onMonacoInit?: (monaco: typeof Monaco) => void
    /** Monaco 初始化失败的回调，触发规则同 onMonacoInit */
    onMonacoInitFailed?: (err: Error) => void
    /** 初始化前的 hook，你可以加载或配置 monaco 需要的资源（wasm） */
    beforeMonacoInit?: () => Promise<void> | void
    dolphinDBLanguageOptions: RegisterDolphinDBLanguageOptions
}

export function use_init_dolphindb_monaco ({
    beforeMonacoInit,
    onMonacoInit,
    onMonacoInitFailed,
    dolphinDBLanguageOptions
}: IUseInitDolphinDBMonacoOptions) {
    const isUnmountedRef = use_is_unmounted()
    
    function setInitMonacoPromiseThenAndCatch (p: Promise<typeof Monaco>) {
        p.then(monaco => {
            if (!isUnmountedRef.current) 
                onMonacoInit?.(monaco)
            
        })
            .catch(err => {
                onMonacoInitFailed?.(err)
            })
            .finally(() => {
                init_monaco_promise = null
            })
    }
    
    // 已完成初始化
    if (monaco_initialized) 
        return
    
    
    // 正在初始化
    if (init_monaco_promise) {
        setInitMonacoPromiseThenAndCatch(init_monaco_promise)
        return
    }
    
    // 未初始化
    init_monaco_promise = (async () => {
        await beforeMonacoInit?.()
        
        const monaco = await loader.init()
        
        await register_dolphindb_language(monaco, dolphinDBLanguageOptions)
        
        await document.fonts.ready
        
        monaco_initialized = true
        
        return monaco
    })()
    
    setInitMonacoPromiseThenAndCatch(init_monaco_promise)
}

export type IUseDolphinDBMonacoOptions = RegisterDolphinDBLanguageOptions

/** update editor on options change */
export function use_dolphindb_monaco_options ({ theme }: IUseDolphinDBMonacoOptions) {
    const monaco = useMonaco()
    
    useEffect(() => {
        if (monaco) 
            set_color_map(monaco, theme ?? 'light')
        
    }, [monaco, theme])
}
