import { Editor as MonacoEditor, EditorProps, OnMount } from '@monaco-editor/react';

import { DEFAULT_SETTINGS } from './default-settings.js';
import { IUseInitDolphinDBMonacoOptions, useInitDolphinDBMonaco, useDolphinDBMonacoOptions } from './shared.js';
import * as React from 'react';

export interface IMonacoDolphinDBEditorProps extends EditorProps, IUseInitDolphinDBMonacoOptions {}

export function MonacoDolphinDBEditor({
  onMonacoInit,
  beforeMonacoInit,
  onMonacoInitFailed,
  onMount: onMountProp,
  options,
  dolphinDBLanguageOptions,
  ...restProps
}: IMonacoDolphinDBEditorProps) {
  useInitDolphinDBMonaco({
    beforeMonacoInit,
    onMonacoInit,
    onMonacoInitFailed,
    dolphinDBLanguageOptions,
  });

  useDolphinDBMonacoOptions(dolphinDBLanguageOptions);

  const onMount = React.useCallback<OnMount>(
    (editor, monaco) => {
      try {
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
      } catch (err) {
        console.warn('[monaco-dolphindb/react] Failed to set suggest details visible', err);
      }

      onMountProp?.(editor, monaco);
    },
    [onMountProp]
  );

  return (
    <MonacoEditor
      defaultLanguage="dolphindb"
      language="dolphindb"
      options={{
        ...DEFAULT_SETTINGS,
        ...options,
      }}
      onMount={onMount}
      {...restProps}
    />
  );
}
