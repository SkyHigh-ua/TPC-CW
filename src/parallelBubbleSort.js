import { Worker } from 'worker_threads';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

function createWorker(array, start, end) {
    const workerData = { array: array, start: start, end: end };
    const worker = new Worker(join(dirname(fileURLToPath(import.meta.url)), 'worker.js'), { workerData });
    return new Promise((resolve, reject) => {
        worker.on('message', (message) => {
            resolve(message);
        });

        worker.on('error', (error) => {
            reject(error);
        });
    });
}

export async function parallelBubbleSort(array) {       
    const sharedArray = new Int32Array(new SharedArrayBuffer(array.length * Int32Array.BYTES_PER_ELEMENT));
    sharedArray.set(array);           
    for (let i = 0; i < array.length - 1; i += 2) {
        const workers = [];
        for (let j = 0; j < array.length; j += 2) {
            workers.push(createWorker(sharedArray, j - 1, j));
        }
        await Promise.all(workers);
        for (let j = 1; j < array.length; j += 2) {
            workers.push(createWorker(sharedArray, j - 1, j));
        }
        await Promise.all(workers);
    }
    return Array.from(sharedArray);
}