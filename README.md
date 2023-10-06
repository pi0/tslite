# 🪶 tslite

[![install size](https://packagephobia.com/badge?p=tslite)](https://packagephobia.com/result?p=tslite)

`tslite` is a redistribution of `typescript` package with same public API but much smaller install size!

## Why?

The 'typescript' package's installation size has significantly increased over time and is now [unreasonably large](https://packagephobia.com/result?p=typescript) for use as a project dependency.

However, this issue has been on the TypeScript team's radar ([microsoft/TypeScript#27891](https://github.com/microsoft/TypeScript/issues/27891)), and with the continuous efforts of [@jakebailey](https://github.com/jakebailey) and the rest of the TypeScript team to reduce the installation size, there are certain limitations preventing further size reduction.

Nevertheless, we can make further optimizations for end-users. The aim of this package is not to impede TypeScript's core improvements but to offer an alternative distribution tailored for end-users who require TypeScript as a peer dependency in their projects.

## How?

Check [`build.ts`](./build.ts) for build steps.

### Minified

Typescript cannot be officially distributed minified because of [preserving stack traces](https://github.com/microsoft/TypeScript/issues/27891#issuecomment-1307654814) and [allowing the package to be patched](https://github.com/microsoft/TypeScript/issues/27891#issuecomment-1307430212). However, for normal daily use of typescript, it does not matter unless there is a bug with typescript itself which in this case, we can temporarily switch off tslite. Minifying big JS files has a huge impact on the install size. tslite only minifies non `lib.` files over 250KB using [UglifyJS](https://github.com/mishoo/UglifyJS).

### Removed Locales

Typescript package ships with `~3.8M` of localized translation files for error messages which are usually not used. TSLite removed them.

### Typescript Nightly

[@jakebailey](https://github.com/jakebailey) recently worked on [microsoft/TypeScript#55273](https://github.com/microsoft/TypeScript/pull/55273) to merge `tsserverlibrary.js` and `typescript.js` and removing a huge amount of duplicate codes. This change will be available as of [early 5.3](https://github.com/microsoft/TypeScript/issues/27891#issuecomment-1676580727). I wasn't patient enough and made this redist based on this improvement to see the difference. (It reduced minified lib size from `~17MB` to `~14MB`)

### More Ideas?

I am thinking about more possible ideas to make typescript lib even smaller. For instance, we can lazily import compiler bits from the network on demand and cache them in a global user file being shared across projects. Ideas and PRs are more than welcome!!

## Usage

Keep `typescript` as a `devDependency` and use resolutions to alias `tslite`:

### npm

Using npm [overrides](https://docs.npmjs.com/cli/v8/configuring-npm/package-json#overrides):

```jsonc
// package.json
{
  "overrides": {
    "typescript": "npm:tslite@latest"
  }
}
```

### yarn and pnpm

Using yarn [selective dependency resolutions](https://classic.yarnpkg.com/lang/en/docs/selective-version-resolutions/) or [pnpm overrides](https://pnpm.io/package_json#pnpmoverrides):

```jsonc
// package.json
{
  "resolutions": {
    "typescript": "npm:tslite@latest"
  }
}
```
