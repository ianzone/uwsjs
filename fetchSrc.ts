import { $ } from 'bun';

export async function fetchSrc() {
  const token = process.env.GITHUB_TOKEN;
  const res = await fetch('https://api.github.com/repos/uNetworking/uWebSockets.js/releases/latest', {
    headers: token ? { authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) {
    throw new Error(`Cannot get the latest uWebSockets.js release: ${res.status}`);
  }
  const { tag_name } = (await res.json()) as { tag_name: string };

  const version = tag_name.replace(/^v/, '');
  if ((await fetch(`https://registry.npmjs.org/@uwsjs/core/${version}`)).ok) {
    console.log('No update');
    process.exit(0);
  }

  await $`bunx degit uNetworking/uWebSockets.js#${tag_name} packages/core --force`;
}
