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

        resolve(worker);
    });
}

export async function parallelBubbleSort(array) {
    const sharedArray = new Int32Array(new SharedArrayBuffer(array.length * Int32Array.BYTES_PER_ELEMENT));
    sharedArray.set(array);
    const workers = [];
    for (let i = 0; i < array.length - 1; i++) {
        const workerPromise = createWorker(sharedArray, i, i+1);
        const worker = await workerPromise;
        workers.push(worker);
    }
    
    for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < workers.length; j++) {
            workers[j].postMessage('start');
        }
        const isSwapped = await Promise.all(workers.map(worker => new Promise(resolve => worker.once('message', resolve))));
        if (!isSwapped.some((swap) => swap)) break;
    }
    
    workers.forEach((worker) => { worker.terminate() });
    return Array.from(sharedArray);
}