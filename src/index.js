import { performance } from 'perf_hooks';
import { bubbleSort } from './bubbleSort.js';
import { parallelBubbleSort } from './parallelBubbleSort.js';

function test(array) {
    for (let i = 0; i < array.length-1; i++) {
        if(array[i] > array[i+1]) return false;
    }
    return true;
}

const sizes = [10, 100, 1000, 10000, 50000];
const arrays = sizes.map((size) => Array.from({length: size}, () => Math.floor(Math.random() * size)));

console.log(`Заміри для методу bubbleSort:`);
for (let i = 0; i < sizes.length; i++) {
    const start = performance.now();
    const res = bubbleSort([...arrays[i]]);
    const end = performance.now();
    console.log(`Замір ${i + 1}: ${end - start} мс`);
    // console.log(test(res))
}

console.log(`Заміри для методу parallelBubbleSort:`);
(async () => {
    for (let i = 0; i < sizes.length; i++) {
        const start = performance.now();
        const res = await parallelBubbleSort(arrays[i]);
        const end = performance.now();
        console.log(`Замір ${i + 1}: ${end - start} мс`);
        // console.log(test(res))
        // console.log(res)
    }
})();