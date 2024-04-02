import { performance } from 'perf_hooks';
import { bubbleSort } from './bubbleSort.js';
import { parallelBubbleSort } from './parallelBubbleSort.js';
import { testSequential, testParallel } from './utils.js';

const sizes = [50000, 100000, 200000, 300000, 500000];
const threads = [1, 2, 4, 8];
const blockSizes = [1, 2, 4, 8, 10];
const arrays = sizes.map((size) => Array.from({length: size}, () => Math.floor(Math.random() * size)));
const seqResults = [];

console.log(`Sequential Bubble Sort measurements:`);
for (let i = 0; i < sizes.length; i++) {
    const start = performance.now();
    const res = bubbleSort([...arrays[i]]);
    const end = performance.now();
    console.log(`Array size ${sizes[i]}: ${end - start} ms`);
    console.log(`Is solution correct: ${testSequential(res)}`);
    seqResults.push(res);
}

console.log(`Parallel Bubble Sort measurements:`);
(async () => {
    for (const numThreads of threads) {
        console.log(`${numThreads} threads`)
        for (const block of blockSizes) {
            console.log(`Block size: ${block}`)
            for (let i = 0; i < sizes.length; i++) {
                const start = performance.now();
                const res = await parallelBubbleSort(arrays[i], block, numThreads);
                const end = performance.now();
                console.log(`Array size ${sizes[i]}: ${end - start} ms`);
                console.log(`Is solution correct: ${testParallel(res, seqResults[i])}`);
            }
        }   
    }
})();

const floatArrays = sizes.map((size) => Array.from({length: size}, () => Math.random() * size));
const seqFloatResults = [];
const comparator = (a, b) => a < b;

console.log(`Sequential Bubble Sort measurements (float):`);
for (let i = 0; i < sizes.length; i++) {
    const start = performance.now();
    const res = bubbleSort([...floatArrays[i]], comparator);
    const end = performance.now();
    console.log(`Array size ${sizes[i]}: ${end - start} ms`);
    console.log(`Is solution correct: ${testSequential(res, comparator)}`);
    seqFloatResults.push(res);
}

console.log(`Parallel Bubble Sort measurements (float):`);
(async () => {
    for (let i = 0; i < sizes.length; i++) {
        const start = performance.now();
        const res = await parallelBubbleSort(floatArrays[i], 8, 4, comparator);
        const end = performance.now();
        console.log(`Array size ${sizes[i]}: ${end - start} ms`);
        console.log(`Is solution correct: ${testParallel(res, seqFloatResults[i])}`);
    }
})();