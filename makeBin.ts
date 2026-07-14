import { run } from '@es-proj/utils/bun';
import { readPkgJSON } from '@es-proj/utils/node';
import * as nodeAbi from 'node-abi';

const coreDir = `${process.cwd()}/packages/core`;
const pkgJsonDir = `${coreDir}/package.json`;

export async function makeBin() {
  const dirs = (await run(`ls ${coreDir}/uws_*.node`)).stdout.split('\n');
  for (const path of dirs) {
    const name = path.split('uws_').at(-1)?.split('.')[0]?.split('_') as string[];
    const platform = name[0];
    const arch = name[1];
    const major = nodeAbi.getTarget(name[2], 'node').split('.')[0];
    const range = `>=${major}.0.0 <${Number(major) + 1}.0.0`;
    const binPkg = `${platform}-${arch}-${major}`;

    await run(`cp -r template/. packages/${binPkg}`);
    await run(`cp ${path} packages/${binPkg}/uws.node`);
    const binJsonDir = `${process.cwd()}/packages/${binPkg}/package.json`;
    const pkg = readPkgJSON(binJsonDir);
    pkg.name = `@uwsjs/${binPkg}`;
    pkg.version = readPkgJSON(pkgJsonDir).version;
    pkg.files = ['index.js', 'uws.node'];
    pkg.scripts = {
      release: 'bun publish --access public',
    };
    pkg.os = [platform];
    pkg.cpu = [arch];
    if (platform === 'linux') {
      pkg.libc = 'glibc';
    }
    pkg.engines = {
      node: range,
    };
    await Bun.write(binJsonDir, JSON.stringify(pkg, null, 2));
  }
}
