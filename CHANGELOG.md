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
