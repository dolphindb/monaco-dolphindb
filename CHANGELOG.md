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
