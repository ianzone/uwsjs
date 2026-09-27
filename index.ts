import { fetchSrc } from './fetchSrc';
import { makeBin } from './makeBin';
import { makeCore } from './makeCore';

async function main() {
  await fetchSrc();
  console.log('Fetch complete');

  await makeBin();
  console.log('Binary package created');

  await makeCore();
  console.log('Core package created');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
