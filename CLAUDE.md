# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A GitHub Action that locates and adds MASM (Microsoft Macro Assembler) to the PATH on Windows runners. It supports x86 (`ml.exe`), x64 (`ml64.exe`), and arm64 (`armasm64.exe`) architectures. The action works by running `vswhere.exe` to find the Visual Studio installation path, reading the VC Tools version from a text file, then constructing the path to the correct assembler binary.

## Build commands

```bash
npm run build   # TypeScript compile only (tsc → dist/)
npm run pack    # Bundle with esbuild only (dist/index.js)
npm run all     # build + pack (use this before committing)
```

**Always run `npm run all` before committing** — the action runs from `dist/index.js` (the esbuild bundle), not the raw TypeScript output. The `dist/` directory is committed to the repo.

## Architecture

- `src/main.ts` — the entire action logic (single file). Reads inputs at module load time as top-level constants, then `run()` is called immediately.
- `dist/index.js` — the esbuild-bundled CommonJS output that GitHub Actions executes (`runs.main` in `action.yml`). ESM bundles break on dynamic `require()` in dependencies such as `tunnel`.
- `action.yml` — action metadata, inputs/outputs definition. Uses `node24` runtime.
- `action-types.yml` — stricter type annotations for inputs (used by `krzema12/github-actions-typing`).

## Key implementation detail

The tool path is built as:
```
<VS install path>\VC\Tools\MSVC\<vcToolsVersion>\bin\Host<arch>\<arch>\<asmExe>
```
where `vcToolsVersion` is read from `<VS install path>\VC\Auxiliary\Build\Microsoft.VCToolsVersion.default.txt`.

`vswhere` is found via (in priority order): `vswhere-path` input → `PATH` → `%ProgramFiles(x86)%\Microsoft Visual Studio\Installer\vswhere.exe`.

## CI / testing

There are no unit tests. The CI workflow (`.github/workflows/ci.yaml`) tests the action end-to-end by running it on `windows-latest` (x86, x64) and `windows-11-arm` (arm64) and verifying the assembler binary is discoverable in PATH afterward. Testing locally requires a Windows machine with Visual Studio installed.
