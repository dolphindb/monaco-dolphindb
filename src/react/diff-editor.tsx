import { DiffEditor as MonacoDiffEditor, DiffEditorProps } from '@monaco-editor/react';

import { DEFAULT_SETTINGS } from './default-settings.js';
import { IUseInitDolphinDBbMonacoOptions, useInitDolphinDBbMonaco } from './shared.js';

interface IMonacoDolphinDBDiffEditorProps extends DiffEditorProps, IUseInitDolphinDBbMonacoOptions {}

export function MonacoDolphinDBDiffEditor({
  onMonacoInit,
  beforeMonacoInit,
  onMonacoInitFailed,
  options,
  dolphinDBLanguageOptions,
  ...restProps
}: IMonacoDolphinDBDiffEditorProps) {
  useInitDolphinDBbMonaco({
    beforeMonacoInit,
    onMonacoInit,
    onMonacoInitFailed,
    dolphinDBLanguageOptions,
  });

  return (
    <MonacoDiffEditor
      language="dolphindb"
      options={{
        ...DEFAULT_SETTINGS,
        ...options,
      }}
      {...restProps}
    />
  );
}
