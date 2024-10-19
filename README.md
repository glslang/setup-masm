# setup-masm ![Build Status](https://github.com/glslang/setup-masm/actions/workflows/ci.yaml/badge.svg)

A GitHub Action to facilitate configuring MASM (Microsoft Macro Assembler) in the workflow PATH to use x64 assembly in Win32 applications.

## Description

This action helps set up MASM into the PATH for later usage in your GitHub Actions workflows. It's particularly useful for projects that require assembly language programming on Windows platforms.

## Usage

Add the following step to your workflow:

```yaml
- uses: actions/setup-masm@v1
  with:
    vs-version: '2022'
    vs-prerelease: 'true'
```

## Inputs

- `vs-version`: The version of Visual Studio to use. Defaults to 'latest'.
- `vs-prerelease`: Whether to include prerelease versions of Visual Studio. Defaults to 'false'.

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
      - uses: microsoft/setup-msbuild@v1.1
      - uses: glslang/setup-masm@v1
        with:
          vs-version: '2022'
          vs-prerelease: 'true'
```

This example demonstrates how to set up MASM in a Windows-based workflow, ensuring that the necessary tools are available for building and testing your project.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## Contributing

We welcome contributions! Please read our [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## Contact

For any inquiries, please contact the maintainers of this repository.

## Credits

This project was based on [actions/setup-msbuild](https://github.com/actions/setup-msbuild) and [microsoft/setup-msbuild](https://github.com/microsoft/setup-msbuild).
