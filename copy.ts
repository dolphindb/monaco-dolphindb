import { fcopy } from 'xshell'

const fpd_root = import.meta.dirname.fpd

await Promise.all(
    ['vscode-oniguruma/release/onig.wasm', 'dolphindb/docs.en.json', 'dolphindb/docs.zh.json'].map(async fp => 
        fcopy(`${fpd_root}node_modules/${fp}`, `${fpd_root}example/public/${fp.fname}`)
    )
)
