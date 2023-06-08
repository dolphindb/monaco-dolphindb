import { useEffect } from 'react';

import { Editor as MonacoEditor, EditorProps, loader } from '@monaco-editor/react';
import type * as Monaco from 'monaco-editor';

import { RegisterDolphinDBLanguageOptions, registerDolphinDBLanguage } from '../index';
import { DEFAULT_SETTINGS } from './default-settings.js';
import useIsUnmounted from './use-is-unmounted';

interface IMonacoDolphinDBEditorProps extends EditorProps {
  /** 只会触发在 monaco 初始化完成前渲染的组件的，完成后创建组件 */
  onMonacoInit?: (monaco: typeof Monaco) => void;
  /** 初始化前的 hook，你可以加载或配置 monaco 需要的资源（wasm） */
  beforeInit?: () => Promise<void> | void;
  /** 初始化前的 hook，你可以加载或配置 monaco 需要的资源（wasm） */
  dolphinDBLanguageOptions: RegisterDolphinDBLanguageOptions;
}

let monacoInitialized = false;
let initMonacoPromise: Promise<typeof Monaco> | null = null;

export function MonacoDolphinDBEditor({
  onMonacoInit,
  beforeInit,
  onMount,
  options,
  dolphinDBLanguageOptions,
  ...restProps
}: IMonacoDolphinDBEditorProps) {
  const isUnmountedRef = useIsUnmounted();

  useEffect(() => {
    (async () => {
      // 已完成初始化
      if (monacoInitialized) {
        return;
      }

      // 正在初始化
      if (initMonacoPromise) {
        initMonacoPromise.then((monaco) => {
          if (!isUnmountedRef.current) {
            onMonacoInit?.(monaco);
          }
        });
        return;
      }

      // 未初始化
      initMonacoPromise = (async () => {
        await beforeInit?.();

        const monaco = await loader.init();

        await registerDolphinDBLanguage(monaco, dolphinDBLanguageOptions);

        await document.fonts.ready;

        monacoInitialized = true;
        initMonacoPromise = null;

        return monaco;
      })();
    })();
  }, []);

  return (
    <MonacoEditor
      defaultLanguage="dolphindb"
      language="dolphindb"
      options={{
        ...DEFAULT_SETTINGS,
        ...options,
      }}
      onMount={(editor, monaco) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (editor.getContribution('editor.contrib.suggestController') as any).widget.value._setDetailsVisible(true);

        onMount?.(editor, monaco);
      }}
      {...restProps}
    />
  );
}
