import { useEffect } from 'react'
import type * as Monaco from 'monaco-editor'
import { loader, useMonaco } from '@monaco-editor/react'

import { RegisterDolphinDBLanguageOptions, registerDolphinDBLanguage } from '../index.js'
import { setColorMap } from '../tokenizer.js'

import useIsUnmounted from './use-is-unmounted.js'

let monacoInitialized = false
let initMonacoPromise: Promise<typeof Monaco> | null = null

export interface IUseInitDolphinDBMonacoOptions {
    /** 只会触发在 monaco 初始化完成前渲染的组件的，初始化完成后重新渲染组件将不再触发该方法 */
    onMonacoInit?: (monaco: typeof Monaco) => void
    /** Monaco 初始化失败的回调，触发规则同 onMonacoInit */
    onMonacoInitFailed?: (err: Error) => void
    /** 初始化前的 hook，你可以加载或配置 monaco 需要的资源（wasm） */
    beforeMonacoInit?: () => Promise<void> | void
    dolphinDBLanguageOptions: RegisterDolphinDBLanguageOptions
}

export function useInitDolphinDBMonaco ({
    beforeMonacoInit,
    onMonacoInit,
    onMonacoInitFailed,
    dolphinDBLanguageOptions
}: IUseInitDolphinDBMonacoOptions) {
    const isUnmountedRef = useIsUnmounted()
    
    function setInitMonacoPromiseThenAndCatch (p: Promise<typeof Monaco>) {
        p.then(monaco => {
            if (!isUnmountedRef.current) 
                onMonacoInit?.(monaco)
            
        })
            .catch(err => {
                onMonacoInitFailed?.(err)
            })
            .finally(() => {
                initMonacoPromise = null
            })
    }
    
    // 已完成初始化
    if (monacoInitialized) 
        return
    
    
    // 正在初始化
    if (initMonacoPromise) {
        setInitMonacoPromiseThenAndCatch(initMonacoPromise)
        return
    }
    
    // 未初始化
    initMonacoPromise = (async () => {
        await beforeMonacoInit?.()
        
        const monaco = await loader.init()
        
        await registerDolphinDBLanguage(monaco, dolphinDBLanguageOptions)
        
        await document.fonts.ready
        
        monacoInitialized = true
        
        return monaco
    })()
    
    setInitMonacoPromiseThenAndCatch(initMonacoPromise)
}

export type IUseDolphinDBMonacoOptions = RegisterDolphinDBLanguageOptions

/** update editor on options change */
export function useDolphinDBMonacoOptions ({ theme }: IUseDolphinDBMonacoOptions) {
    const monaco = useMonaco()
    
    useEffect(() => {
        if (monaco) 
            setColorMap(monaco, theme ?? 'light')
        
    }, [monaco, theme])
}
