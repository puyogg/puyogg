const util = require("node:util");
const exec = util.promisify(require("node:child_process").exec);
const fs = require("node:fs/promises");

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
 * Filter packages to the ones that have a "build-image" package.json command.
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
  const filtered = (
    await Promise.all(
      packages.map(async (package) => {
        const packageJson = JSON.parse(
          await fs.readFile(`${package.path}/package.json`)
        );
        if (packageJson.scripts["build-image"]) {
          return {
            name: package.name,
            version: package.version,
            path: package.path,
          };
        }
      })
    )
  ).filter((package) => !!package);

  return filtered;
}

async function main() {
  const packages = JSON.parse(process.argv[2]);

  const packagesWithPaths = await getPackagePaths(packages);
  const packagesWithImages = await filterContainerizable(packagesWithPaths);

  process.stdout.write(JSON.stringify(packagesWithImages.map((p) => p.name)));
}

main().catch((e) => process.stderr.write(e.message));
