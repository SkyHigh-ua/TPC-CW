import { performance } from 'perf_hooks';
import { bubbleSort } from './bubbleSort.js';
import { parallelBubbleSort } from './parallelBubbleSort.js';

function mean(arr) {
    let sum = 0;
    for (let i = 0; i < arr.length; i++) {
        sum += arr[i];
    }
    return sum / arr.length;
}

const size = 200000;
const array = Array.from({length: size}, () => Math.floor(Math.random() * size));
const seqTime = [];
const parTime = [];
(async () => {
    for (let i = 0; i < 30; i++) {
        bubbleSort([...array]);
    }
    for (let i = 0; i < 30; i++) {
        let start = performance.now();
        bubbleSort([...array]);
        let end = performance.now();
        seqTime.push(end - start);
        start = performance.now();
        await parallelBubbleSort(array, 4, 4);
        end = performance.now();
        parTime.push(end - start);
    }
    console.log(`Sequential Time: ${mean(seqTime)} ms`);
    console.log(`Parallel Time: ${mean(parTime)} ms`);
    console.log(`Speedup: ${mean(seqTime)/mean(parTime)} ms`);
})();