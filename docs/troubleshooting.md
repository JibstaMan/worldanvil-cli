# Troubleshooting

## Not a recognized command

```shell
'D\world\node_modules\.bin\' is not recognized as an internal or external command, 
operation program or batch file.
node:internal/modules/cjs/loader:936
  throw err;
  ^

Error: Cannot find module 'D:\path\to\world\@jibstasoft\worldanvil-cli\bin\worldanvil-cli.js'
    at Function.Module._resolveFilename (node:internal/modules/cjs/loader:933:15)
    at Function.Module._load (node:internal/modules/cjs/loader:778:27)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:81:12)
    at node:internal/main/run_main_module:17:47 {
  code: 'MODULE_NOT_FOUND',
  requireStack: []
}
```

When you get this error, check the path in which you initialized the CLI. When it contains special characters (e.g. `&`), `npx` will get the path wrong, resulting in this error.
