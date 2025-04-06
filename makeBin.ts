import { run } from '@es-proj/utils/bun';
import { readPkgJSON } from '@es-proj/utils/node';

const nodeVersion = {
  '108': {
    major: 18,
    range: '>=18.0.0 <19.0.0',
  },
  '115': {
    major: 20,
    range: '>=20.0.0 <21.0.0',
  },
  '127': {
    major: 22,
    range: '>=22.0.0 <23.0.0',
  },
  '131': {
    major: 23,
    range: '>=23.0.0 <24.0.0',
  },
};

export async function makeBin(source: string, version: string) {
  const binName = source.split('/').at(-1)?.split('.')[0]?.split('_') as string[];
  const platform = binName[1] as string;
  const arch = binName[2] as string;
  const module = binName[3] as string;
  const nodeV = nodeVersion[module as keyof typeof nodeVersion];
  if (!nodeV) {
    throw new Error(`Unlisted module version: ${module}`);
  }
  const binPkg = `${platform}-${arch}-${nodeV.major}`;
  await run(`cp -r template/. packages/${binPkg}`);
  await run(`cp ${source} packages/${binPkg}/uws.node`);
  const pkgJsonDir = `${process.cwd()}/packages/${binPkg}/package.json`;
  const pkg = readPkgJSON(pkgJsonDir);
  pkg.name = `@uwsjs/${binPkg}`;
  pkg.version = version;
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
    node: nodeV.range,
  };
  await Bun.write(pkgJsonDir, JSON.stringify(pkg, null, 2));
  return pkg.name;
}
