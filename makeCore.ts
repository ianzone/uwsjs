import { run } from '@es-proj/utils/bun';
import { readPkgJSON } from '@es-proj/utils/node';
import { makeBin } from './makeBin';

const coreDir = `${process.cwd()}/packages/core`;
const pkgJsonDir = `${coreDir}/package.json`;

export async function makeCore() {
  const pkg = readPkgJSON(pkgJsonDir);
  pkg.name = '@uwsjs/core';
  pkg.files = ['*.d.ts', '*.js', '*.mjs'];
  pkg.repository = {
    type: 'git',
    url: 'git+https://github.com/ianzone/uwsjs.git',
  };
  pkg.scripts = {
    release: 'bun publish --access public',
  };
  pkg.optionalDependencies = {};
  const binPaths = (await run(`ls ${coreDir}/uws_*.node`)).stdout.split('\n');
  for (const binPath of binPaths) {
    const peer = await makeBin(binPath, pkg.version as string);
    await Bun.write(`${binPath}.js`, `module.exports = require('${peer}');`);
    pkg.optionalDependencies[peer] = pkg.version;
  }

  await Bun.write(pkgJsonDir, JSON.stringify(pkg, null, 2));
  await run(`cp ${coreDir}/source_commit .`);
}
makeCore();
