import { parentPort, workerData } from 'worker_threads';

const { array, start, end } = workerData;

parentPort.on('message', (message) => {
    let swapped = false;
    
    for (let i = start; i < end; i++) {
        if (array[i] > array[i + 1]) {
            [array[i], array[i + 1]] = [array[i + 1], array[i]];
            swapped = true;
        }
    }
    
    parentPort.postMessage(swapped);
})