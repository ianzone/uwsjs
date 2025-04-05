import { $ } from 'bun';
import { fetchSrc } from './fetchSrc';
import { makeCore } from './makeCore';

async function main() {
  await fetchSrc();
  await makeCore();
  await $`bun run --filter '*' release`;
}
main();
