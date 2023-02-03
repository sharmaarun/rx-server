
const { execSync, exec } = require("child_process")
const { existsSync, readFileSync, symlinkSync, rm, rmSync, unlink, unlinkSync, chmodSync } = require("fs")
const { resolve } = require("path")
const { cwd } = require("process")
const linkBin = require("bin-links")
const config = require("../../tsconfig.base.json")
const { paths } = config?.compilerOptions

const _exec = (command, args = [], options = {}) => {
    return new Promise((resolve, reject) => {
        exec(command + " " + (args.join(" ")), options, (error, stdout, stderr) => {
            if (error) {
                return reject(error || stderr);
            }
            return resolve(stdout);
        });
    });
}

async function linkBinary({ dir, pkg }) {
    const pkg_ = JSON.parse(readFileSync(pkg))
    let { bin, name } = pkg_ || {}
    if (bin) {
        if (typeof bin === "string") {
            bin = {
                [name]: bin
            }
        }
        for (let key in bin) {
            const binPath = resolve(dir, bin[key])
            console.log("Linking", binPath)
            const nmPath = resolve("node_modules/.bin/", key)
            console.log(existsSync(nmPath), nmPath)
            if (existsSync(nmPath)) {
                console.log(nmPath)
                unlinkSync(nmPath, { force: true })
            }
            symlinkSync(binPath, nmPath)
            _exec("chmod", ["+x", binPath])
            _exec("chmod", ["+x", nmPath])
        }
    }
}

async function init() {
    for (let path in paths) {
        const relPath = paths[path]?.[0]
        const libRoot = resolve("dist/", relPath?.replace(/.ts$/i, "/../.."))
        const libPkg = libRoot + "/package.json"
        if (!existsSync(libPkg)) continue
        const { name, bin } = JSON.parse(readFileSync(libPkg))
        const nmPath = resolve("node_modules", name)
        if (existsSync(nmPath)) {
            if (bin) {
                unlinkSync(nmPath, {
                    recursive: true,
                    force: true
                })
            } else {
                continue
            }
        }
        await _exec("yarn", ["link"], {
            cwd: libRoot
        })
        await _exec("yarn", ["link", name], {
            cwd: "node_modules"
        })
        await linkBinary({ dir: libRoot, pkg: libPkg })
        console.log("Linked " + name)
    }
}
init()