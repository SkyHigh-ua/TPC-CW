import { ThreadPool } from './threadPool.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

export async function parallelBubbleSort(array, blockSize, numThreads) {
    const sharedArray = new Int32Array(new SharedArrayBuffer(array.length * Int32Array.BYTES_PER_ELEMENT));
    sharedArray.set(array);

    const pool = new ThreadPool(numThreads, join(dirname(fileURLToPath(import.meta.url)), 'worker.js'));
    const step = Math.max(1, Math.floor(array.length / blockSize));
    const tasks = [];

    for (let i = 0; i < array.length - 1; i += step) {
        const endIndex = Math.min(i + 2 * step - 1, array.length - 1);
        tasks.push({ array: sharedArray, start: i, end: endIndex });
    }
    
    for (let i = 0; i < array.length; i++) {
        const taskPromises = [];
        for (let j = 0; j < tasks.length; j++) {
            taskPromises.push(pool.submit(tasks[j]));
        }
        const isSwapped = await Promise.all(taskPromises);
        if (!isSwapped.some((swap) => swap)) break;
    }
    
    await pool.shutdown();

    return Array.from(sharedArray);
}