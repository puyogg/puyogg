/**
 * Maps the output of the Changeset GitHub Action to a list of package names.
 * If I was smart I'd figure out how to do this like a normal person with `jq`
 */
async function main() {
  /**
   * @type {{
   *  name: string;
   *  version: string;
   *  path: string;
   * }[]}
   */
  const packages = JSON.parse(process.argv[2]);
  process.stdout.write(JSON.stringify(packages.map((p) => p.name)));
}

main().catch((e) => console.error(e));
