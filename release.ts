import { readdir } from 'node:fs/promises';
import { $ } from 'bun';

// Use the token when it is set, otherwise npm trusted publishing (OIDC), bun publish does not support it
const cli = process.env.NPM_CONFIG_TOKEN ? 'bun' : 'npm';

// core goes last, so it never points to binaries that are not on npm
const dirs = await readdir('packages').catch(() => []);
dirs.sort((a, b) => Number(a === 'core') - Number(b === 'core'));

for (const dir of dirs) {
  const { name, version } = await Bun.file(`packages/${dir}/package.json`).json();
  // Already published by a previous run that failed later
  if ((await fetch(`https://registry.npmjs.org/${name}/${version}`)).ok) {
    console.log(`${name}@${version} already published`);
    continue;
  }
  await $`${cli} publish --access public ${process.argv.slice(2)}`.cwd(`packages/${dir}`);
}
