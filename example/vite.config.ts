import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import Pages from 'vite-plugin-pages';
import monacoEditorPlugin from 'vite-plugin-monaco-editor';

export default defineConfig({
  plugins: [
    Pages(),
    tsconfigPaths(),
    // @ts-ignore
    monacoEditorPlugin.default({}),
  ],
});
