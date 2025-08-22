# setup-masm [![Build Status](https://github.com/glslang/setup-masm/actions/workflows/ci.yaml/badge.svg)](https://github.com/glslang/setup-masm/actions) [![GitHub release](https://img.shields.io/github/v/release/glslang/setup-masm?logo=github)](https://github.com/marketplace/actions/setup-masm)

A GitHub Action to facilitate configuring MASM (Microsoft Macro Assembler) in the workflow PATH to use x86 or x64 assembly in Win32 applications.

## Description

This action helps set up MASM into the PATH for later usage in your GitHub Actions workflows. It's particularly useful for projects that require assembly language programming on Windows platforms.

## Usage

Add the following step to your workflow:

```yaml
- uses: glslang/setup-masm@v1.1
```

## Inputs

- `vs-version`: The version of Visual Studio to use. Defaults to `'latest'`.
- `vs-prerelease`: Whether to include prerelease versions of Visual Studio. Defaults to `'false'`.
- `vs-architecture`: By default the action will use the x64 architecture for MASM, but it is possible to target the x86 or arm64 versions instead. Valid input values are `'x64'`, `'x86'` and `'arm64'`. Note that the success of these will rely on the runner OS. Defaults to `'x64'`. 

## Outputs

- `masmPath`: The path to the MASM executable.

## PATH environment variable

The MASM path is added to the PATH environment variable.

## Example Workflow

```yaml
name: Build and Test

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: windows-latest
    steps:
      - uses: actions/checkout@v4
      - uses: microsoft/setup-msbuild@v2
      - uses: glslang/setup-masm@v1.1
        with:
          vs-version: '2022'
          vs-prerelease: 'true'
          vs-architecture: 'x86'
```

This example demonstrates how to set up MASM in a Windows-based workflow, ensuring that the necessary tools are available for building and testing your project.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## Contributing

We welcome contributions! Please read our [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## Contact

For any inquiries, please contact the maintainers of this repository.

## Credits

This project was based on [microsoft/setup-msbuild](https://github.com/microsoft/setup-msbuild). Cursor AI was used to generate code and documentation.
