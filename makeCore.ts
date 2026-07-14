import { run } from '@es-proj/utils/bun';
import { readPkgJSON } from '@es-proj/utils/node';

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
  const packages = (await run(`ls ${process.cwd()}/packages`)).stdout.split('\n');

  for (const peerPkg of packages) {
    if (peerPkg === 'core') continue;
    pkg.optionalDependencies[`@uwsjs/${peerPkg}`] = pkg.version;
  }

  await Bun.write(pkgJsonDir, JSON.stringify(pkg, null, 2));

  const code = await Bun.file(`${coreDir}/uws.js`).text();
  const uws = code.replace(
    `'./uws_' + process.platform + '_' + process.arch + '_' + process.versions.modules + '.node'`,
    `'@uwsjs/' + process.platform + '-' + process.arch + '-' + process.versions.node.split('.')[0]`,
  );

  await Bun.write(`${coreDir}/uws.js`, uws);
  await run(`cp ${coreDir}/source_commit .`);
}
