import { fetchSrc } from './fetchSrc';
import { makeBin } from './makeBin';
import { makeCore } from './makeCore';

fetchSrc().then(() => {
  console.log('Fetch complete');
  makeBin().then(() => {
    console.log('Bin package created');
    makeCore().then(() => {
      console.log('Core package created');
    });
  });
});
