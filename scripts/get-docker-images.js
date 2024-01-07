const util = require("node:util");
const exec = util.promisify(require("node:child_process").exec);
const fs = require("node:fs/promises");
const { existsSync } = require("node:fs");

/**
 * Get the absolute paths for the specified workspace packages
 * @param {string[]} packageNames
 * @returns {Promise<{
 *  name: string;
 *  version: string;
 *  path: string;
 * }[]>}
 */
async function getPackagePaths(packageNames) {
  const { stdout } = await exec(`pnpm ls --only-projects -r --json`);
  const allPackages = JSON.parse(stdout);
  return allPackages.filter((package) => packageNames.includes(package.name));
}

/**
 * Filter packages to the ones that have a production Dockerfile
 * @param {{
 *  name: string;
 *  version: string;
 *  path: string;
 * }[]} packages
 * @returns {Promise<{
 *  name: string;
 *  version: string;
 *  path: string;
 * }[]>}
 */
async function filterContainerizable(packages) {
  const filtered = packages
    .map((package) => {
      if (existsSync(`${package.path}/Dockerfile`)) {
        return {
          name: package.name,
          version: package.version,
          path: package.path,
        };
      }
    })
    .filter((p) => !!p);

  return filtered;
}

async function main() {
  const packages = JSON.parse(process.argv[2]);

  const packagesWithPaths = await getPackagePaths(packages);
  const packagesWithImages = await filterContainerizable(packagesWithPaths);

  process.stdout.write(JSON.stringify(packagesWithImages.map((p) => p.name)));
}

main().catch((e) => process.stderr.write(e.message));
