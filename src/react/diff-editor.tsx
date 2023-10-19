import { DiffEditor as MonacoDiffEditor, DiffEditorProps } from '@monaco-editor/react';

import { DEFAULT_SETTINGS } from './default-settings.js';
import { IUseInitDolphinDBMonacoOptions, useInitDolphinDBMonaco, useDolphinDBMonacoOptions } from './shared.js';

interface IMonacoDolphinDBDiffEditorProps extends DiffEditorProps, IUseInitDolphinDBMonacoOptions {}

export function MonacoDolphinDBDiffEditor({
  onMonacoInit,
  beforeMonacoInit,
  onMonacoInitFailed,
  options,
  dolphinDBLanguageOptions,
  ...restProps
}: IMonacoDolphinDBDiffEditorProps) {
  useInitDolphinDBMonaco({
    beforeMonacoInit,
    onMonacoInit,
    onMonacoInitFailed,
    dolphinDBLanguageOptions,
  });

  useDolphinDBMonacoOptions(dolphinDBLanguageOptions);

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
