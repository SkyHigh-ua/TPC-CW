import { parentPort, workerData } from 'worker_threads';

const comparator = eval(`(${workerData.comparator})`);

parentPort.on('message', (task) => {
    const { array, start, end } = task;
    let swapped = false;
    
    for (let i = start; i < end; i++) {
        if (comparator(array[i], array[i + 1])) {
            [array[i], array[i + 1]] = [array[i + 1], array[i]];
            swapped = true;
        }
    }
    
    parentPort.postMessage(swapped);
})