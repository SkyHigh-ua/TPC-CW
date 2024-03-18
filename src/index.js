import { performance } from 'perf_hooks';
import { bubbleSort } from './bubbleSort.js';
import { parallelBubbleSort } from './parallelBubbleSort.js';

const sizes = [50000, 100000, 200000, 300000, 500000];
const arrays = sizes.map((size) => Array.from({length: size}, () => Math.floor(Math.random() * size)));

console.log(`Sequential Bubble Sort measurements:`);
for (let i = 0; i < sizes.length; i++) {
    const start = performance.now();
    bubbleSort([...arrays[i]]);
    const end = performance.now();
    console.log(`Array size ${sizes[i]}: ${end - start} ms`);
}

console.log(`Parallel Bubble Sort measurements:`);
(async () => {
    for (let i = 0; i < sizes.length; i++) {
        const start = performance.now();
        await parallelBubbleSort(arrays[i]);
        const end = performance.now();
        console.log(`Array size ${sizes[i]}: ${end - start} ms`);
    }
})();