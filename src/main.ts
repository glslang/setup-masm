import * as core from '@actions/core'
import * as exec from '@actions/exec'
import * as fs from 'fs'
import * as path from 'path'
import * as io from '@actions/io'
import { ExecOptions } from '@actions/exec/lib/interfaces'

const IS_WINDOWS = process.platform === 'win32'
const VS_VERSION = core.getInput('vs-version') || 'latest'
const VSWHERE_PATH = core.getInput('vswhere-path')
const ALLOW_PRERELEASE = core.getInput('vs-prerelease') || 'false'

// Use let for mutable variables
let vswhereExec = '-products * -requires Microsoft.Component.MSBuild -property installationPath -latest '

if (ALLOW_PRERELEASE === 'true') {
  vswhereExec += ' -prerelease '
}

if (VS_VERSION !== 'latest') {
  vswhereExec += `-version "${VS_VERSION}" `
}

core.debug(`Execution arguments: ${vswhereExec}`)

async function run(): Promise<void> {
  try {
    // exit if non Windows runner
    if (IS_WINDOWS === false) {
      core.setFailed('setup-masm can only be run on Windows runners')
      return
    }

    // check to see if we are using a specific path for vswhere
    let vswhereToolExe = ''

    if (VSWHERE_PATH) {
      // specified a path for vswhere, use it
      core.debug(`Using given vswhere-path: ${VSWHERE_PATH}`)
      vswhereToolExe = path.join(VSWHERE_PATH, 'vswhere.exe')
    } else {
      // check in PATH to see if it is there
      try {
        const vsWhereInPath: string = await io.which('vswhere', true)
        core.debug(`Found tool in PATH: ${vsWhereInPath}`)
        vswhereToolExe = vsWhereInPath
      } catch {
        // fall back to VS-installed path
        vswhereToolExe = path.join(
          process.env['ProgramFiles(x86)'] as string,
          'Microsoft Visual Studio\\Installer\\vswhere.exe'
        )
        core.debug(`Trying Visual Studio-installed path: ${vswhereToolExe}`)
      }
    }

    if (!fs.existsSync(vswhereToolExe)) {
      core.setFailed(
        'setup-masm requires the path to where vswhere.exe exists'
      )

      return
    }

    core.debug(`Full tool exe: ${vswhereToolExe}`)

    let foundToolPath = ''
    const options: ExecOptions = {
      listeners: {
        stdout: (data: Buffer) => {
          const installationPath = data.toString().trim()
          core.debug(`Found installation path: ${installationPath}`)

          const vcToolsVersion = (
            fs.readFileSync(`${installationPath}\\VC\\Auxiliary\\Build\\Microsoft.VCToolsVersion.default.txt`)
              .toString()
              .trim()
          )

          const toolPath = path.join(
            installationPath,
            `VC\\Tools\\MSVC\\${vcToolsVersion}\\bin\\Hostx64\\x64\\ml64.exe`
          )
          core.debug(`Checking for path: ${toolPath}`)
          if (fs.existsSync(toolPath)) {
            foundToolPath = toolPath
          }
        }
      }
    }

    await exec.exec(`"${vswhereToolExe}" ${vswhereExec}`, [], options)

    if (!foundToolPath) {
      core.setFailed('Unable to find MASM.')
      return
    }

    // extract the folder location for the tool
    const toolFolderPath = path.dirname(foundToolPath)

    // set the outputs for the action to the folder path of MASM
    core.setOutput('masmPath', toolFolderPath)

    // add tool path to PATH
    core.addPath(toolFolderPath)
    core.debug(`Tool path added to PATH: ${toolFolderPath}`)
  } catch (error) {
    core.setFailed((error as Error).message)
  }
}

run()
