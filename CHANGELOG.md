## 0.0.19 (2024-2-23)


### Features

* add MonacoDolphinDBDiffEditor component ([6c17206](https://github.com/dolphindb/monaco-dolphindb/commit/6c17206f9916c0a1883cf9365adc4dedc6d8c87d))
* support dynamic changed in react component ([2ec1543](https://github.com/dolphindb/monaco-dolphindb/commit/2ec1543468c693e5128136f3f93087e1774c2169))


### Bug Fixes

* 修复当函数第一个参数在点号前面被指定时，函数参数的代码提示有误 ([6ef42dd](https://github.com/dolphindb/monaco-dolphindb/commit/6ef42dd5fe0d3e5084a50268b03512ebb74808b6))
* 修复输入多个函数参数后，参数索引不正确的问题 ([9e1a6a9](https://github.com/dolphindb/monaco-dolphindb/commit/9e1a6a942373b445aaa002c96b49ed341f7b7316))
* bugfix and onMonacoInitFailed feature ([9dd083e](https://github.com/dolphindb/monaco-dolphindb/commit/9dd083e6784b0d6684732bc3bcc251769e2341a2))
* Difference mounted props with last render not affect ([8704e06](https://github.com/dolphindb/monaco-dolphindb/commit/8704e060e69983954ce83deb7ba785d7c9d5c2af))
* init hooks not working ([a1fe107](https://github.com/dolphindb/monaco-dolphindb/commit/a1fe10728a77072de9ce1708eee0c61a806cd06e))
* rerender state error, exports error ([07c0e8d](https://github.com/dolphindb/monaco-dolphindb/commit/07c0e8d30326f359ce983ae0a3da3bc50d92dcf5))
* update example style ([256b70c](https://github.com/dolphindb/monaco-dolphindb/commit/256b70cebbb164bae1505d549d9298b8405cfb7e))
* update react example ([2af8501](https://github.com/dolphindb/monaco-dolphindb/commit/2af85016c37b6ac547a303747d8a658d57546a70))

## 0.0.15

### Bugfix

- Difference mounted props with last render not affect
- Add duplicate call check on `loadDocs`

## 0.0.13

### Feature

- support `MonacoDolphinDBEditor` and `MonacoDolphinDBDiffEditor` React Component's props change.

## 0.0.5

### Feature

- Add `MonacoDolphinDBDiffEditor` component in 'monaco-dolphindb/react'

## 0.0.4

### Chore

- README and package.json update

## 0.0.3

### Bugfix

- Reset `initMonacoPromise` global variable after init wherever success or fail
- Adjust detail docs change line rule
- Remove `exports.*.require` property in `package.json`

### Chore

- Update LICENSE
- Provide `theme/*` files import

## 0.0.2

### Feature

`MonacoDolphinDBEditor`:

- Add `onMonacoInitFailed` prop
- Rename `beforeInit` to `beforeMonacoInit`

### Bugfix

- Fix non '.js' suffix imports
- Fix `MonacoDolphinDBEditor`'s init hooks not working on first render

## 0.0.1

Initial release
