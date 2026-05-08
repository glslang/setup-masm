# AGENTS.md

Guidance for agents working on `glslang/setup-masm`.

## Project Overview

This repository is a GitHub Action that locates Microsoft Macro Assembler (MASM) from an installed Visual Studio toolchain and adds the assembler directory to `PATH`.

- Action metadata lives in `action.yml`.
- TypeScript source lives in `src/main.ts`.
- The checked-in runtime artifact is `dist/index.js`; GitHub Actions runs this file directly via `action.yml`.
- CI is defined in `.github/workflows/ci.yaml`.
- The action targets Node 24.

## Core Behavior

`src/main.ts`:

- Reads inputs with `@actions/core`: `vswhere-path`, `vs-version`, `vs-prerelease`, and `vs-architecture`.
- Fails early on non-Windows runners.
- Resolves `vswhere.exe` from an explicit input, `PATH`, or the Visual Studio Installer location under `ProgramFiles(x86)`.
- Uses `vswhere` to find the Visual Studio installation path.
- Reads `VC\Auxiliary\Build\Microsoft.VCToolsVersion.default.txt`.
- Selects the assembler binary by architecture:
  - `x64` -> `ml64.exe`
  - `x86` -> `ml.exe`
  - `arm64` -> `armasm64.exe`
- Sets the `masmPath` output to the assembler folder and adds that folder to `PATH`.

Preserve these contracts when changing behavior. If an input, output, supported architecture, or runtime path changes, update `action.yml`, `README.md`, and CI examples together.

## Build Commands

Use Node 24.

```sh
npm ci
npm run build
npm run pack
npm run all
```

Script meanings:

- `npm run build` runs `tsc`.
- `npm run pack` bundles `src/main.ts` into `dist/index.js` with esbuild.
- `npm run all` runs both build and pack.

Because this is a JavaScript action, include the regenerated `dist/index.js` when source changes affect runtime behavior.

## Validation

Run `npm run all` before submitting changes.

Functional validation requires Windows runners with Visual Studio installed. The CI matrix exercises:

- `x86` on `windows-latest`, expecting `ml.exe`.
- `x64` on `windows-latest`, expecting `ml64.exe`.
- `arm64` on `windows-11-arm`, expecting `armasm64.exe`.

If you cannot run Windows validation locally, say so clearly in your handoff and rely on CI for full action behavior.

## Coding Style

- Keep TypeScript strict and compatible with the existing `tsconfig.json`.
- Follow the current lightweight style: single quotes, no semicolons, direct `@actions/*` APIs, and minimal abstractions.
- Prefer `path.join` for filesystem paths, but be careful with Visual Studio path segments that currently include Windows-specific backslashes.
- Keep errors actionable for workflow users. Use `core.setFailed(...)` for user-facing failure paths.
- Do not introduce non-Windows behavior unless the action contract is intentionally expanded.

## Change Checklist

Before finishing a change, check:

- `action.yml` still points to the bundled file that exists in `dist`.
- `README.md` documents any changed inputs, outputs, examples, or supported architectures.
- `src/main.ts` and `dist/index.js` are in sync after running `npm run pack`.
- CI still covers each supported architecture.
- Version references in docs and package metadata are updated only when intentionally preparing a release.

## Repository Notes

- The project is MIT licensed.
- `CONTRIBUTING.md` asks contributors to keep pull requests clear, include relevant issue context, follow existing style, add tests for new functionality when practical, and update documentation when needed.
- The implementation is based on `microsoft/setup-msbuild`, so compare behavior carefully before changing `vswhere` discovery or Visual Studio version selection.
