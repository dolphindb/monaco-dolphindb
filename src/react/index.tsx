import { useEffect } from 'react';

import { Editor as MonacoEditor, EditorProps, loader } from '@monaco-editor/react';
import type * as Monaco from 'monaco-editor';

import { RegisterDolphinDBLanguageOptions, registerDolphinDBLanguage } from '../index.js';
import { DEFAULT_SETTINGS } from './default-settings.js';
import useIsUnmounted from './use-is-unmounted.js';

interface IMonacoDolphinDBEditorProps extends EditorProps {
  /** 只会触发在 monaco 初始化完成前渲染的组件的，初始化完成后重新渲染组件将不再触发该方法 */
  onMonacoInit?: (monaco: typeof Monaco) => void;
  /** Monaco 初始化失败的回调，触发规则同 onMonacoInit */
  onMonacoInitFailed?: (err: Error) => void;
  /** 初始化前的 hook，你可以加载或配置 monaco 需要的资源（wasm） */
  beforeMonacoInit?: () => Promise<void> | void;
  dolphinDBLanguageOptions: RegisterDolphinDBLanguageOptions;
}

let monacoInitialized = false;
let initMonacoPromise: Promise<typeof Monaco> | null = null;

export function MonacoDolphinDBEditor({
  onMonacoInit,
  beforeMonacoInit,
  onMonacoInitFailed,
  onMount,
  options,
  dolphinDBLanguageOptions,
  ...restProps
}: IMonacoDolphinDBEditorProps) {
  const isUnmountedRef = useIsUnmounted();

  useEffect(() => {
    (async () => {
      function setInitMonacoPromiseThenAndCatch(p: Promise<typeof Monaco>) {
        p.then((monaco) => {
          if (!isUnmountedRef.current) {
            onMonacoInit?.(monaco);
          }
        })
          .catch((err) => {
            onMonacoInitFailed?.(err);
          })
          .finally(() => {
            initMonacoPromise = null;
          });
      }

      // 已完成初始化
      if (monacoInitialized) {
        return;
      }

      // 正在初始化
      if (initMonacoPromise) {
        setInitMonacoPromiseThenAndCatch(initMonacoPromise);
        return;
      }

      // 未初始化
      initMonacoPromise = (async () => {
        await beforeMonacoInit?.();

        const monaco = await loader.init();

        await registerDolphinDBLanguage(monaco, dolphinDBLanguageOptions);

        await document.fonts.ready;

        monacoInitialized = true;

        return monaco;
      })();

      setInitMonacoPromiseThenAndCatch(initMonacoPromise);
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
        // 使 suggest details 始终保持显示
        // https://github.com/microsoft/monaco-editor/issues/3216
        // monaco@0.35.0 采用 minify 过的代码，在不使用 esm bundle 的情况下，无法直接访问 suggestWidget 的属性
        // 我们采用一种暴力的方法，直接访问 suggestWidget 的私有属性
        // 可以从 esm 包中找到原函数 (monaco-editor/esm/vs/editor/contrib/suggest/browser/suggestWidget.js)
        // 文件内搜索 `_setDetailsVisible` 可以搜 "expandSuggestionDocs" 这个字段
        // 然后对比 dev 包中的代码 (monaco-editor/dev/vs/editor/editor.main.js)
        // 也搜索 "expandSuggestionDocs" 这个字段，找到 `_setDetailsVisible` minify 之后的函数名（现在是 X），写在下面
        // edit: 0.37.0 版本又改回来了，直接调用 _setDetailsVisible 就可以了
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (editor.getContribution('editor.contrib.suggestController') as any).widget.value._setDetailsVisible(true);

        onMount?.(editor, monaco);
      }}
      {...restProps}
    />
  );
}
