import { fs, echo } from 'zx';

await Promise.all([
  fs.copyFile('./node_modules/vscode-oniguruma/release/onig.wasm', 'example/public/onig.wasm'),
  fs.copyFile('./node_modules/dolphindb/docs.en.json', 'example/public/docs.en.json'),
  fs.copyFile('./node_modules/dolphindb/docs.zh.json', 'example/public/docs.zh.json'),
]);

echo('Example prepared!');
