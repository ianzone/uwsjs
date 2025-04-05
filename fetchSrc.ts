import { $ } from 'bun';

export async function fetchSrc() {
  const commit = Bun.file('source_commit').text();
  const res = fetch(
    'https://raw.githubusercontent.com/uNetworking/uWebSockets.js/refs/heads/binaries/source_commit',
  ).then((res) => res.text());

  if ((await commit) === (await res)) {
    console.log('No update');
    process.exit(0);
  }

  await $`bunx degit uNetworking/uWebSockets.js#binaries packages/core --force`;
}
